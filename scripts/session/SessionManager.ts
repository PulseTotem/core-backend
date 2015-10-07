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
	 * NamespaceManagers attached to each Session.
	 *
	 * /!\ This is not a real Array... It's considered as an Object cause we use string indexation. /!\
	 *
	 * @property _attachedNamespaces
	 * @type Array<NamespaceManager>
	 */
	private _attachedNamespaces : Array<NamespaceManager>;

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
		this._attachedNamespaces = new Array<NamespaceManager>();
		this._activeSession = null;
	}

	/**
	 * Add a session to this SessionManager. If there is no active session, it actives the new one.
	 *
	 * @method _addSession
	 * @private
	 * @param {Session} newSession - Session to add.
	 * @param {NamespaceManager} attachedNamespace - NamespaceManager to attach to Session.
	 */
	private _addSession(newSession : Session, attachedNamespace : NamespaceManager) {

		this._attachedNamespaces[newSession.id()] = attachedNamespace;

		if(this._activeSession == null) {
			this._activateSession(newSession);
		} else {
			this._sessions.push(newSession);
		}
	}

	/**
	 * Activate the session in param.
	 *
	 * @method _activateSession
	 * @private
	 * @param {Session} session - Session to activate.
	 */
	private _activateSession(session : Session) {
		session.activate();
		this._activeSession = session;

		if(typeof(this._attachedNamespaces[this._activeSession.id()]) != "undefined") {
			this._attachedNamespaces[this._activeSession.id()].lockControl(this._activeSession);
			this._sessionSourceNM.lockControl(this._activeSession);
		} /* else { // TODO : ERROR !!!!!

		}*/

	}

	/**
	 * Creation a new Session for the NamespaceManager who ask it.
	 *
	 * @method newSession
	 * @param {NamespaceManager} enquirerNamespace - NamespaceManager who ask for new Session.
	 */
	newSession(enquirerNamespace : NamespaceManager) {
		var newSession : Session = new Session();

		this._addSession(newSession, enquirerNamespace);

		return newSession;
	}
}