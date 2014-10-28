/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/// <reference path="../libsdef/node.d.ts" />
/// <reference path="../libsdef/express.d.ts" />
/// <reference path="../libsdef/socket.io-0.9.10.d.ts" />

/// <reference path="./Logger.ts" />
/// <reference path="./LoggerLevel.ts" />

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
     * Constructor.
     *
     * @param {number} listeningPort - Listening port.
     * @param {Array<string>} arguments - Command line arguments.
     */
    constructor(listeningPort : number, arguments : Array<string>) {
        this._listeningPort = listeningPort;

        this._argumentsProcess(arguments);

        var app = express();
        this._httpServer = http.createServer(app);
        this._ioServer = sio.listen(this._httpServer);

        app.get('/', function(req, res){
            res.send('<h1>Are you lost ? * &lt;--- You are here !</h1>');
        });
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

        this.onArgumentsProcess();
    }

    /**
     * Runs the Server.
     *
     * @method run
     */
    run() {
        var self = this;

        this._httpServer.listen(this._listeningPort, this.onListen);
    }

    addNamespace(namespace : string) {
        var newNamespace = this._ioServer.of("/" + namespace);

        newNamespace.on('connection', function(socket){
            Logger.info("New The 6th Screen SourcesServer Connection : " + socket.id);

            socket.on('RetrieveFeedContent', function(params) {
                self._retrieveFeedContent(params, socket);
            });

            socket.on('disconnect', function(){
                Logger.info("The 6th Screen SourcesServer disconnected : " + socket.id);
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