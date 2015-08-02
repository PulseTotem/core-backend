/**
 * @author Christian Brel <ch.brel@gmail.com>
 */

/// <reference path="../../t6s-core/core/scripts/logger/Logger.ts" />

var express : any = require("express");

/**
 * Router Interface
 *
 * @class RouterItf
 */
class RouterItf {

	/**
	 * Router property.
	 *
	 * @property router
	 * @type any
	 */
	router : any;

	/**
	 * Server.
	 *
	 * @property server
	 * @type Server
	 */
	server : Server;

	/**
	 * Constructor.
	 */
	constructor() {
		this.router = express.Router();
		this.server = null;

		this.buildRouter();
	}

	/**
	 * Return router.
	 *
	 * @method getRouter
	 */
	getRouter() {
		return this.router;
	}

	/**
	 * Set the Server.
	 *
	 * @method setServer
	 * @param {Server} server - The server to set.
	 */
	setServer(server : Server) {
		this.server = server;
	}

	/**
	 * Method called during Router creation.
	 *
	 * @method buildRouter
	 */
	buildRouter() {
		Logger.error("RouterItf - buildRouter : Method need to be implemented.");
	}
}