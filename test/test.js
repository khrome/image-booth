import { chai } from 'environment-safe-chai';
import { Canvas } from 'environment-safe-canvas';
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
        image.layers.length.should.equal(1);
        //console.log(image);
        await image.save('foo.png');
        const layer = image.layers[0];
        await Canvas.save('foo1.png', layer.buffer);
    });
});