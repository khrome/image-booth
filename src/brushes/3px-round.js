import { Brush } from '../brush.js';
export class Round3px extends Brush{
    constructor(name='3px-round', engine){
        super(name || '3px-round', engine);
    }
    
    kernel(control){
        return [
            [ 25, 100,  25],
            [100, 255, 100],
            [ 25, 100,  25],
        ]
    }
};