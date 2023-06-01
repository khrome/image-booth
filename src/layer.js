import { Canvas } from 'environment-safe-canvas';
import * as engine from './engine.js';
export class Layer{
    constructor(options){
        let height;
        let width;
        let img;
        let ready
        if(options.source){
            ready = engine.createImage(options.source, function(err, image){
                if(err) throw err;
                options.image = image;
                delete options.source;
            });
        }else{
            ready = new Promise((resolve)=> resolve());
        }
        this.ready = new Promise((resolve, reject)=>{
            ready.then(()=>{
                try{
                    if(options.image || (options.height && options.width)){
                        height = options.image?options.image.height:options.height;
                        width = options.image?options.image.width:options.width;
                    }else throw new Error('The image has no dimensions or progenitor');
                    this.height = height;
                    this.width = width;
                    this.buffer = new Canvas(height, width);
                    this.context2d = this.buffer.getContext('2d');
                    if(options.image){
                        this.context2d.drawImage(options.image, 0, 0);
                        this.pixels = this.context2d.getImageData(0, 0, width, height);
                    }else{
                        //clear canvas
                        var data = this.context2d.getImageData(0,0, width, height)
                        for(var ypos = 0; ypos < height; ypos++){
                            for(xpos = 0; xpos < width; xpos++){
                                    pos = ((ypos*(width*4)) + (xpos*4));
                                    data.data[pos + 3] = 0;
                            }
                        }
                        this.pixels = data;
                    }
                }catch(ex){
                    console.log(ex);
                }
                resolve(true);
                setTimeout(()=>{
                });
            });
        });
        
    }
    
    filter(name, options){
        const registry = this.image.booth && this.image.booth.registry;
        if(typeof name == 'object' && !options){
            options = name;
            name = options.name;
        }
        var actor;
        if(registry['filter'] && (actor = registry['filter'][name]) ){
            console.log('Filter('+name+'): ', actor);
            var newPixels = actor.act(result.pixels, options);
            result.pixels = newPixels;
        }else{
            console.log('Error: filter not found('+name+')');
        }
        
    }
    
    brush(name, options){
        if(typeof name == 'object' && !options){
            options = name;
            name = options.name;
        }
        
    }
    
    operate(name, options){
        if(typeof name == 'object' && !options){
            options = name;
            name = options.name;
        }
        
    }
    
    tool(name, options){
        if(typeof name == 'object' && !options){
            options = name;
            name = options.name;
        }
        
    }
}