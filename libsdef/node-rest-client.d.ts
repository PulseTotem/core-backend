///<reference path='node.d.ts' />

declare module "node-rest-client" {
    export function Client() : ClientObject;
}

interface ClientObject {
    get(url : string, fn: Function) : RequestObject;
    post(url : string, args : any, fn: Function) : RequestObject;
    put(url : string, args : any, fn: Function) : RequestObject;
    patch(url : string, args : any, fn: Function) : RequestObject;
}

interface RequestObject {
    options:any;
    on(evt: string, fn: Function): RequestObject;
}