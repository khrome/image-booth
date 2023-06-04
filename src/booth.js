import { Image } from './image.js';
import { Filter } from './filter.js';
import { Canvas } from 'environment-safe-canvas';
import { GaussianBlur } from './filters/blur.js';
import { Emboss } from './filters/emboss.js';
import { Laplacian } from './filters/laplacian.js';
import { Sharpen } from './filters/sharpen.js';
import { HighPass } from './filters/high-pass.js';
import { Sobel } from './filters/sobel.js';

import * as defaultEngine from './engine.js';
export class Booth{
    constructor(engine){
        this.engine = engine;
        this.toDump = [];
        this.registry = {};
        
    }
    
    register(ob){
        let callable = ob.getLabel().split(' ').join('');
        callable = callable.substring(0, 1).toLowerCase()+callable.substring(1);
        if(this[callable]) throw new Error(`${callable} is a reserved symbol`);
        this.registry[ob.name()] = ob;
        this[callable] = (pixels, controls) => this[callable].act(pixels, controls);
    }
    
    use(classDef){
        const instance = new classDef(null, this.engine);
        this.register(instance);
    } 
    
    newImage(options){
        const image = new Image(options);
        return image;
    }
    
    async save(location, ob){
        if(ob.data && ob.height && ob.width){
            //imageData
            console.log('save image data', location)
            const canvas = new Canvas({ height: ob.height,  width: ob.width });
            const context = canvas.getContext('2d');
            context.putImageData(ob, 0, 0, 0, 0, ob.width, ob.height);
            await Canvas.save(location, canvas);
        }
        
        if(ob.getContext){
            //canvas
            console.log('save canvas', location)
            await Canvas.save(location, ob);
        }
    }
    
    dump(id, ob){
        this.toDump.push({ id, ob });
    }
    
    async flush(){
        let lcv=0;
        for(;lcv< this.toDump.length; lcv++){
            if(this.toDump[lcv].ob){
                if(this.toDump[lcv].ob.data) console.log('WRITING', Array.prototype.filter.call(
                    this.toDump[lcv].ob.data, 
                    (value)=> !(value === 0 || value === 255) 
                ));
            }
            await this.save(this.toDump[lcv].id+'.png', this.toDump[lcv].ob);
        }
    }
}

//make the default a kitchen sink booth
const booth = new Booth(defaultEngine);
export default booth;
booth.use(GaussianBlur);
booth.use(Emboss);
booth.use(Laplacian);
booth.use(Sharpen);
booth.use(HighPass);
booth.use(Sobel);

/*
var booth = {
    newImage : function(options){
        return new Image(options);
    },
    register : function(type, name, actor){
        if(!registry[type]) registry[type] = {};
        if(type === 'filter'){
            if(!actor.name) actor.name = function(){ return name; };
            if(!actor.label) actor.label = function(){ return name[0].toUpperCase()+name.substring(1); };
            if(!actor.act) actor.act = function(pixels, options){
                return convolve(pixels, this.matrix(options), options.amount, options.threshold);
            };
        }
        registry[type][name] = actor;
    } 
};
booth.composite = composite;
booth.convolve = convolve;
booth.merge = merge;
*/