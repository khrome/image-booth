const chai = require('chai');
const { Canvas } = require('@environment-safe/canvas');
const should = chai.should();
const fs = require('fs');
const path = require('path');
const { Image, Booth } = require('../image-booth.cjs');
const booth = require('../dist/booth.cjs').default;

describe('image-booth', ()=>{
    it('something', async function(){
        this.timeout(5000);
        const image = booth.newImage({
            source : path.join(__dirname, '../node_modules/environment-safe-canvas/test/racoon.png')
        });
        await image.ready;
        image.layers.length.should.equal(1);
        const layer = image.layers[0];
        //layer.act('gaussian-blur', { radius: 20 });
        //layer.act('emboss', { type: 'a' });
        //layer.act('detect-gradient', { });
        //layer.act('sharpen', { k: 4 });
        //layer.act('high-pass', { type: '3x3' });
        //layer.act('detect-edges', { direction: 'west' });
        //layer.act('brightness-contrast', { brightness: 100, contrast: 100 });
        //layer.act('negative', { });
        layer.stroke('paintbrush', {
            x: 30, y: 30,
            x2: 80, y2: 80
        }, '10px-scatter', { spacing: 0.5 });
        await image.save('foo.png');
        const reloaded = await Canvas.load('foo.png');
        await booth.flush();
    });
});