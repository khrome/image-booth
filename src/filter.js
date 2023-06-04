import { Action } from './action.js'; 
export class Filter extends Action{
    constructor(name, engine){
        super(name, engine);
    }
    
    act(layer, controls){
        return this.filter(layer, controls);
    }
    
    filter(layer, controls){
        throw new Error('.filter() must be implemented in the filter class');
    }
    
    convolve(pixels, filter, filter_div, offset){
        return this.engine.convolve(pixels, filter, filter_div, offset);
    }
};