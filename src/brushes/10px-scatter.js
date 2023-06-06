import { Brush } from '../brush.js';
export class Scatter10px extends Brush{
    constructor(name='10px-scatter', engine){
        super(name || '10px-scatter', engine);
    }
    
    kernel(control){
        return [
            [  0,   0,   0, 100,   0,   0,   0,   0, 100,   0],
            [  0,   0, 100, 150, 100,   0,   0, 100, 150, 100],
            [  0,  50,   0, 100,   0,   0,  50,   0, 100,   0],
            [ 50, 100,  50,   0,   0,  50, 100,  50,   0,   0],
            [  0,  50,   0, 100,   0,   0,  50,   0,   0,   0],
            [  0,   0, 100, 150, 100,   0,   0,   0,  50,   0],
            [  0,   0,   0, 100,   0,   0,   0,   0,   0,   0],
            [  0,   0,   0,   0,   0,   0,   0,  50,   0,   0],
            [  0,  50,   0,   0,  50,   0,  50, 100,  50,   0],
            [  0,   0,   0,   0,   0,   0,   0,  50,   0,   0]
        ]
    }
};