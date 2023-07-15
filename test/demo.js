import { Canvas } from '@environment-safe/canvas';
import booth from '../image-booth.mjs';
import { buildFilterPreview, url, setupColorInteractions } from './demo-gui.js';
const openForm = document.getElementById('openForm');
//import { Game, Discovery } from './game.js';
//const client = new Discovery('game-name');

openForm.onsubmit = (e)=>{
    e.preventDefault(); 
    e.stopPropagation();  
    e.stopImmediatePropagation();
    setTimeout(async ()=>{
        try{
            const imageInput = document.getElementById('imageInput');
            // ::Stares off a vast cliff into a canyon of refuse:: 
            /// "A little messy, right?"
            if(imageInput.files[0]){
                var reader = new FileReader();
                reader.addEventListener('load', function(){
                    var arrayBuffer = this.result,
                      array = new Uint8Array(arrayBuffer),
                      binaryString = Buffer.from(array).toString('base64');
                    const image = new Image();
                    const fileType = imageInput.files[0].name.split('.').pop();
                    let data = null;
                    switch(fileType.toLowerCase()){
                        case 'png': data = `data:image/png;base64,${binaryString}`; break;
                        case 'jpeg', 'jpg': data = `data:image/jpg;base64,${binaryString}`; break;
                        case 'gif': data = `data:image/gif;base64,${binaryString}`; break;
                        default: throw new Error(`Unsupported image type: ${fileType}`);
                    }
                    image.onload = ()=>{
                        const opts = { image };
                        open(opts);
                    }
                    image.src = data;
                });
                reader.readAsArrayBuffer(imageInput.files[0]);
            }else{
                const imageUrl = document.getElementById('imageUrl');
                const options = { source: imageUrl.value };
                console.log(options);
                open(options);
            }
        }catch(ex){
            console.log('ERROR', ex);
        }
    });
    return false;
};

const open = (options)=>{
    const image = booth.newImage(options);
    (async ()=>{
        try{
            await image.ready;
            //image.layers[0].hidden = false;
            const toolbarWindow = document.getElementById('window1');
            const tabs = document.getElementById('colorTabs');
            const wheelTab = document.getElementById('wheelTab');
            const pickerTab = document.getElementById('pickerTab');
            const paletteTab = document.getElementById('paletteTab');
            tabs.addEventListener('click', ()=>{
                toolbarWindow.updated();
            });
            setTimeout(()=>{
                toolbarWindow.updated();
                tabs.updated();
                setTimeout(()=>{
                    wheelTab.updated();
                    pickerTab.updated();
                    paletteTab.updated();
                }, 1000);
            }, 200); //give Els a chance to land and attain size
            const openWindow = document.getElementById('openFile');
            toolbarWindow.style.display = 'block';
            openWindow.style.display = 'none';
            
            const { changeForeground, changeBackground } = setupColorInteractions();
            
            const brushesEl = document.getElementById('brushes');
            const operationsEl = document.getElementById('operations');
            operationsEl.updated({has:()=> false});
            brushesEl.remove()
            
            const canvas = document.getElementById('image');
            const screen = document.getElementById('screen');
            //booth.currentTool = booth.tools['paintbrush'];
            booth.enableDraw(canvas, image);
            
            const toolbar = document.getElementById('toolbarContents');
            toolbar.setAttribute('class', 'mainWindow');
            const tools = [
                {name: 'paintbrush', icon: 'brush', click: ()=>{
                    booth.currentTool = booth.tools['paintbrush'];
                    return true;
                }},
                {name: 'pencil', icon: 'edit', click: ()=>{
                    booth.currentTool = booth.tools['draw'];
                    return true;
                }},
                {name: 'floodfill', icon: 'format_color_fill', click: ()=>{
                    booth.currentTool = booth.tools['flood-fill'];
                    return true;
                }},
                {name: 'sample', icon: 'colorize', click: ()=>{
                    booth.currentTool = booth.tools['sample-color'];
                    return true;
                }},
                /* {name: 'import', icon: 'add_photo_alternate'},
                {name: 'magic-wand', icon: 'auto_fix_high'},
                {name: 'text', icon: 'text_fields'},*/
                {name: 'clone', icon: 'approval', click: ()=>{
                    booth.currentTool = booth.tools['clone'];
                    return true;
                }},
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
                screen.style.display = 'block';
                const filterWindow = document.getElementById('window2');
                filterWindow.setAttribute('style', 'position:fixed; display:block');
            })
            const brushDiv = document.getElementById('brushDiv');
            brushDiv.appendChild(brushesEl);
            brushesEl.updated({has:()=> false});
            let selectedButton = null;
            const setSelectedButton = (button)=>{
                if(selectedButton){
                    selectedButton.setAttribute('style', 'color: #FEFEFE');
                    selectedButton.children[0].setAttribute('style', 'color: #444444');
                }
                button.setAttribute('style', 'color: #444444');
                button.children[0].setAttribute('style', 'color: #000000');
                selectedButton = button;
            }
            tools.forEach((tool)=>{
                const button = document.createElement('wired-icon-button');
                button.innerHTML = `<mwc-icon>${tool.icon}</mwc-icon>`;
                button.setAttribute('style', 'color: #FEFEFE');
                button.children[0].setAttribute('style', 'color: #444444');
                button.addEventListener('click', ()=>{
                    let selectable = true;
                    if(tool.click) selectable = tool.click();
                    if(selectable) setSelectedButton(button);
                });
                toolbar.appendChild(button);
            });
            changeForeground('#000000');
            changeBackground('#FFFFFF');
        }catch(ex){
            console.log('ERR', ex, ex.message)
        }
    })();
    return image;
};
