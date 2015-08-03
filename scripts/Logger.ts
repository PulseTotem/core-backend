/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */
/// <reference path="../../libsdef/node.d.ts" />
/// <reference path="./LoggerLevel.ts" />

var colors : any;

try {
	colors = require('colors');
} catch(e) {
	var returnFunc = function (str) {
		return str;
	};

	String.prototype["green"] = returnFunc;
	String.prototype["blue"] = returnFunc;
	String.prototype["orange"] = returnFunc;
	String.prototype["red"] = returnFunc;
}

var moment : any = require('moment');

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
     * Change the color status.
     *
     * @method useColor
     * @static
     * @param {boolean} status - The new status.
     */
    static useColor(status : boolean) {
        Logger.color = status;
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
	}

    /**
     * Log message as Debug Level.
     *
     * @method debug
     * @static
     * @param {string} msg - The message to log.
     */
    static debug(msg : any) {
	    if (Logger.level === LoggerLevel.Debug) {
		    if (Logger.color && msg != null && msg != undefined && (typeof(msg) == "string" || msg instanceof String)) {
			    console.log("["+moment().format().green+"]\t"+msg.green);
		    } else {
			    console.log("["+moment().format()+"]\t");
			    // keep it as it is to display the object
			    console.log(msg);
		    }
	    }
    }

    /**
     * Log message as Info Level.
     *
     * @method info
     * @static
     * @param {string} msg - The message to log.
     */
    static info(msg : any) {
	    if (Logger.level === LoggerLevel.Debug || Logger.level === LoggerLevel.Info) {
		    if (Logger.color && msg != null && msg != undefined && (typeof(msg) == "string" || msg instanceof String)) {
			    console.log("["+moment().format().blue+"]\t"+msg.blue);
		    } else {
			    console.log("["+moment().format()+"]\t");
			    // keep it as it is to display the object
			    console.log(msg);
		    }
	    }
    }

    /**
     * Log message as Warn Level.
     *
     * @method warn
     * @static
     * @param {string} msg - The message to log.
     */
    static warn(msg : any) {
	    if (Logger.level === LoggerLevel.Debug || Logger.level === LoggerLevel.Info || Logger.level === LoggerLevel.Warning) {
		    if (Logger.color && msg != null && msg != undefined && (typeof(msg) == "string" || msg instanceof String)) {
			    console.log("["+moment().format().orange+"]\t"+msg.orange);
		    } else {
			    console.log("["+moment().format()+"]\t");
			    // keep it as it is to display the object
			    console.log(msg);
		    }
	    }
    }

    /**
     * Log message as Error Level.
     *
     * @method error
     * @static
     * @param {string} msg - The message to log.
     */
    static error(msg : any) {
        if(Logger.color && msg != null && msg != undefined && (typeof(msg) == "string" || msg instanceof String)) {
            console.error("["+moment().format().red+"]\t"+msg.red);
        } else {
	        console.log("["+moment().format()+"]\t");
	        // keep it as it is to display the object
	        console.log(msg);
        }
    }

}