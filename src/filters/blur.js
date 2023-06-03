import { Filter } from '../filter.js';
export class GaussianBlur extends Filter{
    constructor(name='gaussian-blur', engine){
        super(name || 'gaussian-blur', engine);
    }
    
    matrix(x, y){
        var matrix = [];
        var row;
        var o = 0.84089642;
        //if(x > 6 * o) x = Math.ceil(6 * o);
        //if(y > 6 * o) y = Math.ceil(6 * o);
        var sum = 0;
        var count = 0;
        for(var ypos = 0; ypos < y; ypos++){
            row = [];
            var value;
            for(var xpos = 0; xpos < x; xpos++){
                value = ( 1 / (2 * Math.PI * (o^2) ) ) *
                    (Math.E^( ((x^2)+(y^2)) / (2 * (o^2)) ));
                row.push( 
                    value
                );
                sum += value
                count++;
            }
            matrix.push(row);
        }
        var avg = sum / count;
        //*
        for(var ypos = 0; ypos < y; ypos++){
            for(var xpos = 0; xpos < x; xpos++){
                matrix[ypos][xpos] = matrix[ypos][xpos]/sum;
            }
        }//*/
        return matrix;
        
    }
    
    filter(pixels, controls){
        var matrix = this.matrix(controls.radius, controls.radius);
        return this.convolve(pixels, matrix, controls.amount, controls.threshold);
    }
    
    getControls(){
        return {
            'amount' : {
                'value' : '1',
                'default' : '1',
                'upper_bound' : '10',
                'lower_bound' : '0'
            },
            'radius' : {
                'value' : '6',
                'default' : '6',
                'upper_bound' : '12',
                'lower_bound' : '3'
            },
            'threshold' : {
                'value' : '1',
                'default' : '1',
                'upper_bound' : '10',
                'lower_bound' : '0'
            },
        };
    }
};