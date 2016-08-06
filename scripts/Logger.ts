/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 */
/// <reference path="../t6s-core/core/libsdef/node.d.ts" />
/// <reference path="./LoggerLevel.ts" />

var winston : any = require('winston');

/**
 * Represents a logger with a coloration option.
 *
 * @class Logger
 */
class Logger {
    /**
     * Status of color mode.
     *
     * @property color
     * @type boolean
     * @static
     * @default true
     */
    static color : boolean = true;

	/**
	 * Level status of the logger.
	 *
	 * @property level
	 * @type LoggerLevel
	 * @static
	 * @default Error
	 */
	static level : LoggerLevel = LoggerLevel.Error;

	/**
	 * Winston Logger.
	 *
	 * @property logger
	 * @type any (Winston Logger)
	 * @static
	 * @default null
	 */
	static logger : any = null;

	/**
	 * Return an instance of Winston Logger.
	 *
	 * @method getLogger
	 * @static
	 */
	static getLogger() {
		if(Logger.logger == null) {
			Logger.buildLogger();
		}

		return Logger.logger;
	}

	/**
	 * Build Winston Logger instance.
	 *
	 * @method buildLogger
	 * @static
	 */
	static buildLogger() {
		Logger.logger = new winston.Logger({
			exitOnError: false
		});

		Logger.manageConsoleTransport();
	}

	/**
	 * Manage Console transport for Winston Logger instance.
	 *
	 * @method manageConsoleTransport
	 * @static
	 */
	static manageConsoleTransport() {
		var options : any = {
			handleExceptions: true,
			prettyPrint: true,
			timestamp : true
		};

		options["colorize"] = Logger.color;

		switch(Logger.level) {
			case LoggerLevel.Error :
				options["level"] = 'error';
				break;
			case LoggerLevel.Warning :
				options["level"] = 'warn';
				break;
			case LoggerLevel.Info :
				options["level"] = 'info';
				break;
			case LoggerLevel.Verbose :
				options["level"] = 'verbose';
				break;
			case LoggerLevel.Debug :
				options["level"] = 'debug';
				break;
			default :
				options["level"] = 'info';
		}

		if(Logger.logger.transports.length > 0) {
			if(typeof(Logger.logger.transports["console"]) != "undefined") {
				Logger.logger.remove(winston.transports.Console);
			}
		}

		Logger.logger.add(winston.transports.Console, options);
	}

    /**
     * Change the color status.
     *
     * @method useColor
     * @static
     * @param {boolean} status - The new status.
     */
    static useColor(status : boolean) {
        Logger.color = status;
		Logger.buildLogger();
    }

	/**
	 * Change the level of the logger.
	 *
	 * @method setLevel
	 * @static
	 * @param level
	 */
	static setLevel(level : LoggerLevel) {
		Logger.level = level;
		Logger.buildLogger();
	}

    /**
     * Log message as Debug Level.
     *
     * @method debug
     * @static
     * @param {string} msg - The message to log.
	 * @param {any} metadata - Metadata added to message
     */
    static debug(msg : any, metadata : any = {}) {
		Logger.getLogger().debug(msg, metadata);
    }

	/**
	 * Log message as Verbose Level.
	 *
	 * @method verbose
	 * @static
	 * @param {string} msg - The message to log.
	 * @param {any} metadata - Metadata added to message
	 */
	static verbose(msg : any, metadata : any = {}) {
		Logger.getLogger().verbose(msg, metadata);
	}

    /**
     * Log message as Info Level.
     *
     * @method info
     * @static
     * @param {string} msg - The message to log.
	 * @param {any} metadata - Metadata added to message
     */
    static info(msg : any, metadata : any = {}) {
		Logger.getLogger().info(msg, metadata);
    }

    /**
     * Log message as Warn Level.
     *
     * @method warn
     * @static
     * @param {string} msg - The message to log.
	 * @param {any} metadata - Metadata added to message
     */
    static warn(msg : any, metadata : any = {}) {
		Logger.getLogger().warn(msg, metadata);
    }

    /**
     * Log message as Error Level.
     *
     * @method error
     * @static
     * @param {string} msg - The message to log.
	 * @param {any} metadata - Metadata added to message
     */
    static error(msg : any, metadata : any = {}) {
		Logger.getLogger().error(msg, metadata);
    }

}