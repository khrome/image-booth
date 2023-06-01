import { chai } from 'environment-safe-chai';
const should = chai.should();
import * as fs from 'fs';
import * as path from 'path';
import { Image, Booth } from '../image-booth.js';

describe('image-booth', ()=>{
    it('something', async ()=>{
        const booth = new Booth();
        const image = booth.newImage({
            source : new URL('racoon.jpg', import.meta.url)
        });
        await image.ready;
        console.log(image);
        
        
        /*
        image.save('./png_output.png', function(err){
            //should.not.exist(err);
            //done();
        });
        //*/
    });
});