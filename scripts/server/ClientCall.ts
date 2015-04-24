/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/**
 * Manage Client Call.
 *
 * @class ClientCall
 */
class ClientCall {

    /**
     * Call's Hash.
     *
     * @property _callHash
     * @type string
     * @private
     */
    private _callHash : string;

    /**
     * Call's params.
     *
     * @property _callParams
     * @type any
     * @private
     */
    private _callParams : any;

    /**
     * Call's Callback.
     *
     * @property _callCallback
     * @type any
     * @private
     */
    private _callCallback : any;

    /**
     * Constructor.
     *
     * @constructor
     * @param {string} callHash - The Call's Hash.
     * @param {any} callParams - The Call's params.
     * @param {any} callCallback - The Call's callback.
     */
    constructor(callHash : string, callParams : any, callCallback : any) {
        this._callHash = callHash;
        this._callParams = callParams;
        this._callCallback = callCallback;
    }

    /**
     * Returns Call's Hash.
     *
     * @method getCallHash
     */
    getCallHash() {
        return this._callHash;
    }

    /**
     * Returns Call's params.
     *
     * @method getCallParams
     */
    getCallParams() {
        return this._callParams;
    }

    /**
     * Returns Call's Callback.
     *
     * @method getCallCallback
     */
    getCallCallback() {
        return this._callCallback;
    }
}