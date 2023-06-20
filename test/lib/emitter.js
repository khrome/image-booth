import { isBrowser, isJsDom } from 'browser-or-node';
const isBrowserish = isBrowser || isJsDom;
import * as mod from 'module';
import { ExtendedEmitter as ImportedEmitter } from 'extended-emitter/extended-emitter.mjs';
let Emitter = null;
let EventEmitter = null;
if(!isBrowserish){
    Emitter = ImportedEmitter;
    EventEmitter = ImportedEmitter;
}else{
    Emitter = window.EventEmitter;
    EventEmitter = window.EventEmitter;
}

export { Emitter, EventEmitter };