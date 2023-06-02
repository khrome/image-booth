import { Canvas } from 'environment-safe-canvas';
import { Emitter } from 'extended-emitter-es6';
import { EventedArray } from 'array-events/array-events.mjs';
import * as engine from './engine.js';

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
                    width : options.width,
                    height : options.height
                });
                resolve(layer);
            }catch(ex){
                reject(ex);
            }
            
        });
    }
    
    async newLayer(options, callback){
        return this.engine.newLayer(options, (newLayer)=>{
            newLayer.image = this;
            //if there's no passed height, take the height of the created layer
            if(!this.options.height) this.options.height = newLayer.height;
            if(!this.options.width) this.options.width = newLayer.width;
            this.layers.push(newLayer);
            if(!layer) layer = newLayer; //autofocus, if there isn't one
            if(callback) callback(newLayer);
        });
    }
    
    removeLayer(layer){
        if(typeof layer == 'number') this.layers.splice(layer, 1);
        else this.layers.erase(layer);
    };
    width(){ //focused layer
        return this.options.width;
    };
    height(){ //focused layer
        return this.options.height;
    };
    focusOn(layer){ //focused layer
        return (this.focused = layer) ;
    };
    
    composite(){ //focused layer
        //todo: cache previous composite and only rerender from changed layer down
        // todo todo: bidirectional composite cache
        //console.log('!!!!', this.layers[0]);
        const type = 'canvas';
        var result = this.engine.composite(this.layers, this.height(), this.width(), type);
        const info = {};
        info[type] = result;
        this.emit('composite', info);
        return result;
    };
    
    save(filename, cb){ //composite
        return new Promise(async (resolve, reject)=>{
            try{
                var pixels = this.composite();
                const width = this.width();
                const height = this.height();
                const canvas = new Canvas({ height, width });
                const context2d = canvas.getContext('2d');
                const imageData = context2d.getImageData(0, 0, width, height);
                imageData.pixels = pixels;
                console.log();
                context2d.putImageData(imageData, 0, 0);
                await Canvas.save(filename, canvas);
                resolve(canvas);
                /*this.engine.saveImage(filename, canvas, (err, buffer)=>{
                    console.log('#1');
                    if(cb) cb(err, buffer);
                    if(err) return reject(err);
                    resolve(buffer);
                });
                /*console.log('####')
                this.engine.saveImage(filename, pixels, height, width, (err, buffer)=>{
                    console.log('#1');
                    if(cb) cb(err, buffer);
                    if(err) return reject(err);
                    resolve(buffer);
                });*/
            }catch(ex){
                reject(ex);
            }
        });
    };
}