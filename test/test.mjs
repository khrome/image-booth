import { chai } from '@environment-safe/chai';
import { it, configure } from '@open-automaton/moka';
import { File, Download, Path, FileBuffer } from '@environment-safe/file';
import { Canvas, ImageFile, pixelSimilarity } from '@environment-safe/canvas';
import { isClient } from '@environment-safe/runtime-context';
const should = chai.should();
import * as fs from 'fs';
import * as path from 'path';
import { Image, Booth } from '../image-booth.mjs';
import booth from '../src/booth.mjs';

const imageSimilarity = async (buffer, filePath)=>{
    const canonicalFile = new ImageFile(filePath);
    await canonicalFile.load();
    const similarity = await pixelSimilarity(
        buffer, 
        canonicalFile.buffer,
        { 
            notBlank: true,
            notEmpty: true,
            notIdentity: true
        }
    );
    return similarity;
}

const getImage = async (name, initialImage='./images/white.jpg')=>{
    const loadPath = initialImage;
    const image = booth.newImage({ source : new URL(loadPath, import.meta.url) });
    await image.ready;
    return image;
}

const testLayerAction = async (name, download, handler, initial)=>{
    const image = await getImage(name, initial);
    image.layers.length.should.equal(1);
    const layer = image.layers[0];
    handler(layer);
    const result = await saveAndReturnBuffer(name, image, download.expect());
    should.exist(result);
    const similarity = await imageSimilarity(
        result,
        `./images/${name}.png`
    );
    similarity.should.be.above(0.999);
}

const saveAndReturnBuffer = async (name, image, anticipatedDownload)=>{
    const savePath = Path.join(Path.location('downloads'), `${name}.png`);
    await image.save(savePath);
    const result = await anticipatedDownload;
    return await result.arrayBuffer();
}

describe('image-booth', ()=>{
    const download = new Download();
    configure({
        // dialog : async (context, actions)=> await actions.confirm(), // OK everything,
        //wantsInput : async (context, actions)=> await actions.click('#mocha'), // click everything
        downloads: (dl)=> download.observe(dl),
        write: (dl)=> download.observe(dl)
    });
    
    describe('filters', ()=>{
        
        it(`performs gaussian-blur`, async function(){
            this.timeout(10000);
            //*
            await testLayerAction(
                'negative', 
                download,
                (layer)=> layer.act('gaussian-blur', { radius: 20 }),
                './images/savannah_trees.jpg'
            ); //*/
            /*
            const loadPath = './images/savannah_trees.jpg';
            const savePath = Path.join(Path.location('downloads'), 'trees.png');
            const image = booth.newImage({ source : new URL(loadPath, import.meta.url) });
            
            await image.ready;
            image.layers.length.should.equal(1);
            const layer = image.layers[0];
            layer.act('gaussian-blur', { radius: 20 });
            const anticipatedDownload = download.expect();
            await image.save(savePath);
            const result = await anticipatedDownload;
            console.log('!');//*/
        });
        
        it(`performs detect-edges`, async function(){
            this.timeout(10000);
            await testLayerAction(
                'negative', 
                download,
                (layer)=> layer.act('detect-edges', { direction: 'west' }),
                './images/savannah_trees.jpg'
            );
        });
    
    });    
    describe('operations', ()=>{
        
        it(`performs a photnegative`, async function(){
            this.timeout(10000);
            await testLayerAction(
                'negative', 
                download,
                (layer)=> layer.act('negative', { }),
                './images/savannah_trees.jpg'
            );
        });
        
    });
    describe('paint operations', ()=>{
        
        it(`paints a 10px scatter`, async function(){
            this.timeout(10000);
            await testLayerAction(
                '10px-scatter', 
                download,
                (layer)=> layer.paint('paintbrush', { x: 30, y: 30 }, '10px-scatter') 
            );
        });
        
    });
});