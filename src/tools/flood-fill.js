import { Tool } from '../tool.js';
import booth from '../booth.js';
const colorDiff = (r1, g1, b1, r2, g2, b2)=>{
    return Math.abs(r1-r2) + Math.abs(g1-g2) + Math.abs(b1-b2)/(255*3)
}

const hex2rgb = (hex)=>{
    return [
        parseInt(hex.substring(1, 3), 16), 
        parseInt(hex.substring(3, 5), 16), 
        parseInt(hex.substring(5, 7), 16)
    ]
}
export class FloodFill extends Tool {
    constructor(name='flood-fill', engine){
        super(name || 'flood-fill', engine)
    }
    
    paint(pixels, x, y, brush, controls){
        booth.working(true);
        var options = controls;
        var pos = ((y*(pixels.width*4)) + (x*4));
        var hits = [];
        const sourceColor = [pixels.data[pos], pixels.data[pos+1], pixels.data[pos+2]];
        const foreground = hex2rgb(booth.foreground);
        var stack = [];
        stack.push([x, y, 'left']);
        var item, opacity;
        opacity = (options.opacity/100);
        if(!options.amount) options.amount = 50;
        let pp = 0;
        while(stack.length > 0){
            pos = ((y*(pixels.width*4)) + (x*4));
            item = stack.pop();
            x = item[0];
            y = item[1];
            if(
                !hits[pos] &&
                colorDiff(
                    sourceColor[0], 
                    sourceColor[1], 
                    sourceColor[2], 
                    pixels.data[pos], 
                    pixels.data[pos+1], 
                    pixels.data[pos+2]
                ) < (options.amount/100)
            ){
                pp++
                pixels.data[pos] = (foreground[0]*opacity) + ((1.0-opacity)*pixels.data[pos]);
                pixels.data[pos+1] = (foreground[1]*opacity) + ((1.0-opacity)*pixels.data[pos+1]);
                pixels.data[pos+2] = (foreground[2]*opacity) + ((1.0-opacity)*pixels.data[pos+2]);
                hits[pos] = true;
                switch(item[2]){
                    case 'left' :
                        stack.push([x, y, 'right']);
                        x--
                        if(x >= 0 && !hits[((y*(pixels.width*4)) + (x*4))]){
                            stack.push([x, y, 'left']);
                        }
                        break;
                    case 'right' :
                        stack.push([x, y, 'top']);
                        x++
                        if(x < pixels.width && !hits[((y*(pixels.width*4)) + (x*4))]) stack.push([x, y, 'left']);
                        break;
                    case 'top' :
                        stack.push([x, y, 'bottom']);
                        y++
                        if(y < pixels.height && !hits[((y*(pixels.width*4)) + (x*4))]) stack.push([x, y, 'left']);
                        break;
                    case 'bottom' :
                        y--;
                        if(y >= 0 && !hits[((y*(pixels.width*4)) + (x*4))]) stack.push([x, y, 'left']);
                        break;
                }
                continue;
            }
            if(item[2] != 'left'){
                switch(item[2]){
                    case 'right' :
                        stack.push([x, y, 'top']);
                        x++
                        if(x < pixels.width && !hits[((y*(pixels.width*4)) + (x*4))]) stack.push([x, y, 'left']);
                        break;
                    case 'top' :
                        stack.push([x, y, 'bottom']);
                        y++
                        if(y < pixels.height && !hits[((y*(pixels.width*4)) + (x*4))]) stack.push([x, y, 'left']);
                        break;
                    case 'bottom' :
                        y--;
                        if(y >= 0 && !hits[((y*(pixels.width*4)) + (x*4))]) stack.push([x, y, 'left']);
                        break;
                }
            }
        }
        booth.working(false);
        return pixels;
    }
};