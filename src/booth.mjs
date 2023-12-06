import { Canvas } from '@environment-safe/canvas';

//core
import { Image } from './image.mjs';
import { Filter } from './filter.mjs';
import { Action } from './action.mjs';
import { Tool } from './tool.mjs';
import { Brush } from './brush.mjs';

//actions
import { GaussianBlur } from './filters/blur.mjs';
import { Emboss } from './filters/emboss.mjs';
import { Laplacian } from './filters/laplacian.mjs';
import { Sharpen } from './filters/sharpen.mjs';
import { HighPass } from './filters/high-pass.mjs';
import { Sobel } from './filters/sobel.mjs';
import { BrightnessContrast } from './operations/brightness-contrast.mjs';
import { Negative } from './operations/negative.mjs';

//tools
import { Paintbrush } from './tools/paintbrush.mjs';
import { Draw } from './tools/draw.mjs';
import { SampleColor } from './tools/sample-color.mjs';
import { FloodFill } from './tools/flood-fill.mjs';
import { Clone } from './tools/clone.mjs';

//brushes
import { Round5px } from './brushes/5px-round.mjs';
import { Round3px } from './brushes/3px-round.mjs';
import { Square1px } from './brushes/1px-square.mjs';
import { Square5px } from './brushes/5px-square.mjs';
import { Scatter10px } from './brushes/10px-scatter.mjs';
import { SoftRound5px } from './brushes/5px-soft-round.mjs'; 
import { SoftRound10px } from './brushes/10px-soft-round.mjs'; 
import { SoftRound15px } from './brushes/15px-soft-round.mjs'; 
import { SoftRound20px } from './brushes/20px-soft-round.mjs'; 
import { SoftRound40px } from './brushes/40px-soft-round.mjs';

//generators
import { TinyTextureTumbler } from './generators/tiny-texture-tumbler.mjs';
import { Noise } from './generators/noise.mjs';

import * as defaultEngine from './engine.mjs';
import { Emitter } from 'extended-emitter';

const metalist = ['Shift', 'Control', 'Alt', 'Meta'];

export class Booth{
    constructor(engine, options={}){
        this.engine = engine;
        this.toDump = [];
        this.registry = {};
        this.tools = {};
        this.brushes = {};
        this.currentTool = null;
        this.currentBrush = null;
        this.cloneMeta = {};
        this.workingHandler = options.working || (()=>{
            const el = document.getElementById('working');
            el.style.display = 'block';
        });
        this.stopWorkingHandler = options.stopWorking || (()=>{
            const el = document.getElementById('working');
            el.style.display = 'none';
        });
        (new Emitter()).onto(this);
    }
    
    working(value){
        if(this.workingHandler && value) this.workingHandler(value);
        if(this.stopWorkingHandler && !value) this.stopWorkingHandler(value);
    }
    
    setForeground(color){
        this.foreground = color;
        this.emit('set-foreground', color);
    }
    
    setBackground(color){
        this.background = color;
        this.emit('set-background', color);
    }
    
    //outside the image where we just need to set and react
    setupColorInteractions(foregroundFn, backgroundFn){
        const changeForeground = (value)=>{
              booth.setForeground(value.toUpperCase());
        }
        const changeBackground = (value)=>{
              booth.setBackground(value.toUpperCase());
        }
        this.on('set-foreground', (color)=>{
              if(foregroundFn) foregroundFn(color);
        });
        this.on('set-background', (color)=>{
              if(backgroundFn) backgroundFn(color);
        });
        //changeForeground(foreground);
        //changeBackground(background);
        return {
            changeForeground, 
            changeBackground
        };
    };
    
    //in the image where we need initial values, current values and to react
    setupColorModel( options = {foreground: {color:'#000000'}, background: {color:'#FFFFFF'} }){
        if(!options.foreground.color) options.foreground.color = '#000000';
        if(!options.background.color) options.background.color = '#FFFFFF';
        let focused = true;
        let currentForeground = options.foreground.color;
        let currentBackground = options.background.color;
        const { 
            changeForeground, changeBackground 
        } = this.setupColorInteractions((color)=>{
            if(focused){
                currentForeground = color;
                if(options.foreground.handler) options.foreground.handler(color);
            }
        },(color)=>{
            if(focused){
                currentBackground = color;
                if(options.background.handler) options.background.handler(color);
            }
        });
        changeForeground(options.foreground.color);
        changeBackground(options.background.color);
        if(globalThis && globalThis.addEventListener){
            globalThis.addEventListener('focus', ()=>{
                focused = true;
            });
            globalThis.addEventListener('blur', ()=>{
                focused = false;
            });
        }
        return {
            changeForeground, 
            changeBackground
        };
    };
    
    bindEventsToDom(process){
        this.on('set-foreground', (value)=>{
            const event = new CustomEvent('set-foreground', {
                detail: value
            });
            if(process){
                process.send('set-foreground', value);
            }else{
                document.body.dispatchEvent(event)
            }
        });
        this.on('set-background', (value)=>{
            const event = new CustomEvent('set-background', { 
                detail: value
            });
            if(process){
                process.send('set-background', value);
            }else{
                document.body.dispatchEvent(event)
            }
        });
    }
    
    recieveEventsFromDom(){
        this.on('set-foreground', (value)=>{
            this.setForeground(value);
        });
        this.on('set-background', (value)=>{
            this.setBackground(value);
        });
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
                    console.log('UPDATE!')
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
        this.meta = {};
        window.addEventListener('keydown', (event)=>{
            const metaIndex = metalist.indexOf(event.code.replace('Left', '').replace('Right', ''));
            if(metaIndex !== -1){
                this.meta[metalist[metaIndex].toLowerCase()] = true;
            }
        });
        window.addEventListener('keyup', (event)=>{
            const metaIndex = metalist.indexOf(event.code.replace('Left', '').replace('Right', ''));
            if(metaIndex !== -1){
                this.meta[metalist[metaIndex].toLowerCase()] = false;
            }
        });
        var drawing = false;
        const drawPoint = (event)=>{
            //console.log('D', this.currentTool, this.currentBrush, this.foreground, drawing, !!image.focused);
            if(this.currentTool && this.currentBrush && drawing && image.focused){
                const rect = canvas.getBoundingClientRect();
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
                            background: this.background,
                            cloneMeta: this.cloneMeta
                            //background: this.background,
                        }
                    )
                    image.currentLayer.context2d.putImageData(image.focused.pixels, 0, 0);
                    image.currentLayer.dirty = true;
                    console.log('PAINT', x, y);
                    //image.currentLayer.alteredSinceLastPreview = true;
                    //image.currentLayer.parentImage.repaint();
                });
            }
        }
        canvas.addEventListener('mousedown', ()=>{
            console.log('DRAW', image.focused, this.foreground);
            drawing = true;
            drawPoint(event);
        });
        canvas.addEventListener('mouseup', ()=>{
            drawing = false;
        });
        canvas.addEventListener('mousemove', (event)=>{
            drawPoint(event);
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
            //if(!this.currentTool) this.currentTool = ob;
            this[callable] = (pixels, shape, controls) => this[callable].stroke(pixels, controls);
        }
        if(ob instanceof Brush){
            this.brushes[ob.name()] = ob;
            //if(!this.currentBrush) this.currentBrush = ob;
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
booth.use(Draw);
booth.use(Clone);
booth.use(SampleColor);
booth.use(FloodFill);

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

//Generators
booth.use(TinyTextureTumbler);
booth.use(Noise);