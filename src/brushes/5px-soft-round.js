import { Brush } from '../brush.js';
export class SoftRound5px extends Brush{
    constructor(name='5px-soft-round', engine){
        super(name || '5px-soft-round', engine);
    }
    
    kernel(control){
        return [
            [  0, 100, 120, 100,   0],
            [100, 150, 175, 150, 100],
            [120, 175, 200, 175, 120],
            [100, 150, 175, 150, 100],
            [  0, 100, 120, 100,   0],
        ]
    }
};