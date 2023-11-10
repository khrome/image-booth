import * as mod from "module"; 
let rqr = null;
export function require(name){
    console.log('name', !!rqr, import.meta.url)
    if(!rqr) rqr = mod.createRequire(import.meta.url);
    return rqr(name);
};

export function resolve(name){
    if(!rqr) rqr = mod.createRequire(import.meta.url);
    return rqr.resolve(name);
};