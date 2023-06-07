import { Brush } from '../brush.js';
export class Round5px extends Brush{
    constructor(name='5px-round', engine){
        super(name || '5px-round', engine);
    }
    
    kernel(control){
        return [
            [  0, 120, 255, 120,   0],
            [120, 255, 255, 255, 120],
            [255, 255, 255, 255, 255],
            [120, 255, 255, 255, 120],
            [  0, 120, 255, 120,   0],
        ]
    }
};