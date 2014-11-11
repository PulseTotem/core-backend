/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../../libsdef/node-uuid.d.ts" />

/// <reference path="../Logger.ts" />

/// <reference path="./SourceServer.ts" />
/// <reference path="./NamespaceManager.ts" />
/// <reference path="./ClientCall.ts" />

var uuid = require('node-uuid');

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
     * Constructor.
     *
     * @constructor
     * @param {any} socket - The socket.
     */
    constructor(socket : any) {
        super(socket);

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
            if(self._sourceServer.getHashForSocketId(self.socket.id) == clientCallDescription.callHash) {
                self.socket.emit("pingAnswer", {"sendingInfos" : true});
            } else {
                self.socket.emit("pingAnswer", {"sendingInfos" : false});
            }
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

            self._sourceServer.setHashForSocketId(self.socket.id, clientCallDescription.callHash);

            var callBack = clientCall.getCallCallback();
            callBack(clientCall.getCallParams(), self);
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
            self.socket.emit("connectionHash", {"hash" : hash});
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
        this._sourceServer.setHashForSocketId(this.socket.id, null);
        this.onDisconnection();
    }
}