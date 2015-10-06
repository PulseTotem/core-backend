/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 */

/// <reference path="./SessionStatus.ts"/>

var uuid : any = require('node-uuid');

/**
 * Represents a Session.
 *
 * @class Session
 */
class Session {

	/**
	 * Session's id.
	 *
	 * @property _id
	 * @type string
	 */
	private _id : string;

	/**
	 * Session's status.
	 *
	 * @property _status
	 * @type SessionStatus
	 */
	private _status : SessionStatus;

	/**
	 * Constructor.
	 *
	 * @constructor
	 */
	constructor() {
		this._id = uuid.v1();
		this._status = SessionStatus.WAITING;
	}

	/**
	 * Returns Session's Id.
	 *
	 * @method id
	 * @returns string
	 */
	id() : string {
		return this._id;
	}

	/**
	 * Returns Session's status.
	 *
	 * @method status
	 * @returns SessionStatus
	 */
	status() : SessionStatus {
		return this._status;
	}

	/**
	 * Activate this session (change status to ACTIVE).
	 *
	 * @method activate
	 */
	activate() {
		this._status = SessionStatus.ACTIVE;
	}
}