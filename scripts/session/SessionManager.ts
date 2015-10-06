/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 */

/// <reference path="./SessionNamespaceManagerItf.ts"/>
/// <reference path="./SessionSourceNamespaceManager.ts"/>
/// <reference path="./Session.ts"/>

/**
 * Manage session for a Source.
 *
 * @class SessionManager
 */
class SessionManager {

	/**
	 * SessionSourceNamespaceManager attached to this SessionManager.
	 *
	 * @property _sessionSourceNM
	 * @type SessionSourceNamespaceManager
	 */
	private _sessionSourceNM : SessionSourceNamespaceManager;

	/**
	 * SessionManager's Sessions.
	 *
	 * @property _sessions
	 * @type Array<Session>
	 */
	private _sessions : Array<Session>;

	/**
	 * SessionManager's active session.
	 *
	 * @property _activeSession
	 * @type Session
	 */
	private _activeSession : Session;

	/**
	 * Constructor.
	 *
	 * @constructor
	 * @param {SessionSourceNamespaceManager} sessionSourceNM - The namespace manager attached to this SessionManager.
	 */
	constructor(sessionSourceNM : SessionSourceNamespaceManager) {
		this._sessionSourceNM = sessionSourceNM;
		this._sessions = new Array<Session>();
		this._activeSession = null;
	}

	/**
	 * Add a session to this SessionManager. If there is no active session, it actives the new one.
	 *
	 * @method _addSession
	 * @private
	 * @param {Session} newSession - Session to add.
	 */
	private _addSession(newSession : Session) {
		if(this._activeSession == null) {
			newSession.activate();
			this._activeSession = newSession;
		} else {
			this._sessions.push(newSession);
		}
	}

	/**
	 * Creation a new Session for the NamespaceManager who ask it.
	 *
	 * @method newSession
	 * @param {NamespaceManager} enquirerNamespace - NamespaceManager who ask for new Session.
	 */
	newSession(enquirerNamespace : NamespaceManager) {
		var newSession : Session = new Session();

		this._addSession(newSession);

		return newSession;
	}
}