/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../../libsdef/node-uuid.d.ts" />

/// <reference path="../Logger.ts" />

/// <reference path="../../t6s-core/core/scripts/infotype/Info.ts" />

/// <reference path="./SourceServer.ts" />
/// <reference path="./NamespaceManager.ts" />
/// <reference path="./ClientCall.ts" />

var uuid : any = require('node-uuid');
var OAuth : any = require('oauthio');

class SourceNamespaceManager extends NamespaceManager {

    /**
     * Source Server.
     *
     * @property _sourceServer
     * @type SourceServer
     * @private
     */
    private _sourceServer : SourceServer;

	/**
	 * Interval Timer for Push Info to Client in Infinite Mode.
	 *
	 * @property intervalTimer
	 */
	intervalTimer : any;

    /**
     * Constructor.
     *
     * @constructor
     * @param {any} socket - The socket.
     */
    constructor(socket : any) {
        super(socket);

		this.intervalTimer = null;

        super.addListenerToSocket('ping', this.processPing);
        super.addListenerToSocket('newCall', this.processNewCall);
    }

    /**
     * Set the source server.
     *
     * @method setServer
     * @param server
     */
    setServer(server : SourceServer) {
        Logger.debug("Set Source Server.");
        this._sourceServer = server;
    }

    /**
     * Process ping.
     *
     * @method processPing
     * @param {Object} clientCallDescription - Client's call description.
     * @param {SourceNamespaceManager} self - The SourceNamespaceManager's instance.
     */
    processPing(clientCallDescription : any, self : SourceNamespaceManager = null) {
        Logger.debug(clientCallDescription);
        //clientCallDescription = {"callHash" : string}
        if(self == null) {
            self = this;
        }

        var clientCall = self._sourceServer.retrieveClientCall(clientCallDescription.callHash);

        if(clientCall != null) {
            //if(self._sourceServer.getHashForSocketId(self.socket.id) == clientCallDescription.callHash) {
                self.socket.emit("pingAnswer", self.formatResponse(true, {"sendingInfos" : true}));
            /*} else {
                self.socket.emit("pingAnswer", {"sendingInfos" : false});
            }*/
        } else {
            //TODO - Manage error...
            Logger.error("ClientCall with hash '" + clientCallDescription.callHash + "' wasn't retrieved...");
        }
    }

    /**
     * Process new Call connection.
     *
     * @method processNewCall
     * @param {Object} clientCallDescription - Client's call description.
     * @param {SourceNamespaceManager} self - The SourceNamespaceManager's instance.
     */
    processNewCall(clientCallDescription : any, self : SourceNamespaceManager = null) {
        Logger.debug(clientCallDescription);
        //clientCallDescription = {"callHash" : string}
        if(self == null) {
            self = this;
        }

        var clientCall = self._sourceServer.retrieveClientCall(clientCallDescription.callHash);

        if(clientCall != null) {

//            self._sourceServer.setHashForSocketId(self.socket.id, clientCallDescription.callHash);

            var callBack = clientCall.getCallCallback();
	        callBack(clientCall.getCallParams(), self);

			self.intervalTimer = setInterval(function() {
				callBack(clientCall.getCallParams(), self);
			}, 1000*60*2);


        } else {
            //TODO - Manage error...
            Logger.error("ClientCall with hash '" + clientCallDescription.callHash + "' wasn't retrieved...");
        }
    }

    /**
     * Add a listener to socket.
     *
     * @method addListenerToSocket
     * @param {string} listenerName - The listener name.
     * @param {Function} callBackFunction - The callback function for listener.
     */
    addListenerToSocket(listenerName : string, callBackFunction : Function) {
        var self = this;

        var hash = uuid.v1();

        this.socket.on(listenerName, function(params) {
            Logger.debug("New ClientCall !");
            self._sourceServer.addClientCall(new ClientCall(hash, params, callBackFunction));
            self.socket.emit("connectionHash", self.formatResponse(true, {"hash" : hash}));
        });
    }

    /**
     * Send new Info to client.
     *
     * @method sendNewInfoToClient
     * @param {Info} newInfo - The Info to send.
     */
    sendNewInfoToClient(newInfo : Info) {
        Logger.debug("Send New info.");
        this.socket.emit("newInfo", newInfo);
    }

    /**
     * Method called when socket is disconnected.
     *
     * @method onClientDisconnection
     */
    onClientDisconnection() {
		if(this.intervalTimer != null) {
			clearInterval(this.intervalTimer);
			this.intervalTimer = null;
		}
        this._sourceServer.setHashForSocketId(this.socket.id, null);
        this.onDisconnection();
    }

	/**
	 * Method to manage authentication to services.
	 *
	 * @param {string} providerName - The provider's name.
	 * @param {string} oAuthKey - The User OAuthKey.
	 * @param {Function} successCB - Callback function when authentication is success
	 * @param {Function} failCB - Callback function when authentication is fail
	 */
	manageOAuth(providerName : string, oAuthKey : string, successCB : Function, failCB : Function) {
		OAuth.setOAuthdURL("http://oauth.the6thscreen.fr/");
		OAuth.initialize('VLoeXhqFq66JBj55UFqCMyjz8wk', '7j7FP7vPOnw5wNuhNNkxvoppRpo');

		OAuth.auth(providerName, {}, {
			credentials: JSON.parse(oAuthKey)
		})
		.then(function (request_object) {
			// request_object contains the access_token if OAuth 2.0
			// or the couple oauth_token,oauth_token_secret if OAuth 1.0
			// request_object also contains methods get|post|patch|put|delete|me

			var oauthActions = {
				get : function (url, successCallback, failCallback) {
					var getAction : any = request_object.get(url);
					getAction.then(function(response) {
						successCallback(response);
					}).fail(function(err) {
						failCallback(err);
					});
				},
				post : function (url, data, successCallback, failCallback) {
					var postAction : any = request_object.post(url, {
						data: data
					});
					postAction.then(function(response) {
						successCallback(response);
					}).fail(function(err) {
						failCallback(err);
					});
				},
				patch : function (url, data, successCallback, failCallback) {
					var patchAction : any = request_object.patch(url, {
						data: data
					});
					patchAction.then(function(response) {
						successCallback(response);
					}).fail(function(err) {
						failCallback(err);
					});
				},
				put : function (url, data, successCallback, failCallback) {
					var putAction : any = request_object.put(url, {
						data: data
					});
					putAction.then(function(response) {
						successCallback(response);
					}).fail(function(err) {
						failCallback(err);
					});
				},
				del : function (url, successCallback, failCallback) {
					var delAction : any = request_object.del(url);
					delAction.then(function(response) {
						successCallback(response);
					}).fail(function(err) {
						failCallback(err);
					});
				}
			};

			successCB(oauthActions);
		})
		.fail(function (e) {
			//handle errors here
			failCB(e);
		});
	}
}