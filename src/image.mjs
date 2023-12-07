import { Canvas } from '@environment-safe/canvas';
import { Emitter } from 'extended-emitter';
import { EventedArray } from 'array-events/array-events.mjs';
import * as engine from './engine.mjs';

var registry = {};
var layer;
var convolveBuffer;

export class Image{
    constructor(options={}){
        this.options = options;
        this.layers = new EventedArray([]);
        this.engine = options.engine || engine;
        (new Emitter()).onto(this);
        this.ready = new Promise(async (resolve, reject)=>{
            try{
                const layer = await this.newLayer({
                    source : options.source,
                    image : options.image,
                    width : options.image?options.image.width:options.width,
                    height : options.image?options.image.height:options.height
                });
                resolve(layer);
            }catch(ex){
                reject(ex);
            }
            
        });
    }
    
    summary(){
        return this.layers.map((layer)=>{
            return {
                name: layer.options.name,
                mask: null,
                visible: true,
                locked: false,
                opacity: 1.0,
                blendingMode: 'overlay'
            }
        })
    }
    
    dirty(value=null){
        try{
            if(value !== null){
                this.layers.forEach((layer)=> layer.dirty = value );
                return value;
            }
            const isDirty = this.layers.reduce((agg, layer)=>{
                return agg || layer.dirty;
            }, false);
            return isDirty;
        }catch(ex){
            console.log('ERR', ex)
        }
    }
    
    async newLayer(options, callback){
        if(this.layers[0] &&  this.layers[0].buffer){ // if no size, take the first layers size
            if(!options.height) options.height = this.layers[0].buffer.height;
            if(!options.width) options.width = this.layers[0].buffer.width;
        }
        return this.engine.newLayer(options, (newLayer)=>{
            newLayer.image = this;
            //if there's no passed height, take the height of the created layer
            if(!this.options.height) this.options.height = newLayer.height;
            if(!this.options.width) this.options.width = newLayer.width;
            if(this.options.height && !options.height){
                options.height = this.options.height;
            }
            if(this.options.width && !options.width){
                options.width = this.options.width;
            }
            this.layers.push(newLayer);
            if(!this.currentLayer) this.currentLayer = newLayer;
            this.focusOn(newLayer);
            if(!layer) layer = newLayer; //autofocus, if there isn't one
            if(callback) callback(newLayer);
        });
    }
    
    removeLayer(layer){
        if(typeof layer == 'number') this.layers.splice(layer, 1);
        else this.layers.erase(layer);
    }
    width(){ //focused layer
        return this.options.width;
    }
    height(){ //focused layer
        return this.options.height;
    }
    focusOn(layer){ //focused layer
        return (this.focused = layer) ;
    }
    
    composite(type='canvas'){
        //todo: cache previous composite and only rerender from changed layer down
        // todo todo: bidirectional composite cache
        //console.log('!!!!', this.layers[0]);
        var result = this.engine.composite(this.layers, this.height(), this.width(), type);
        const info = {};
        info[type] = result;
        this.emit('composite', info);
        return result;
    }
    
    toDataURL(){
        const mimeType = File.deriveMIMEType(this.body());
        const format = File.deriveFormat(mimeType);
        return `data:${mimeType};${format},${FileBuffer.toString('base64', this.body())}`
    }
    
    save(filename, cb){ //composite
        return new Promise(async (resolve, reject)=>{
            try{
                const canvas = this.composite('canvas');
                const file = await Canvas.toFile(filename, canvas);
                await file.save();
                //await Canvas.save(filename, canvas);
                resolve(canvas);
            }catch(ex){
                reject(ex);
            }
        });
    }
}