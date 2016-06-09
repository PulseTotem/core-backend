/**
 * @author Simon Urli <simon@the6thscreen.fr>
 */

class StatObject {

    private _date : Date;

    private _collection : string;

    private _profilId : string;

    private _sdiId : string;

    private _ip : string;

    private _socketId : string;

    private _hash : string;

    private _data : any;


    constructor(date:Date = new Date(), collection:string = "", sdiId:string = "", profilId:string = "", ip:string = "", hash:string = "", data:any = null) {
        this._date = date;
        this._collection = collection;
        this._sdiId = sdiId;
        this._profilId = profilId;
        this._ip = ip;
        this._hash = hash;
        this._data = data;
    }


    public setCollection(value:string) {
        this._collection = value;
    }

    public setSDIId(value : string) {
        this._sdiId = value;
    }

    public setProfilId(value:string) {
        this._profilId = value;
    }

    public setIp(value:string) {
        this._ip = value;
    }

    public setSocketId(value : string) {
        this._socketId = value;
    }

    public setHash(value : string) {
        this._hash = value;
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
            sdiId: this._sdiId,
            profilId: this._profilId,
            ip: this._ip,
            hash: this._hash,
            collection: this._collection
        };

        for (var key in this._data) {
            result[key] = this._data[key];
        }

        return result;
    }
}