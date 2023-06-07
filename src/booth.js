import { Canvas } from 'environment-safe-canvas';

//core
import { Image } from './image.js';
import { Filter } from './filter.js';
import { Action } from './action.js';
import { Tool } from './tool.js';
import { Brush } from './brush.js';

//actions
import { GaussianBlur } from './filters/blur.js';
import { Emboss } from './filters/emboss.js';
import { Laplacian } from './filters/laplacian.js';
import { Sharpen } from './filters/sharpen.js';
import { HighPass } from './filters/high-pass.js';
import { Sobel } from './filters/sobel.js';
import { BrightnessContrast } from './operations/brightness-contrast.js';
import { Negative } from './operations/negative.js';

//tools
import { Paintbrush } from './tools/paintbrush.js';

//brushes
import { Round5px } from './brushes/5px-round.js';
import { Round3px } from './brushes/3px-round.js';
import { Square1px } from './brushes/1px-square.js';
import { Square5px } from './brushes/5px-square.js';
import { Scatter10px } from './brushes/10px-scatter.js';
import { SoftRound5px } from './brushes/5px-soft-round.js'; 
import { SoftRound10px } from './brushes/10px-soft-round.js'; 
import { SoftRound15px } from './brushes/15px-soft-round.js'; 
import { SoftRound20px } from './brushes/20px-soft-round.js'; 
import { SoftRound40px } from './brushes/40px-soft-round.js';

import * as defaultEngine from './engine.js';
import { Emitter } from 'extended-emitter/extended-emitter.mjs';
export class Booth{
    constructor(engine){
        this.engine = engine;
        this.toDump = [];
        this.registry = {};
        this.tools = {};
        this.brushes = {};
        this.currentTool = null;
        this.currentBrush = null;
        (new Emitter()).onto(this);
    }
    
    setForeground(color){
        this.foreground = color;
        this.emit('set-foreground', color);
    }
    
    setBackground(color){
        this.background = color;
        this.emit('set-background', color);
    }
    
    bind(canvas, image, resolution=100){
        canvas.width = image.width();
        canvas.height = image.height();
        canvas.setAttribute('style', "cursor : url('./icon/Precision.cur'), crosshair")
        let framelock;
        const getFrame = (handler)=>{
            if(!framelock){
                framelock = true;
                requestAnimationFrame(()=>{
                    framelock = false;
                    handler();
                });
            }
        }
        const interval = setInterval(()=>{
            let dirty = null;
            getFrame(()=>{
                dirty = image.dirty();
                if(dirty){
                    const context = canvas.getContext('2d', { willReadFrequently: true });
                    const pixels = image.composite('pixels');
                    context.putImageData(pixels, 0, 0, 0, 0, pixels.width, pixels.height);
                    image.dirty(false);
                }
            });
        }, resolution);
        const context = canvas.getContext('2d', { willReadFrequently: true });
        const pixels = image.composite('pixels');
        context.putImageData(pixels, 0, 0, 0, 0, image.width(), image.height());
    }
    
    enableDraw(canvas, image){
        var drawing = false;
        canvas.addEventListener('mousedown', ()=>{
            drawing = true;
        });
        canvas.addEventListener('mouseup', ()=>{
            drawing = false;
        });
        canvas.addEventListener('mousemove', (event)=>{
            var rect = canvas.getBoundingClientRect();
            if(this.currentTool && this.currentBrush && drawing && image.focused){
                const x = event.x - rect.left;
                const y = event.y - rect.top;
                const brush = this.currentBrush.kernel({});
                setTimeout(()=>{ //detach from event
                    this.currentTool.paint(
                        image.focused.pixels,
                        x, 
                        y, 
                        brush, 
                        {
                            foreground: this.foreground,
                            //background: this.background,
                        }
                    )
                    image.currentLayer.context2d.putImageData(image.focused.pixels, 0, 0);
                    image.currentLayer.dirty = true;
                    //image.currentLayer.alteredSinceLastPreview = true;
                    //image.currentLayer.parentImage.repaint();
                });
            }
        });
        this.bind(canvas, image, 5);
    }
    
    register(ob){
        let callable = ob.getLabel().split(' ').join('');
        callable = callable.substring(0, 1).toLowerCase()+callable.substring(1);
        if(this[callable]) throw new Error(`${callable} is a reserved symbol`);
        if(ob instanceof Action){
            this.registry[ob.name()] = ob;
            this[callable] = (pixels, controls) => this[callable].act(pixels, controls);
        }
        if(ob instanceof Tool){
            this.tools[ob.name()] = ob;
            if(!this.currentTool) this.currentTool = ob;
            this[callable] = (pixels, shape, controls) => this[callable].stroke(pixels, controls);
        }
        if(ob instanceof Brush){
            this.brushes[ob.name()] = ob;
            if(!this.currentBrush) this.currentBrush = ob;
        }
    }
    
    use(classDef){
        const instance = new classDef(null, this.engine);
        this.register(instance);
    } 
    
    newImage(options){
        const image = new Image(options);
        return image;
    }
    
    async save(location, ob){
        if(ob.data && ob.height && ob.width){
            //imageData
            const canvas = new Canvas({ height: ob.height,  width: ob.width });
            const context = canvas.getContext('2d', { willReadFrequently: true });
            context.putImageData(ob, 0, 0, 0, 0, ob.width, ob.height);
            await Canvas.save(location, canvas);
        }
        
        if(ob.getContext){
            //canvas
            await Canvas.save(location, ob);
        }
    }
    
    dump(id, ob){
        this.toDump.push({ id, ob });
    }
    
    async flush(){
        let lcv=0;
        for(;lcv< this.toDump.length; lcv++){
            if(this.toDump[lcv].ob){
                if(this.toDump[lcv].ob.data) console.log('WRITING', Array.prototype.filter.call(
                    this.toDump[lcv].ob.data, 
                    (value)=> !(value === 0 || value === 255) 
                ));
            }
            await this.save(this.toDump[lcv].id+'.png', this.toDump[lcv].ob);
        }
    }
}

//make the default a kitchen sink booth
const booth = new Booth(defaultEngine);
export default booth;

//Filters
booth.use(GaussianBlur);
booth.use(Emboss);
booth.use(Laplacian);
booth.use(Sharpen);
booth.use(HighPass);
booth.use(Sobel);

//Operations
booth.use(BrightnessContrast);
booth.use(Negative);

//Tools
booth.use(Paintbrush);

//Brushes
booth.use(Square1px);
booth.use(Square5px);
booth.use(Round3px);
booth.use(Round5px);
booth.use(Scatter10px);
booth.use(SoftRound5px);
booth.use(SoftRound10px);
booth.use(SoftRound15px);
booth.use(SoftRound20px);
booth.use(SoftRound40px);