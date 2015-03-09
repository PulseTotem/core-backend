/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/**
 * Manage socket for a specific namespace.
 *
 * @class NamespaceManager
 */
class NamespaceManager {

    /**
     * SocketIO socket.
     *
     * @property socket
     * @type any
     */
    socket : any;

    /**
     * Constructor.
     *
     * @constructor
     * @param {any} socket - The socket.
     */
    constructor(socket : any) {
        this.socket = socket;
    }

    /**
     * Add a listener to socket.
     *
     * @method addListenerToSocket
     * @param {string} listenerName - The listener name.
     * @param {Function} callBackFunction - The callback function for listener.
     */
    addListenerToSocket(listenerName : string, callBackFunction : Function) {
        var self = this;

        this.socket.on(listenerName, function(content) {
            callBackFunction(content, self);
        });
    }

    /**
     * Method called when socket is disconnected.
     *
     * @method onDisconnection
     */
    onDisconnection() {
        // Nothing to do.
    }

    /**
     * Format response before emit to SocketIo Socket.
     *
     * @method formatResponse
     * @param {boolean} successStatus - The success status.
     * @param {any} response - The response
     */
    formatResponse(successStatus : boolean, response : any) {
        return {
            "success" : successStatus,
            "response" : response
        };
    }

    /**
     * Method manage response from BackendSocket.
     *
     * @method manageServerResponse
     * @param {any} response - The response from Backend Socket.
     * @param {Function} successCB - The callback function for success response.
     * @param {Function} failCB - The callback function for fail response.
     */
    manageServerResponse(response : any, successCB : Function, failCB : Function) {
        if(!!response.success && !!response.response) {
            if(response.success) {
                successCB(response.response);
            } else {
                failCB(response.response);
            }
        } else {
            failCB(new Error("Backend response is not well formatted."));
        }
    }
}