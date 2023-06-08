import { Tool } from '../tool.js';
import booth from '../booth.js';

const hex2rgb = (hex)=>{
    return [
        parseInt(hex.substring(1, 3), 16), 
        parseInt(hex.substring(3, 5), 16), 
        parseInt(hex.substring(5, 7), 16)
    ]
}
export class Draw extends Tool {
    constructor(name='draw', engine){
        super(name || 'draw', engine)
    }
    
    paint(pixels, x, y, brush, controls){
        var options = controls;
        var pos = ((y*(pixels.width*4)) + (x*4));
        var hits = [];
        const sourceColor = [pixels.data[pos], pixels.data[pos+1], pixels.data[pos+2]];
        const foreground = hex2rgb(booth.foreground);
        var stack = [];
        stack.push([x, y, 'left']);
        var item, opacity;
        opacity = (options.opacity/100);
        //console.log('flood')
        if(!options.amount) options.amount = 50;
        let pp = 0;
        pos = ((y*(pixels.width*4)) + (x*4));
        pixels.data[pos] = (foreground[0]*opacity) + ((1.0-opacity)*pixels.data[pos]);
        pixels.data[pos+1] = (foreground[1]*opacity) + ((1.0-opacity)*pixels.data[pos+1]);
        pixels.data[pos+2] = (foreground[2]*opacity) + ((1.0-opacity)*pixels.data[pos+2]);
        return pixels;
    }
};