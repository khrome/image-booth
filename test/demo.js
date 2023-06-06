import { Canvas } from 'environment-safe-canvas';
import booth from '../image-booth.js';
const url = (location, metaUrl)=>{
    if(
        typeof process === 'object' && 
        typeof process.versions === 'object' && 
        typeof process.versions.node !== 'undefined'
    ){
        return new URL('../node_modules/'+location, import.meta.url)
    }
    if(location.toString().indexOf('://') !== -1){
        return location;
    }
    return '../node_modules/'+location;
}
const image = booth.newImage({
    source : url('environment-safe-canvas/test/racoon.png', import.meta.url)
});
const setupColorInteractions = ()=>{
    const wheel = document.getElementById('wheel');
    const picker = document.getElementById('picker');
    const foregroundColor = document.getElementById('foreground-color');
    const backgroundColor = document.getElementById('background-color');
    const colorSwitch = document.getElementById('color-switch');
    console.log('%%', colorSwitch);
    colorSwitch.addEventListener('click', ()=>{
        const foreground = foregroundColor.hex;
        const background = backgroundColor.hex;
        console.log('>>>', foreground, background)
        changeForeground(background);
        changeBackground(foreground);
    })
    const changeForeground = (value)=>{
        booth.setForeground(value.toUpperCase());
    }
    const changeBackground = (value)=>{
        booth.setBackground(value.toUpperCase());
    }
    foregroundColor.addEventListener('change', (event)=>{
        if(event.detail.hex !== foregroundColor.hex){
            changeForeground(foregroundColor.hex);
        }
    });
    picker.addEventListener('change', (event)=>{
        const value = event.detail.value.toUpperCase();
        if(value !== foregroundColor.hex){
            changeForeground(value);
        }
    });
    backgroundColor.addEventListener('change', (event)=>{
        if(event.detail.hex !== backgroundColor.hex){
            changeBackground(backgroundColor.hex);
        }
    });
    booth.on('set-foreground', (color)=>{
        if(wheel.getAttribute('color') !== color){
            wheel.setAttribute('color', color);
        }
        if(picker.value !== color){
            picker.value = color;
        }
        if(foregroundColor.color !== color){
            foregroundColor.color = color
        }
    });
    booth.on('set-background', (color)=>{
        if(backgroundColor.color !== color){
            backgroundColor.color = color
        }
    });
    changeForeground(foregroundColor.hex);
    wheel.addEventListener('mouseup', ()=>{
        setTimeout(()=>{
            changeForeground(wheel.getAttribute('color'));
        }, 10);
    })
}
(async ()=>{
    await image.ready;
    image.layers[0].hidden = false;
    
    setupColorInteractions();
    
    const brushesEl = document.getElementById('brushes');
    
    const canvas = document.getElementById('image');
    booth.currentTool = booth.tools['paintbrush'];
    booth.currentBrush = booth.brushes['10px-scatter'];
    booth.enableDraw(canvas, image);
    
    const toolbar = document.getElementById('toolbarContents');
    toolbar.setAttribute('class', 'mainWindow');
    const tools = [
        {name: 'paintbrush', icon: 'brush'},
        {name: 'pencil', icon: 'edit'},
        {name: 'floodfill', icon: 'format_color_fill'},
        {name: 'sample', icon: 'colorize'},
        {name: 'import', icon: 'add_photo_alternate'},
        {name: 'magic-wand', icon: 'auto_fix_high'},
        {name: 'text', icon: 'text_fields'},
        {name: 'clone', icon: 'approval'},
        {name: 'print', icon: 'print'},
        {name: 'save', icon: 'get_app'},
        {name: 'cloud', icon: 'backup'},
        {name: 'settings', icon: 'settings_applications'},
    ];
    const brushes = Object.keys(booth.brushes).map((brushName)=> booth.brushes[brushName]);
    brushes.forEach((brush)=>{
        const brushEl = document.createElement('wired-item');
        brushEl.setAttribute('value', brush.name());
        brushEl.innerText = brush.getLabel();
        brushesEl.appendChild(brushEl);
        if(brush === booth.currentBrush){
            //brushEl.setAttribute('selected', true);
            brushesEl.setAttribute('selected', brush.name());
        }
    });
    tools.forEach((tool)=>{
        const button = document.createElement('wired-icon-button');
        button.innerHTML = `<mwc-icon>${tool.icon}</mwc-icon>`
        toolbar.appendChild(button);
    });
})();
