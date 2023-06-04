import { chai } from 'environment-safe-chai';
import { Canvas } from 'environment-safe-canvas';
const should = chai.should();
import * as fs from 'fs';
import * as path from 'path';
import { Image, Booth } from '../image-booth.js';
import booth from '../src/booth.js';

describe('image-booth', ()=>{
    it('something', async function(){
        this.timeout(5000);
        const image = booth.newImage({
            source : new URL('../node_modules/environment-safe-canvas/test/racoon.png', import.meta.url)
        });
        await image.ready;
        image.layers.length.should.equal(1);
        const layer = image.layers[0];
        //layer.act('gaussian-blur', { radius: 20 });
        layer.act('emboss', { type: 'a' });
        await image.save('foo.png');
        const reloaded = await Canvas.load('foo.png');
        await booth.flush();
    });
});