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
}