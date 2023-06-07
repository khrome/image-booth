import { Brush } from '../brush.js';
export class Square5px extends Brush{
    constructor(name='5px-square', engine){
        super(name || '5px-square', engine);
    }
    
    kernel(control){
        return [
            [255, 255, 255, 255, 255],
            [255, 255, 255, 255, 255],
            [255, 255, 255, 255, 255],
            [255, 255, 255, 255, 255],
            [255, 255, 255, 255, 255],
        ];
    }
};