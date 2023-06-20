import { Filter } from '../filter.mjs';
export class HighPass extends Filter{
    constructor(name='high-pass', engine){
        super(name || 'high-pass', engine); 
    }
    
    a3x3_matrix = [
        [ -1.0, -1.0, -1.0 ],
        [ -1.0,  9.0, -1.0 ],
        [ -1.0, -1.0, -1.0 ]
    ]
    a5x5_matrix = [
        [  0.0, -1.0, -1.0, -1.0,   0.0  ],
        [  -1.0,  2.0, -4.0,  2.0,  -1.0  ],
        [  0.0, -4.0, 13.0, -4.0,  -1.0  ],
        [  0.0,  2.0, -4.0,  2.0,  -1.0  ],
        [  0.0, -1.0, -1.0, -1.0,   0.0  ],
    ]
    
    filter(pixels, controls){
        if(controls.type == '3x3') return this.convolve(pixels, this.a3x3_matrix, controls.amount, controls.threshold);
        if(controls.type == '5x5') return this.convolve(pixels, this.a5x5_matrix, controls.amount, controls.threshold);
        return pixels;
    }
    
    getControls(){
        return {
            'type' : {
                'value' : '3x3',
                'default' : '3x3',
                'options' : '3x3,5x5',
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