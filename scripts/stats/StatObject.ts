/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

class StatObject {

    private _date : Date;

    private _collection : string;

    private _hashId : string;

    private _ip : string;

    private _socketId : string;

    private _data : any;


    constructor(date:Date = new Date(), collection:string = "", hashId:string = "", ip:string = "", data:any = null) {
        this._date = date;
        this._collection = collection;
        this._hashId = hashId;
        this._ip = ip;
        this._data = data;
    }


    public setCollection(value:string) {
        this._collection = value;
    }

    public setHashId(value:string) {
        this._hashId = value;
    }

    public setIp(value:string) {
        this._ip = value;
    }

    public setSocketId(value : string) {
        this._socketId = value;
    }

    public setData(data : any) {
        this._data = data;
    }

    public getCollection() : string {
        return this._collection;
    }

    public toJSON() {
        var result = {
            date: this._date,
            socketId: this._socketId,
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