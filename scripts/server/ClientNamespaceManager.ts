/**
 * @author Simon Urli <simon@pulsetotem.fr>
 */

/// <reference path="./NamespaceManager.ts" />
/// <reference path="../session/SessionNamespaceManagerItf.ts" />
/// <reference path="../session/Session.ts" />
/// <reference path="../session/SessionStatus.ts" />

/**
 * Represents the PulseTotem NamespaceManager to manage connections from mobile clients.
 *
 * @class ClientNamespaceManager
 * @extends NamespaceManager
 * @implements SessionNamespaceManagerItf
 */
class ClientNamespaceManager extends NamespaceManager implements SessionNamespaceManagerItf {

	/**
	 * Call NamespaceManager.
	 *
	 * @property _callNamespaceManager
	 * @type NamespaceManager
	 */
	private _callNamespaceManager: SessionSourceNamespaceManager;

	private _timeoutDuration : number;

	private _timeoutId : any;

	/**
	 * Constructor.
	 *
	 * @constructor
	 * @param {any} socket - The socket.
	 */
	constructor(socket:any) {
		super(socket);

		this._callNamespaceManager = null;
		this._timeoutDuration = null;
		this._timeoutId = null;

		var self = this;

		super.addListenerToSocket('TakeControl', function (callSocketId:any, self:ClientNamespaceManager) {
			self.takeControl(callSocketId);
		});
	}

	/**
	 * Search for callSocket and init a Session to take control on screen.
	 *
	 * @method takeControl
	 * @param {Object} callSocketId - A JSON object with callSocket's Id.
	 */
	takeControl(callSocketId:any) {
		var self = this;

		var callNamespaceManager = self.server().retrieveNamespaceManagerFromSocketId(callSocketId.callSocketId);

		if (callNamespaceManager == null) {
			self.socket.emit("ControlSession", self.formatResponse(false, "NamespaceManager corresponding to callSocketid '" + callSocketId.callSocketId + "' doesn't exist."));
		} else {
			self._callNamespaceManager = callNamespaceManager;

			var newSession:Session = self._callNamespaceManager.newSession(self);

			var paramTimeoutDuration = self._callNamespaceManager.getParams().TimeoutDuration;

			if (paramTimeoutDuration != undefined) {
				self._timeoutDuration = parseInt(paramTimeoutDuration);
			} else {
				self._timeoutDuration = 30;
			}

			self.socket.emit("ControlSession", self.formatResponse(true, newSession));
			self.resetTimeout();
		}
	}

	/**
	 * Add a listener to socket but set the timeout before calling callback.
	 * Moreover it checks if the callNamespaceManager is set, else it just leave logging an error.
	 *
	 * @method addListenerToSocket
	 * @param {string} listenerName - The listener name.
	 * @param {Function} callBackFunction - The callback function for listener.
	 */
	addListenerToSocket(listenerName : string, callBackFunction : Function) {
		var self = this;

		this.socket.on(listenerName, function(content) {
			if (self._callNamespaceManager != null) {
				self.resetTimeout();
				callBackFunction(content, self);
			} else {
				Logger.error("Can't call callback for "+listenerName+" because the callNamespaceManager is not set yet.");
			}
		});
	}

	public getCallNamespaceManager() : SourceNamespaceManager {
		return this._callNamespaceManager;
	}

	public resetTimeout() {
		var self = this;

		if (self._timeoutId != null) {
			clearTimeout(self._timeoutId);
		}

		var functionTimeout = function () {
			self.socket.disconnect();
		};

		self._timeoutId = setTimeout(functionTimeout, self._timeoutDuration*1000);
	}

	/**
	 * Lock the control of the Screen for the Session in param.
	 *
	 * @method lockControl
	 * @param {Session} session - Session which takes the control of the Screen.
	 */
	lockControl(session : Session) {
		var self = this;

		self.socket.emit("LockedControl", self.formatResponse(true, session));
	}

	/**
	 * Unlock the control of the Screen for the Session in param.
	 *
	 * @method unlockControl
	 * @param {Session} session - Session which takes the control of the Screen.
	 */
	unlockControl(session : Session) {
		var self = this;

		self.socket.emit("UnlockedControl", self.formatResponse(true, session));
	}

	/**
	 * Method called when socket is disconnected.
	 *
	 * @method onClientDisconnection
	 */
	onClientDisconnection() {
		var self = this;

		this.onDisconnection();

		if(self._callNamespaceManager != null) {
			self._callNamespaceManager.getSessionManager().finishActiveSession();
		}
	}


}