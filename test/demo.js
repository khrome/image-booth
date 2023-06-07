import { Canvas } from 'environment-safe-canvas';
import booth from '../image-booth.js';
import { buildFilterPreview, url, setupColorInteractions } from './demo-gui.js';
const image = booth.newImage({
    source : url('environment-safe-canvas/test/racoon.png', import.meta.url)
});
(async ()=>{
    await image.ready;
    image.layers[0].hidden = false;
    
    const { changeForeground, changeBackground } = setupColorInteractions();
    
    const brushesEl = document.getElementById('brushes');
    const operationsEl = document.getElementById('operations');
    brushesEl.remove()
    
    const canvas = document.getElementById('image');
    //booth.currentTool = booth.tools['paintbrush'];
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
        {name: 'print', icon: 'print', click: ()=>{
            window.print();
        }},
        {name: 'save', icon: 'get_app', click: ()=>{
            image.save();
        }},
        {name: 'cloud', icon: 'backup'},
        {name: 'settings', icon: 'settings'},
    ];
    
    const brushes = Object.keys(booth.brushes).map((brushName)=> booth.brushes[brushName]);
    brushes.forEach((brush)=>{
        const brushEl = document.createElement('wired-item');
        brushEl.setAttribute('value', brush.name());
        brushEl.innerText = brush.getLabel();
        brushEl.setAttribute('role', 'option');
        brushEl.setAttribute('class', 'wired-rendered');
        if(brush === booth.currentBrush){
            brushesEl.setAttribute('selected', brush.name());
            brushEl.setAttribute('aria-selected', true);
        }
        brushesEl.appendChild(brushEl);
    });
    brushesEl.addEventListener('selected', (e)=>{
        const brushName = brushesEl.value.value;
        booth.brushes[brushName]
        if(booth.brushes[brushName]){
            booth.currentBrush = booth.brushes[brushName];
        }
    });
    const operations = Object.keys(booth.registry).map((brushName)=> booth.registry[brushName]);
    operations.forEach((operation)=>{
        const operationEl = document.createElement('wired-item');
        operationEl.setAttribute('value', operation.name());
        operationEl.innerText = operation.getLabel();
        operationEl.setAttribute('role', 'option');
        operationEl.setAttribute('class', 'wired-rendered');
        operationsEl.appendChild(operationEl);
    });
    operationsEl.addEventListener('selected', (event)=>{
        const action = booth.registry[event.detail.selected];
        const filterwindowContent = document.getElementById('filterContents');
        buildFilterPreview(action, filterwindowContent, image);
        const filterwindow = document.getElementById('window2');
        filterwindow.setAttribute('style', 'display:initial');
    })
    const brushDiv = document.getElementById('brushDiv');
    brushDiv.appendChild(brushesEl);
    tools.forEach((tool)=>{
        const button = document.createElement('wired-icon-button');
        button.innerHTML = `<mwc-icon>${tool.icon}</mwc-icon>`
        if(tool.click) button.addEventListener('click', ()=>{
            tool.click();
        })
        toolbar.appendChild(button);
    });
    changeForeground('#000000');
    changeBackground('#FFFFFF');
})();
