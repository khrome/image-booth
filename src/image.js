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
        this.ready = this.newLayer({
            source : options.source
        }, function(){
            if(options.ready) options.ready();
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
        var renderedPixels = this.engine.composite(this.layers);
        this.emit('composite', {
            pixels : renderedPixels
        });
        return renderedPixels;
    };
    
    save(filename, cb){ //composite
        var pixels = this.composite();
        var buffer = new Canvas(this.height(), this.width());
        console.log('1111', this.height(), this.width());
        buffer.toDataURL('image/png', function(err, dataURL){
            console.log('22222', err);
            if(err) return cb(err);
            var base64 = dataURL.substring(dataURL.indexOf(','));
            var buffer = new Buffer(base64, 'base64');
            console.log('??', buffer);
            fs.writeFile(filename, buffer, function(err){
                cb(err, buffer);
            })
        });
    };
}