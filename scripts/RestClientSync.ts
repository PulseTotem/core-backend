/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

/// <reference path="./RestClientResponse.ts" />

/**
 * This class is used for the synchronized RestClient request.
 *
 * @class RestClientSync
 */
class RestClientSync {

	private _done : boolean = false;

	private _result : RestClientResponse = null;

	/**
	 * Is the request finished?
	 *
	 * @method done
	 * @returns {boolean}
	 */
	done() {
		return this._done;
	}

	/**
	 * Give the result of the request
	 *
	 * @method result
	 * @returns {RestClientResponse}
	 */
	result() {
		return this._result;
	}


	/**
	 * Change the state of the request to specify the request is finished and determine the result.
	 *
	 * @method finishRequest
	 * @param result
	 */
	finishRequest(result : RestClientResponse) {
		this._result = result;
		this._done = true;
	}
}