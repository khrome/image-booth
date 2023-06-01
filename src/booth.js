import { Image } from './image.js';
export class Booth{
    constructor(engine){
        this.engine = engine;
    }
    
    newImage(options){
        const image = new Image(options);
        return image;
    }
}

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