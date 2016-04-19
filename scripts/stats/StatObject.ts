/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

class StatObject {

    private _date : Date;

    private _collection : String;

    private _hashId : String;

    private _ip : String;

    private _data : any;


    constructor(date:Date = new Date(), collection:String = "", hashId:String = "", ip:String = "", data:any = null) {
        this._date = date;
        this._collection = collection;
        this._hashId = hashId;
        this._ip = ip;
        this._data = data;
    }


    public setCollection(value:String) {
        this._collection = value;
    }

    public setHashId(value:String) {
        this._hashId = value;
    }

    public setIp(value:String) {
        this._ip = value;
    }

    public getCollection() : String {
        return this._collection;
    }

    public toJSON() {
        var result = {
            date: this._date,
            hashId: this._hashId,
            ip: this._ip,
            collection: this._collection
        };

        for (var key in this._data) {
            result[key] = this._data[key];
        }

        return result;
    }
}