import { chai } from 'environment-safe-chai';
import { Canvas } from 'environment-safe-canvas';
const should = chai.should();
import * as fs from 'fs';
import * as path from 'path';
import { Image, Booth } from '../image-booth.js';
import defaultBooth from '../src/booth.js';

describe('image-booth', ()=>{
    it('something', async function(){
        this.timeout(5000);
        const booth = new Booth();
        const image = booth.newImage({
            source : new URL('../node_modules/environment-safe-canvas/test/racoon.png', import.meta.url)
        });
        await image.ready;
        image.layers.length.should.equal(1);
        //console.log(image);
        await image.save('foo.png');
        const layer = image.layers[0];
        //await Canvas.save('foo1.png', layer.buffer);
        defaultBooth.dump('foo1', layer.buffer);
        defaultBooth.dump('foo2', layer.context2d.getImageData(0, 0, layer.buffer.width, layer.buffer.height));
        await defaultBooth.flush();
    });
});