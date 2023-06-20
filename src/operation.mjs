import { Action } from './action.mjs'; 
export class Operation extends Action{
    constructor(name, engine){
        super(name, engine);
    }
    
    act(layer, controls){
        return this.operate(layer, controls);
    }
    
    operate(layer, controls){
        throw new Error('.operate() must be implemented in the filter class');
    }
    
    convolve(pixels, filter, filter_div, offset){
        return this.engine.convolve(pixels, filter, filter_div, offset);
    }
};