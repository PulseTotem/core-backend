/**
 * @author Christian Brel <christian@pulsetotem.fr, ch.brel@gmail.com>
 * @author Simon Urli <simon@pulsetotem.fr>
 */

/// <reference path="./Logger.ts" />
/// <reference path="./RestClientResponse.ts" />

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
		//if(RestClient.client == null) {
			RestClient.client = new NodeRestClient();
		//}
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

		var returnFail : Function = function(data, response) {
			var dataJSON;

			if(typeof(data) == "string" || data instanceof Buffer) {
				dataJSON = JSON.parse(data);
			} else {
				dataJSON = data;
			}
			var result : RestClientResponse = new RestClientResponse(false, response, dataJSON);
			fail(result);
		};

		return [returnSuccess, returnFail];
	}

	private static createArgs(data : any, auth : any = null) : Object {
		var result = {
			"data": data,
			"headers": {
				"Content-Type": "application/json"
			}
		};

		if(auth != null) {
			result["headers"]["Authorization"] = auth;
		}

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
	 * @param {string} authorization - An authorization key
	 */
	static get(url : string, successCallback : Function = null, failCallback : Function = null, authorization : any = null) {
		var callbacks : Array<Function> = RestClient.manageCallbacks("GET", url, successCallback, failCallback);

		var args = RestClient.createArgs("", authorization);

		var req = RestClient.getClient().get(url, args, function(data, response) {
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
	 * @param {JSONObject} data - The arguments for POST message.
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 * @param {string} authorization - An authorization key
	 */
	static post(url : string, data : any, successCallback : Function = null, failCallback : Function = null, authorization : any = null) {
		var callbacks : Array<Function> = RestClient.manageCallbacks("POST", url, successCallback, failCallback);

		var args = RestClient.createArgs(data, authorization);

		var req = RestClient.getClient().post(url, args, function(data, response) {
			if(response.statusCode >= 200 && response.statusCode < 300) {
				callbacks[0](data, response);
			} else {
				callbacks[1](data, response);
			}
		});
		req.on('error', callbacks[1]);
	}

	/**
	 * Send a PUT message to URL in parameter, in an asynchronous way.
	 *
	 * @method put
	 * @static
	 * @param {string} url - The url to post.
	 * @param {any} data - The arguments for PUT message.
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 * @param {string} authorization - An authorization key
	 */
	static put(url : string, data : any, successCallback : Function = null, failCallback : Function = null, authorization : any = null) {
		var callbacks : Array<Function> = RestClient.manageCallbacks("PUT", url, successCallback, failCallback);

		var args = RestClient.createArgs(data, authorization);

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
	 * @param {JSONObject} data - The arguments for PATCH message.
	 * @param {Function} successCallback - The callback function when success.
	 * @param {Function} failCallback - The callback function when fail.
	 * @param {string} authorization - An authorization key
	 */
	static patch(url : string, data : any, successCallback : Function = null, failCallback : Function = null, authorization : any = null) {
		var callbacks : Array<Function> = RestClient.manageCallbacks("PATCH", url, successCallback, failCallback);

		var args = RestClient.createArgs(data, authorization);

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
	 * @param {string} authorization - An authorization key
	 */
	static delete(url : string, successCallback : Function = null, failCallback : Function = null, authorization : any = null) {
		var callbacks : Array<Function> = RestClient.manageCallbacks("DELETE", url, successCallback, failCallback);

		var args = RestClient.createArgs("", authorization);

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