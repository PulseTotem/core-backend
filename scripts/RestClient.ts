/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="../libsdef/node-rest-client.d.ts" />

/// <reference path="./Logger.ts" />
/// <reference path="./RestClientResponse.ts" />
/// <reference path="./RestClientSync.ts" />

var Client = require('node-rest-client').Client;

var deasync = require('deasync');

/**
 * Represents a REST client.
 *
 * @class RestClient
 */
class RestClient {

    /**
     * Client.
     *
     * @property client
     * @type any
     * @static
     */
    static client : any = null;

    /**
     * Return the REST client from lib.
     *
     * @method getClient
     * @static
     */
    static getClient() {
        if(RestClient.client == null) {
            RestClient.client = new Client();
        }
        return RestClient.client;
    }

	private static manageLogging(strType : String, url : String, successCallback : Function = null, failCallback : Function = null) : Array<Function> {
		var success : Function = null;
		var fail : Function = null;

		if (successCallback != null) {
			success = successCallback;
		} else {
			success = function() {
				Logger.info("RestClient : Success to send "+strType+" message to URL '" + url + "'.");
			};
		}

		if (failCallback != null) {
			fail = failCallback;
		} else {
			fail = function() {
				Logger.warn("RestClient : Fail to send "+strType+" message to URL '" + url + "'.");
			};
		}

		return [success, fail];
	}

	private static syncCallbacks(sync : RestClientSync) : Array<Function> {
		var success : Function = function(data, response) {
			var result : RestClientResponse = new RestClientResponse(true, response, JSON.parse(data));
			sync.finishRequest(result);
		};

		var fail : Function = function(error) {
			var result : RestClientResponse = new RestClientResponse(false, error);
			sync.finishRequest(result);
		};

		return [success, fail];
	}

	private static createArgs(data : any) : Object {
		var result = {
			"data": data,
			"headers": {
				"Content-Type": "application/json"
			}
		};

		return result;
	}

    /**
     * Send a GET message to URL in parameter, in an asynchronous way.
     *
     * @method get
     * @static
     * @param {string} url - The url to get.
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    static get(url : string, successCallback : Function = null, failCallback : Function = null) {
		var callbacks : Array<Function> = RestClient.manageLogging("GET", url, successCallback, failCallback);

        RestClient.getClient().get(url, callbacks[0]).on('error',callbacks[1]);
    }

    /**
     * Send a GET message to URL in parameter, in a synchronous way.
     *
     * @method getSync
     * @static
     * @param {string} url - The url to get.
     */
    static getSync(url : string) : RestClientResponse {

            var sync : RestClientSync = new RestClientSync();
	        var callbacks : Array<Function> = RestClient.syncCallbacks(sync);

            RestClient.getClient().get(url, callbacks[0]).on('error',callbacks[1]);

            while(!sync.done()) {
                deasync.sleep(5);
            }

            return sync.result();
    }

    /**
     * Send a POST message to URL in parameter, in an asynchronous way.
     *
     * @method post
     * @static
     * @param {string} url - The url to post.
     * @param {JSONObject} args - The arguments for POST message. Schema for this JSON Object is :
     *  {
     *      data: { test: "hello" },
     *      headers:{"Content-Type": "application/json"}
     *  };
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    static post(url : string, args : any, successCallback : Function = null, failCallback : Function = null) {
	    var callbacks : Array<Function> = RestClient.manageLogging("POST", url, successCallback, failCallback);

	    RestClient.getClient().post(url, args, callbacks[0]).on('error',callbacks[1]);
    }

    /**
     * Send a POST message to URL in parameter, in a synchronous way.
     *
     * @method postSync
     * @static
     * @param {string} url - The url to post.
     * @param {any} data - The data for POST message.
     */
    static postSync(url : string, data : any) : RestClientResponse {

	    var sync : RestClientSync = new RestClientSync();
	    var callbacks : Array<Function> = RestClient.syncCallbacks(sync);

        var args = RestClient.createArgs(data);

        RestClient.getClient().post(url, args, callbacks[0]).on('error',callbacks[1]);

        while(!sync.done()) {
            deasync.sleep(5);
        }

        return sync.result();
    }

