import { Canvas } from 'environment-safe-canvas';
import * as engine from './engine.js';
import defaultBooth from './booth.js';
export class Layer{
    constructor(options){
        let ready;
        const setFromCanvas = ()=>{
            this.context2d = this.buffer.getContext('2d', { willReadFrequently: true });
            this.height = this.buffer.height;
            this.width = this.buffer.width;
            const height = this.height;
            const width = this.width;
            if(options.image){
                this.context2d.drawImage(options.image, 0, 0, width, height);
            }

            if( options.image || options.source ){
                this.pixels = this.context2d.getImageData(0, 0, width, height);
                console.log(this.pixels, width, height)
            }else{
                //clear canvas
                var data = this.context2d.getImageData(0,0, this.width, this.height);
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
        console.log('$$$$', options);
        if(options.source){
            this.ready = new Promise(async (resolve, reject)=>{
                try{
                    this.buffer = await Canvas.load(options.source);
                    setFromCanvas();
                    resolve(this.pixels);
                }catch(ex){ console.log('>>>', ex); reject(ex) }
            });
        }else{
            if(options.image){
                this.ready = new Promise(async (resolve, reject)=>{
                    try{
                        this.buffer = new Canvas({ 
                            height: options.image.height, 
                            width: options.image.width 
                        });
                        setFromCanvas();
                        resolve(this.pixels);
                    }catch(ex){ reject(ex) }
                });
            }else{ //passing in a height and width and getting back an empty canvas
                this.ready = new Promise(async (resolve, reject)=>{
                    console.log('^^', this.height, options.height, this.width, options.width)
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
    }
    
    act(action, controls, booth=defaultBooth){
        const newPixels = booth.registry[action].act(this.pixels, controls);
        this.pixels = newPixels;
        this.context2d.putImageData(newPixels, 0, 0, 0, 0, this.pixels.width, this.pixels.height);
        this.dirty = true;
    }
    
    stroke(tool, shape, brushName, controls, booth=defaultBooth){
        console.log('?', brushName, booth.brushes)
        const brush = booth.brushes[brushName].kernel(controls);
        //todo: handle complex shapes/paths
        const newPixels = booth.tools[tool].stroke(
            this.pixels, 
            shape.x, 
            shape.y,
            shape.x2,
            shape.y2,
            brush,
            controls
        );
        
        this.pixels = newPixels;
        this.context2d.putImageData(newPixels, 0, 0, 0, 0, this.pixels.width, this.pixels.height);
        this.dirty = true;
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