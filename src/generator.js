import { Action } from './action.js'; 
export class Generator extends Action{
    constructor(name, engine){
        super(name, engine);
    }
    
    act(layer, controls){
        return this.generate(layer, controls);
    }
    
    generate(layer, controls){
        throw new Error('.filter() must be implemented in the filter class');
    }
    
    convolve(pixels, filter, filter_div, offset){
        return this.engine.convolve(pixels, filter, filter_div, offset);
    }
};