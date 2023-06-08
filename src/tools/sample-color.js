import { Tool } from '../tool.js';
import booth from '../booth.js';
var rgb2hex = function rgb2hex(red, green, blue) {
    var alpha = '1';
    var rgb = ((blue | green << 8 | red << 16) | 1 << 24).toString(16).slice(1);

    // parse alpha value into float
    if(alpha.substr(0,1) === '.') {
        alpha = parseFloat('0' + alpha);
    }

    // cut alpha value after 2 digits after comma
    alpha = parseFloat(Math.round(alpha * 100)) / 100;

    return '#' + rgb.toString(16);
};
export class SampleColor extends Tool {
    constructor(name='sample-color', engine){
        super(name || 'sample-color', engine)
    }
    
    paint(pixels, x, y, brush, controls){
        var pos = ((y*(pixels.width*4)) + (x*4));
        booth.setForeground(rgb2hex(pixels.data[pos], pixels.data[pos+1], pixels.data[pos+2]));
        return pixels;
    }
};