/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="./Logger.ts" />
/// <reference path="./RestClientResponse.ts" />
/// <reference path="./RestClientSync.ts" />

var NodeRestClient : any = require('node-rest-client').Client;

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
     * @type ClientObject
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
            RestClient.client = new NodeRestClient();
        }
        return RestClient.client;
    }

    private static manageCallbacks(strType : String, url : String, successCallback : Function = null, failCallback : Function = null) : Array<Function> {
        var success : Function = null;
        var fail : Function = null;

        if (successCallback != null) {
            success = successCallback;
        } else {
            success = function(result) {
                Logger.info("RestClient : Success to send "+strType+" message to URL '" + url + "'.");
                Logger.info(JSON.stringify(result));
            };
        }

        if (failCallback != null) {
            fail = failCallback;
        } else {
            fail = function(result) {
                Logger.warn("RestClient : Fail to send "+strType+" message to URL '" + url + "'.");
                Logger.warn(JSON.stringify(result));
            };
        }

        var returnSuccess : Function = function(data, response) {
			var dataJSON;

			if(typeof(data) == "string" || data instanceof Buffer) {
				dataJSON = JSON.parse(data);
			} else {
				dataJSON = data;
			}
			var result : RestClientResponse = new RestClientResponse(true, response, dataJSON);
            success(result);
        };

        var returnFail : Function = function(error) {
            var result : RestClientResponse = new RestClientResponse(false, error);
            fail(result);
        };

        return [returnSuccess, returnFail];
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
        var callbacks : Array<Function> = RestClient.manageCallbacks("GET", url, successCallback, failCallback);

        var req = RestClient.getClient().get(url, function(data, response) {
			if(response.statusCode >= 200 && response.statusCode < 300) {
				callbacks[0](data, response);
			} else {
				callbacks[1](data, response);
			}
		});
        req.on('error', callbacks[1]);
    }

    /**
     * Send a POST message to URL in parameter, in an asynchronous way.
     *
     * @method post
     * @static
     * @param {string} url - The url to post.
     * @param {JSONObject} data - The arguments for POST message. Schema for this JSON Object is :
     *  {
     *      data: { test: "hello" },
     *      headers:{"Content-Type": "application/json"}
     *  };
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    static post(url : string, data : any, successCallback : Function = null, failCallback : Function = null) {
	    var callbacks : Array<Function> = RestClient.manageCallbacks("POST", url, successCallback, failCallback);

        var args = RestClient.createArgs(data);

		var req = RestClient.getClient().post(url, args, function(data, response) {
			if(response.statusCode >= 200 && response.statusCode < 300) {
				callbacks[0](data, response);
			} else {
				callbacks[1](data, response);
			}
		});
        //var req = RestClient.getClient().post(url, args, callbacks[0]);
        req.on('error', callbacks[1]);
    }

    /**
     * Send a PUT message to URL in parameter, in an asynchronous way.
     *
     * @method put
     * @static
     * @param {string} url - The url to post.
     * @param {any} data - The arguments for PUT message. Schema for this JSON Object is :
     *  {
     *      data: { test: "hello" },
     *      headers:{"Content-Type": "application/json"}
     *  };
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    static put(url : string, data : any, successCallback : Function = null, failCallback : Function = null) {
	    var callbacks : Array<Function> = RestClient.manageCallbacks("PUT", url, successCallback, failCallback);

        var args = RestClient.createArgs(data);

        var req = RestClient.getClient().put(url, args, function(data, response) {
			if(response.statusCode >= 200 && response.statusCode < 300) {
				callbacks[0](data, response);
			} else {
				callbacks[1](data, response);
			}
		});
        req.on('error', callbacks[1]);
    }

    /**
     * Send a PATCH message to URL in parameter, in an asynchronous way.
     *
     * @method patch
     * @static
     * @param {string} url - The url to post.
     * @param {JSONObject} data - The arguments for PATCH message. Schema for this JSON Object is :
     *  {
     *      data: { test: "hello" },
     *      headers:{"Content-Type": "application/json"}
     *  };
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.
     */
    static patch(url : string, data : any, successCallback : Function = null, failCallback : Function = null) {
	    var callbacks : Array<Function> = RestClient.manageCallbacks("PATCH", url, successCallback, failCallback);

        var args = RestClient.createArgs(data);

        var req = RestClient.getClient().patch(url, args, function(data, response) {
			if(response.statusCode >= 200 && response.statusCode < 300) {
				callbacks[0](data, response);
			} else {
				callbacks[1](data, response);
			}
		});
        req.on('error', callbacks[1]);
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
	    var callbacks : Array<Function> = RestClient.manageCallbacks("DELETE", url, successCallback, failCallback);

		var args = RestClient.createArgs("");

        var req = RestClient.getClient().delete(url, args, function(data, response) {
			if(response.statusCode >= 200 && response.statusCode < 300) {
				callbacks[0](data, response);
			} else {
				callbacks[1](data, response);
			}
		});
        req.on('error', callbacks[1]);
    }

}