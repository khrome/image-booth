import { Brush } from '../brush.mjs';
export class Square1px extends Brush{
    constructor(name='1px-square', engine){
        super(name || '1px-square', engine);
    }
    
    kernel(control){
        return [
            [255]
        ]
    }
};