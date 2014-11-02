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
     * Constructor.
     *
     * @param {number} listeningPort - Listening port.
     * @param {Array<string>} arguments - Command line arguments.
     */
    constructor(listeningPort : number, arguments : Array<string>) {
        super(listeningPort, arguments);
        this._clientCalls = new Array<ClientCall>();
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
                delete(self.namespaceManagers[socket.id]);
                Logger.info("Client disconnected for namespace '" + namespace + "' : " + socket.id);
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
}