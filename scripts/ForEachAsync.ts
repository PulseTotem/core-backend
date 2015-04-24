/**
 * @author Christian Brel <christian@the6thscreen.fr, ch.brel@gmail.com>
 */

/**
 * Represents an asynchronous ForEach.
 *
 * @class ForEachAsync
 */
class ForEachAsync {


    /**
     * Perform a forEach on dataArray and call callback function.
     *
     * @method forEach
     * @static
     * @param {any} dataArray - The data array to perform the ForEach
     * @param {any} callback - The function to call for each value
     */
    static forEach(dataArray : any, callback : any) {
        var i = 0;
        var arrayLength = dataArray.length;

        for(i = 0; i < arrayLength; i++) {
            callback(i);
        }
    }

}