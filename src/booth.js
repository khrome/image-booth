import { Image } from './image.js';
import { Canvas } from 'environment-safe-canvas';
export class Booth{
    constructor(engine){
        this.engine = engine;
        this.toDump = [];
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

const booth = new Booth();
export default booth;

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