    /**
     * Send a PUT message to URL in parameter, in an asynchronous way.
     *
     * @method put
     * @static
     * @param {string} url - The url to post.
     * @param {any} args - The arguments for PUT message. Schema for this JSON Object is :
     *  {
     *      data: { test: "hello" },
     *      headers:{"Content-Type": "application/json"}
     *  };
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    static put(url : string, args : any, successCallback : Function = null, failCallback : Function = null) {
	    var callbacks : Array<Function> = RestClient.manageLogging("PUT", url, successCallback, failCallback);

	    RestClient.getClient().put(url, args, callbacks[0]).on('error',callbacks[1]);
    }

    /**
     * Send a PUT message to URL in parameter, in a synchronous way.
     *
     * @method putSync
     * @static
     * @param {string} url - The url to put.
     * @param {any} data - The data for PUT message.
     */
    static putSync(url : string, data : any) : RestClientResponse {

	    var sync : RestClientSync = new RestClientSync();
	    var callbacks : Array<Function> = RestClient.syncCallbacks(sync);

	    var args = RestClient.createArgs(data);

        RestClient.getClient().put(url, args, callbacks[0]).on('error',callbacks[1]);

        while(!sync.done()) {
            deasync.sleep(5);
        }

        return sync.result();
    }

    /**
     * Send a PATCH message to URL in parameter, in an asynchronous way.
     *
     * @method patch
     * @static
     * @param {string} url - The url to post.
     * @param {JSONObject} args - The arguments for PATCH message. Schema for this JSON Object is :
     *  {
     *      data: { test: "hello" },
     *      headers:{"Content-Type": "application/json"}
     *  };
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    static patch(url : string, args : any, successCallback : Function = null, failCallback : Function = null) {
	    var callbacks : Array<Function> = RestClient.manageLogging("PATCH", url, successCallback, failCallback);

	    RestClient.getClient().patch(url, args, callbacks[0]).on('error',callbacks[1]);
    }

    /**
     * Send a PATCH message to URL in parameter, in a synchronous way.
     *
     * @method patchSync
     * @static
     * @param {string} url - The url to patch.
     * @param {any} data - The data for PATCH message.
     */
    static patchSync(url : string, data : any) : RestClientResponse {

	    var sync : RestClientSync = new RestClientSync();
	    var callbacks : Array<Function> = RestClient.syncCallbacks(sync);

	    var args = RestClient.createArgs(data);

        RestClient.getClient().patch(url, args, callbacks[0]).on('error', callbacks[1]);

        while(!sync.done()) {
            deasync.sleep(5);
        }

        return sync.result();
    }

    /**
     * Send a DELETE message to URL in parameter, in an asynchronous way.
     *
     * @method delete
     * @static
     * @param {string} url - The url to post.
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    static delete(url : string, successCallback : Function = null, failCallback : Function = null) {
	    var callbacks : Array<Function> = RestClient.manageLogging("DELETE", url, successCallback, failCallback);

	    RestClient.getClient().delete(url, callbacks[0]).on('error',callbacks[1]);
    }

    /**
     * Send a DELETE message to URL in parameter, in a synchronous way.
     *
     * @method deleteSync
     * @static
     * @param {string} url - The url to patch.
     */
    static deleteSync(url : string) : RestClientResponse {

	    var sync : RestClientSync = new RestClientSync();
	    var callbacks : Array<Function> = RestClient.syncCallbacks(sync);

        RestClient.getClient().delete(url, callbacks[0]).on('error', callbacks[1]);

        while(!sync.done()) {
            deasync.sleep(5);
        }

        return sync.result();
    }

}