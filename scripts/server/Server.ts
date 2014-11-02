/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../../libsdef/node.d.ts" />
/// <reference path="../../libsdef/express.d.ts" />
/// <reference path="../../libsdef/socket.io-0.9.10.d.ts" />

/// <reference path="../Logger.ts" />
/// <reference path="../LoggerLevel.ts" />

/// <reference path="./NamespaceManager"/>


var http = require("http");
var express = require("express");
var sio = require("socket.io");

/**
 * Represents a Server managing Namespaces.
 *
 * @class Server
 */
class Server {

    /**
     * Server's listening port.
     *
     * @property _listeningPort
     * @type number
     * @private
     */
    private _listeningPort : number;

    /**
     * Server's app.
     *
     * @property _app
     * @type any
     * @private
     */
    private _app : any;

    /**
     * Server's http server.
     *
     * @property _httpServer
     * @type any
     * @private
     */
    private _httpServer : any;

    /**
     * Socket.io Server.
     *
     * @property _ioServer
     * @type any
     * @private
     */
    private _ioServer : any;

    /**
     * NamspaceManager list.
     *
     * @property _namespaceManagers
     * @type Array<NamespaceManager>
     * @private
     */
    private _namespaceManagers : Array<NamespaceManager>;

    /**
     * Constructor.
     *
     * @param {number} listeningPort - Listening port.
     * @param {Array<string>} arguments - Command line arguments.
     */
    constructor(listeningPort : number, arguments : Array<string>) {
        this._namespaceManagers = new Array<NamespaceManager>();
        this._listeningPort = listeningPort;

        this._argumentsProcess(arguments);

        this._app = express();
        this._httpServer = http.createServer(this._app);
        this._ioServer = sio.listen(this._httpServer);

        this._app.get('/', function(req, res){
            res.send('<h1>Are you lost ? * &lt;--- You are here !</h1>');
        });

        //TODO : io.origins("allowedHosts"); // see : http://socket.io/docs/server-api/#server#origins(v:string):server
    }

    /**
     * Process command line arguments.
     *
     * @method _argumentsProcess
     * @private
     * @param {Array<string>} arguments - Command line arguments.
     */
    private _argumentsProcess(arguments : Array<string>) {
        var logLevel = LoggerLevel.Error;

        if(process.argv.length > 2) {
            var param = process.argv[2];
            var keyVal = param.split("=");
            if(keyVal.length > 1) {
                if (keyVal[0] == "loglevel") {
                    switch(keyVal[1]) {
                        case "error" :
                            logLevel = LoggerLevel.Error;
                            break;
                        case "warning" :
                            logLevel = LoggerLevel.Warning;
                            break;
                        case "info" :
                            logLevel = LoggerLevel.Info;
                            break;
                        case "debug" :
                            logLevel = LoggerLevel.Debug;
                            break;
                        default :
                            logLevel = LoggerLevel.Error;
                    }
                }
            }
        }

        Logger.setLevel(logLevel);

        this.onArgumentsProcess(arguments);
    }

    /**
     * Runs the Server.
     *
     * @method run
     */
    run() {
        var self = this;

        this._httpServer.listen(this._listeningPort, function() {
            self.onListen();
        });
    }

    /**
     * Declare a namespace for server.
     *
     * @method addNamespace
     * @param {string} namespace - Namespace name to add.
     * @param {Class} namespaceManager - NamespaceManager class.
     */
    addNamespace(namespace : string, namespaceManager : any) {
        var self = this;

        var newNamespace = this._ioServer.of("/" + namespace);

        newNamespace.on('connection', function(socket){
            Logger.info("New Client Connection for namespace '" + namespace + "' : " + socket.id);

            self._namespaceManagers[socket.id] = new namespaceManager(socket);

            socket.on('disconnect', function(){
                delete(self._namespaceManagers[socket.id]);
                Logger.info("Client disconnected for namespace '" + namespace + "' : " + socket.id);
            });
        });
    }

    /**
     * Method called after arguments process.
     *
     * @method onArgumentsProcess
     * @param {Array<string>} arguments - Command line arguments.
     */
    onArgumentsProcess(arguments : Array<string>) {
        //Nothing to do.
    }

    /**
     * Method called on server listen action.
     *
     * @method onListen
     */
    onListen() {
        Logger.info("Server listening on *:" + this._listeningPort);
    }
}