import booth from '../booth.mjs';
let count = 0;
export const overlay = (aPixels, bPixels, newPixels)=>{
    var sx = aPixels.width; //getx
    var sy = aPixels.height; //gety
    var index, a_alpha, b_alpha;
    var x;
    const R_OFFSET = 0;
    const G_OFFSET = 1;
    const B_OFFSET = 2;
    const A_OFFSET = 3;
    for(var y = 0; y < sy; y++){
        for(x = 0; x < sx; x++){
            index = ((y*(sx*4)) + (x*4));
            a_alpha = aPixels.data[index  + A_OFFSET];
            /*if(a_alpha == 255){
                newPixels.data[index + R_OFFSET ] =  bPixels.data[index     ];
                newPixels.data[index + G_OFFSET ] = bPixels.data[index + G_OFFSET ];
                newPixels.data[index + B_OFFSET ] = bPixels.data[index + B_OFFSET ];
                newPixels.data[index + A_OFFSET ] = 255;
                //newPixels.data[index + A_OFFSET ] = bPixels.data[index + A_OFFSET ];
            }else if (a_alpha == 0){
                newPixels.data[index + R_OFFSET ] =  aPixels.data[index     ];
                newPixels.data[index + G_OFFSET ] = aPixels.data[index + G_OFFSET ];
                newPixels.data[index + B_OFFSET ] = aPixels.data[index + B_OFFSET ];
                newPixels.data[index + A_OFFSET ] = 255;
                //newPixels.data[index + A_OFFSET ] = a_alpha;
            }else{*/
                //technically b should be a composite, and not use additive 
                
                var a_combine_amount = 255-a_alpha/255;
                var b_combine_amount = (a_alpha)/255;
                var b_alpha = bPixels.data[index  + 3];
                /*
                newPixels.data[index    ] = 
                    (aPixels.data[index     ] * a_combine_amount) 
                    + (bPixels.data[index     ] * b_combine_amount)
                ;
                newPixels.data[index + 1 ] = 
                    (aPixels.data[index + 1 ] * a_combine_amount) 
                    + (bPixels.data[index + 1 ] * b_combine_amount)
                ;
                newPixels.data[index + 2 ] = 
                    (aPixels.data[index + 2 ] * a_combine_amount) 
                    + (bPixels.data[index + 2 ] * b_combine_amount)
                ; //*/
                //newPixels.data[index + A_OFFSET ] = 255;
                //newPixels.data[index + 3 ] = Math.max(a_alpha, b_alpha);
            //}
        }
    }
}