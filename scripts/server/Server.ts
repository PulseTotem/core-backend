/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 */

/// <reference path="../Logger.ts" />

/// <reference path="./NamespaceManager"/>


var fs : any = require("fs");
var http : any = require("http");
var express : any = require("express");
var bodyParser : any = require("body-parser");
var multer : any = require('multer');
var sio : any = require("socket.io");

/**
 * Represents a Server managing Namespaces.
 *
 * @class Server
 */
class Server {

    /**
     * Server's listening port.
     *
     * @property listeningPort
     * @type number
     */
    listeningPort : number;

    /**
     * Server's app.
     *
     * @property app
     * @type any
     */
    app : any;

    /**
     * Server's http server.
     *
     * @property httpServer
     * @type any
     */
    httpServer : any;

    /**
     * Socket.io Server.
     *
     * @property ioServer
     * @type any
     */
    ioServer : any;

    /**
     * NamspaceManager list.
     * Warning: this list is not a proper array as it is used mostly as an object.
     *
     * @property namespaceManagers
     * @type Array<NamespaceManager>
     */
    namespaceManagers : Array<NamespaceManager>;

	/**
	 * Server's version.
	 *
	 * @property version
	 * @type string
	 */
	version : string;

	/**
	 * Server's name.
	 *
	 * @property name
	 * @type string
	 */
	name : string;

    /**
     * Constructor.
     *
     * @param {number} listeningPort - Listening port.
     * @param {Array<string>} arguments - Command line arguments.
	 * @param {string} uploadDir - Upload directory path.
	 */
	constructor(listeningPort : number, arguments : Array<string>, uploadDir : string = "") {
        this.namespaceManagers = new Array<NamespaceManager>();
        this.listeningPort = listeningPort;
		this.name = "Dev Server";
		this.version = "Dev Mode";

        this._argumentsProcess(arguments);

        this.app = express();
        this.app.use(bodyParser.json()); // for parsing application/json
        this.app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
		if(uploadDir != "") {
			this.app.use(multer({ dest: uploadDir })); // for parsing multipart/form-data
		} else {
			this.app.use(multer()); // for parsing multipart/form-data
		}


        this.app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
        this.httpServer = http.createServer(this.app);
        this.ioServer = sio(this.httpServer);


        this._listenRootNamespace();

        this.app.get('/', function(req, res){
            res.send('<h1>Are you lost ? * &lt;--- You are here !</h1>');
        });

        //TODO : io.origins("allowedHosts"); // see : http://socket.io/docs/server-api/#server#origins(v:string):server
    }

	/**
	 * Add a Server's API endpoint.
	 *
	 * @method addAPIEndpoint
	 * @param {string} endpointName - Tne endpoint name
	 * @param {Class} routerClass - The Router Class corresponding to endpoint
	 */
	addAPIEndpoint(endpointName : string, routerClass : any) {
		var router = new routerClass();
		router.setServer(this);
		this.app.use("/" + endpointName, router.getRouter());
	}

    /**
     * Listening Root Namespace.
     *
     * @method _listenRootNamespace
     * @private
     */
    private _listenRootNamespace() {

        this.ioServer.on('connection', function(socket){
            Logger.info("New Client Connection for Root namespace : " + socket.id);

            socket.on('disconnect', function(){
                Logger.info("Client disconnected for Root namespace : " + socket.id);
            });

            socket.on('error', function(errorData){
                Logger.info("An error occurred during Client connection for Root namespace : " + socket.id);
                Logger.debug(errorData);
            });

            socket.on('reconnect', function(attemptNumber){
                Logger.info("Client Connection for Root namespace : " + socket.id + " after " + attemptNumber + " attempts.");
            });

            socket.on('reconnect_attempt', function(){
                Logger.info("Client reconnect attempt for Root namespace : " + socket.id);
            });

            socket.on('reconnecting', function(attemptNumber){
                Logger.info("Client Reconnection for Root namespace : " + socket.id + " - Attempt number " + attemptNumber);
            });

            socket.on('reconnect_error', function(errorData){
                Logger.info("An error occurred during Client reconnection for Root namespace : " + socket.id);
                Logger.debug(errorData);
            });

            socket.on('reconnect_failed', function(){
                Logger.info("Failed to reconnect Client for Root namespace : " + socket.id + ". No new attempt will be done.");
            });
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

        this.onArgumentsProcess(arguments);
    }

    /**
     * Runs the Server.
     *
     * @method run
     */
    run() {
        var self = this;

        //Define errorHandler function.
        this.app.use(function(err, req, res, next) {
            if (res.headersSent) {
                return next(err);
            }
            res.status(500).send({ 'error': err.message });
            Logger.debug(err);
        });

        if (process.env.NODE_ENV != "test") {
			self._retrieveVersion(function() {
				self.httpServer.listen(self.listeningPort, function() {
					self.onListen();
				});
			});
        }
    }

	/**
	 * Retrieve Server Version.
	 *
	 * @method _retrieveVersion
	 * @param {Function} callback - Callback after retrieving version
	 * @private
	 */
	private _retrieveVersion(callback : Function) {
		var self = this;

		fs.stat(__dirname + '/../package.json', function(err, stat) {
			if(err == null) {
				var packageJson : any = require(__dirname + '/../package.json');
				self.name = packageJson.name;
				self.version = packageJson.version;
				callback();
			} else {
				callback();
			}
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

        var newNamespace = this.ioServer.of("/" + namespace);

        newNamespace.on('connection', function(socket){
            Logger.info("New Client Connection for namespace '" + namespace + "' : " + socket.id);

            var snm : NamespaceManager = new namespaceManager(socket);
            snm.setServer(self);
            self.namespaceManagers[socket.id] = snm;

            socket.on('disconnect', function(){
                snm.onDisconnection();
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

        return newNamespace;
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
		Logger.info(this.name + ' - v' + this.version);
        Logger.info("Server listening on *:" + this.listeningPort);
    }

	/**
	 * Method called when external message come (from API Endpoints for example)
	 * and need to be send to all NamespaceManager.
	 *
	 * @method broadcastExternalMessage
	 * @param {string} from - Source description of message
	 * @param {any} message - Received message
	 */
	broadcastExternalMessage(from : string, message : any) : boolean {
        var length = 0;
		for(var iNM in this.namespaceManagers) {
			var namespaceManager = this.namespaceManagers[iNM];
			namespaceManager.onExternalMessage(from, message);
            length++;
		}
        return (length > 0);
	}

	/**
	 * Search NamespaceManager corresponding to socket's id in param.
	 *
	 * @method retrieveNamespaceManagerFromSocketId
	 * @param {string} socketId - The socket's id attached to NamespaceManager
	 * @returns null if not found, NamespaceManager if found
	 */
    retrieveNamespaceManagerFromSocketId(socketId : string) {
		if(typeof(this.namespaceManagers[socketId]) == "undefined") {
			return null;
		} else {
			return this.namespaceManagers[socketId];
		}
    }

    serveStaticDirectory(directory : string) {
        this.app.use("/"+directory, express.static(directory));
    }
}