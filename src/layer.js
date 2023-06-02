import { Canvas } from 'environment-safe-canvas';
import * as engine from './engine.js';
export class Layer{
    constructor(options){
        let ready;
        const setFromCanvas = ()=>{
            this.context2d = this.buffer.getContext('2d');
            this.height = this.buffer.height;
            this.width = this.buffer.width;
            console.log(this.buffer, this.height, this.width);
            if(options.image){
                console.log('IMG', options.image)
                this.context2d.drawImage(options.image, 0, 0, width, height);
                this.pixels = this.context2d.getImageData(0, 0, width, height);
                console.log('px', Array.prototype.filter.call(this.pixels, (value)=> (value === 0 || value === 255) ));
            }else{
                //clear canvas
                var data = this.context2d.getImageData(0,0, this.width, this.height);
                const height = this.height;
                const width = this.width;
                var ypos, xpos, pos;
                for(var ypos = 0; ypos < height; ypos++){
                    for(xpos = 0; xpos < width; xpos++){
                            pos = ((ypos*(width*4)) + (xpos*4));
                            data.data[pos + 3] = 0;
                    }
                }
                this.pixels = data;
            }
        }
        if(options.source){
            this.ready = new Promise(async (resolve, reject)=>{
                try{
                    this.buffer = await Canvas.load(options.source);
                    setFromCanvas();
                    resolve(this.pixels);
                }catch(ex){ reject(ex) }
            });
        }else{
            this.ready = new Promise(async (resolve, reject)=>{
                try{
                    this.buffer = new Canvas({ 
                        height: this.height || options.height, 
                        width: this.width || options.width
                    });
                    setFromCanvas();
                    resolve(this.pixels);
                }catch(ex){ reject(ex) }
            });
        }
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