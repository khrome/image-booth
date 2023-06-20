import { Canvas } from 'environment-safe-canvas';
import { Filter } from '../filter.mjs';
export class Laplacian extends Filter{
    constructor(name='detect-gradient', engine){
        super(name || 'detect-gradient', engine); 
    }
    
   laplacian_matrix = [
       [   0.0, -1.0, 0.0  ],
       [  -1.0, 4.0, -1.0 ],
       [  0.0, -1.0, 0.0  ]
   ]
   
   laplacian_matrix2 = [
       [   -1.0, -1.0, -1.0  ],
       [  -1.0, 8.0, -1.0 ],
       [  -1.0, -1.0, -1.0  ]
   ]
    
    filter(pixels, controls){
        const mergeBuffer = new Canvas({ width: pixels.width, height: pixels.height });
        const mergeContext = mergeBuffer.getContext('2d', { willReadFrequently: true });
        mergeContext.willReadFrequently = true;
        var resultA = this.convolve(pixels, this.laplacian_matrix, 2, 1);
        var resultB = this.convolve(pixels, this.laplacian_matrix2, 2, 1);
        return this.merge(resultA, resultB, mergeContext, 'lighten');
    }
    
    getControls(){
        return {
            'type' : {
                'value' : 'a',
                'default' : 'a',
                'options' : 'a,b',
            },
            'amount' : {
                'value' : '2',
                'default' : '2',
                'upper_bound' : '20',
                'lower_bound' : '0'
            },
            'threshold' : {
                'value' : '5',
                'default' : '5',
                'upper_bound' : '10',
                'lower_bound' : '0'
            },
        };
    }
};