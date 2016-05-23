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
var NodeRestClient : any = require('node-rest-client').Client;

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
	 * Client Call
	 *
	 * @property _clientCall
	 * @type ClientCall
	 * @private
	 */
	private _clientCall : ClientCall;

	/**
	 * Interval Timer for Push Info to Client in Infinite Mode.
	 *
	 * @property intervalTimer
	 */
	intervalTimer : any;

	/**
	 * The params used by the source call
	 *
	 * @property _params
	 * @type any
	 */
	private _params : any;

    /**
     * Constructor.
     *
     * @constructor
     * @param {any} socket - The socket.
     */
    constructor(socket : any) {
        super(socket);

		this.intervalTimer = null;

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
	 * Set the params of the call
	 * @param params
	 */
	public setParams(params : any) {
		this._params = params;
	}

	/**
	 * Get params of the call
	 * @returns {any}
	 */
	public getParams() : any {
		return this._params;
	}

	/**
	 * Check validity of the parameters given the mandatory param keys
	 * @param paramNames List of mandatory param keys
	 * @returns {boolean} Return false if one parameter is not defined. True if all param keys are found.
	 */
	public checkParams(paramNames : Array<string>) : boolean {
		for (var i = 0; i < paramNames.length; i++) {
			var paramName = paramNames[i];
			if (this._params[paramName] == undefined) {
				Logger.error("ParameterError : the following parameter is undefined : "+paramName);
				return false;
			}
		}
		return true;
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

        self._clientCall = self._sourceServer.retrieveClientCall(clientCallDescription.callHash);

        if(self._clientCall != null) {
//            self._sourceServer.setHashForSocketId(self.socket.id, clientCallDescription.callHash);

			self.socket.emit("CallOK", self.formatResponse(true, {"hash" : clientCallDescription.callHash}));

	        self.setParams(self._clientCall.getCallParams());

            var callBack = self._clientCall.getCallCallback();
	        callBack(self._clientCall.getCallParams(), self);

			self.intervalTimer = setInterval(function() {
				callBack(self._clientCall.getCallParams(), self);
			}, self._clientCall.getCallParams()["refreshTime"]*1000);


        } else {
            Logger.error("ClientCall with hash '" + clientCallDescription.callHash + "' wasn't retrieved...");
			self.socket.emit("CallOK", self.formatResponse(false, {"hash" : clientCallDescription.callHash}));
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
	    newInfo.setServiceLogo(this._clientCall.getCallParams()["serviceLogo"]);
	    newInfo.setServiceName(this._clientCall.getCallParams()["serviceName"]);
	    newInfo.propagateServiceInfo();
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
	manageOAuth(providerName : string, oAuthKey : string, successCB : Function, failCB : Function, headers : any = null) {
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

					if (headers == null) {
						var postAction : any = request_object.post(url, {
							data: data
						});
						postAction.then(function(response) {
							successCallback(response);
						}).fail(function(err) {
							failCallback(err);
						});
					} else {
						var client = new NodeRestClient();

						headers["access_token"] = request_object.access_token;
						headers["oauth_token"] = request_object.oauth_token;
						headers["oauth_token_secret"] = request_object.oauth_token_secret;

						var args = {
							data: data,
							headers: headers
						};

						client.post(url, args, function (data, response) {
							if(response.statusCode >= 200 && response.statusCode < 300) {
								successCallback(data);
							} else {
								failCallback(data);
							}
						});
					}

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

	/**
	 * Return the SDI Id if parameters are defined. Else it returns -1.
	 *
	 * @method getSDIId
	 * @returns number
	 */
	getSDIId() : number {
		if (this._params != null && this._params["SDI"]) {
			return this._params["SDI"].id;
		} else {
			return -1;
		}
	}

	/**
	 * Return the Profil Id if parameters are defined. Else it returns -1;
	 *
	 * @method getProfilId
	 * @returns number
     */
	getProfilId() : number {
		if (this._params != null && this._params["SDI"]) {
			return this._params["SDI"].profilId;
		} else {
			return -1;
		}
	}

	/**
	 * Return the hash profil if parameters are defined. Else it returns empty string.
	 *
	 * @method getHashProfil
	 * @returns string
     */
	getHashProfil() : string {
		if (this._params != null && this._params["SDI"]) {
			return this._params["SDI"].hashProfil;
		} else {
			return "";
		}
	}
}