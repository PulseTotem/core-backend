/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 */

/// <reference path="../server/SourceNamespaceManager.ts" />
/// <reference path="./SessionNamespaceManagerItf.ts" />
/// <reference path="./SessionManager.ts" />

/**
 * Represents the PulseTotem SessionSourceNamespaceManager : a SourceNamespaceManager managing Session.
 *
 * @class SessionSourceNamespaceManager
 * @extends SourceNamespaceManager
 * @implements SessionNamespaceManagerItf
 */
class SessionSourceNamespaceManager extends SourceNamespaceManager implements SessionNamespaceManagerItf {

	/**
	 * SessionSourceNamespaceManager's SessionManager.
	 *
	 * @property _sessionManager
	 * @type SessionManager
	 */
	private _sessionManager : SessionManager;

	/**
	 * Constructor.
	 *
	 * @constructor
	 * @param {any} socket - The socket.
	 */
	constructor(socket : any) {
		super(socket);

		this.onCreation();
	}

	/**
	 * Method called on SessionSourceNamespaceManager creation.
	 *
	 * @method onCreation
	 */
	onCreation() {
		this._sessionManager = new SessionManager(this);
	}

	/**
	 * Return SessionManager.
	 *
	 * @method getSessionManager
	 */
	getSessionManager() {
		return this._sessionManager;
	}

	/**
	 * Creation a new Session for the NamespaceManager who ask it.
	 *
	 * @method newSession
	 * @param {NamespaceManager} enquirerNamespace - NamespaceManager who ask for new Session.
	 */
	newSession(enquirerNamespace : NamespaceManager) {
		return this._sessionManager.newSession(enquirerNamespace);
	}

	/**
	 * Lock the control of the Screen for the Session in param.
	 *
	 * @method lockControl
	 * @param {Session} session - Session which takes the control of the Screen.
	 */
	lockControl(session : Session) {
		var self = this;

		self.socket.emit("LockedControl", session);
	}

	/**
	 * Unlock the control of the Screen for the Session in param.
	 *
	 * @method unlockControl
	 * @param {Session} session - Session which takes the control of the Screen.
	 */
	unlockControl(session : Session) {
		var self = this;

		self.socket.emit("UnlockedControl", session);
	}
}