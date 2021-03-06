/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../Logger.ts" />

/// <reference path="./Server.ts"/>
/// <reference path="./SourceNamespaceManager"/>

/**
 * Represents a Server managing Namespaces.
 *
 * @class SourceServer
 * @extends Server
 */
class SourceServer extends Server {

    /**
     * List of ClientCalls.
     *
     * @property _clientCalls
     * @type Array<ClientCall>
     */
    private _clientCalls: Array<ClientCall>;

    /**
     * Map between Sockets' Id and Call's Hash.
     *
     * @property _mapSocketIdHash
     * @type Array<string>
     */
    private _mapSocketIdHash: Array<string>;

    /**
     * Constructor.
     *
     * @param {number} listeningPort - Listening port.
     * @param {Array<string>} arguments - Command line arguments.
	 * @param {string} uploadDir - Upload directory path.
	 */
	constructor(listeningPort : number, arguments : Array<string>, uploadDir : string = "") {
        super(listeningPort, arguments, uploadDir);
        this._clientCalls = new Array<ClientCall>();
        this._mapSocketIdHash = new Array<string>();
	}

    /**
     * Declare a namespace for server.
     *
     * @method addNamespace
     * @param {string} namespace - Namespace name to add.
     * @param {Class} sourceNamespaceManager - SourceNamespaceManager class.
     */
    addNamespace(namespace : string, sourceNamespaceManager : any) {
        var self = this;

        var newNamespace = this.ioServer.of("/" + namespace);

        newNamespace.on('connection', function(socket){
            Logger.info("New Client Connection for source namespace '" + namespace + "' : " + socket.id);

            var snm : SourceNamespaceManager = new sourceNamespaceManager(socket);
            snm.setServer(self);
            self.namespaceManagers[socket.id] = snm;

            socket.on('disconnect', function(){
                snm.onClientDisconnection();
                delete(self.namespaceManagers[socket.id]);
                Logger.info("Client disconnected for namespace '" + namespace + "' : " + socket.id);
            });

			socket.on('error', function(errorData){
				Logger.info("An error occurred during Client connection for namespace '" + namespace + "' : " + socket.id);
				Logger.debug(errorData);
			});

			socket.on('reconnect', function(attemptNumber){
				Logger.info("Client Connection for namespace '" + namespace + "' : " + socket.id + " after " + attemptNumber + " attempts.");
			});

			socket.on('reconnect_attempt', function(){
				Logger.info("Client reconnect attempt for namespace '" + namespace + "' : " + socket.id);
			});

			socket.on('reconnecting', function(attemptNumber){
				Logger.info("Client Reconnection for namespace '" + namespace + "' : " + socket.id + " - Attempt number " + attemptNumber);
			});

			socket.on('reconnect_error', function(errorData){
				Logger.info("An error occurred during Client reconnection for namespace '" + namespace + "' : " + socket.id);
				Logger.debug(errorData);
			});

			socket.on('reconnect_failed', function(){
				Logger.info("Failed to reconnect Client for namespace '" + namespace + "' : " + socket.id + ". No new attempt will be done.");
			});
        });
    }

    /**
     * Add a new ClientCall.
     *
     * @method addClientCall
     * @param {ClientCall} clientCall - A ClientCall instance.
     */
    addClientCall(clientCall : ClientCall) {
        this._clientCalls.push(clientCall);
    }

    /**
     * Returns ClientCall corresponding to call's hash.
     *
     * @method retrieveClientCall
     * @param {string} callHash - The Call's hash.
     */
    retrieveClientCall(callHash : string) {
        for(var iClientCall in this._clientCalls) {
            var clientCall = this._clientCalls[iClientCall];
            if(clientCall.getCallHash() == callHash) {
                return clientCall;
            }
        }

        return null;
    }

    /**
     * Associate a call's hash to socket Id.
     *
     * @method setHashForSocketId
     * @param {string} socketId - The Socket's Id.
     * @param {string} callHash - The Call's hash.
     */
    setHashForSocketId(socketId : string, callHash : string) {
        this._mapSocketIdHash[socketId] = callHash;
    }

    /**
     * Returns call's hash associate to socket Id.
     *
     * @method setHashForSocketId
     * @param {string} socketId - The Socket's Id.
     */
    getHashForSocketId(socketId : string) {
        if(typeof(this._mapSocketIdHash[socketId]) != "undefined") {
            return this._mapSocketIdHash[socketId];
        }

        return null;
    }
}