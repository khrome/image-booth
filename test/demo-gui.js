import booth from '../image-booth.js';
// a *very* simple vanilla js GUI for demo purposes
export const url = (location, metaUrl)=>{
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
};

export const buildFilterPreview = (action, container, image)=>{
    const label = action.getLabel();
    const controls = action.getControls();
    while(container.children.length) container.children[container.children.length-1].remove();
    const layout = document.createElement('table');
    layout.setAttribute('style', 'width:100%')
    layout.innerHTML = '<tr><td style="width:350px; padding: 10px"><canvas id="preview" style="height:350px; width:350px" height="350" width="350"></td><td id="settingsCell" style="padding: 10px"></td>';
    container.appendChild(layout);
    const pixels = image.composite('pixels');
    const canvasEl = document.getElementById('preview');
    const context = canvasEl.getContext('2d', { willReadFrequently: true });
    const getValues = ()=>{
        const results = {};
        Object.keys(controls).forEach((key)=>{
            results[key] = document.getElementById(`value-${key}`).innerText;
        });
        return results;
    }
    const applyFilterToPreview = ()=>{
        const pixels = context.getImageData(0, 0, canvasEl.width, canvasEl.height);
        const controls = getValues();
        console.log(controls, pixels.data);
        action.act(pixels, controls);
        context.putImageData(pixels, 0, 0, 0, 0, canvasEl.width, canvasEl.height);;
        console.log('POST', pixels.data);
    }
    const settingsCell = document.getElementById('settingsCell');
    const settings = document.createElement('table');
    settings.setAttribute('style', 'width:100%; height: 320px')
    let row, elementText, control;
    let labelEl, controlEl;
    row = document.createElement('tr');
    row.innerHTML = `<td colspan="2" style="vertical-align:top"><label style="font-size:2em; font-weight:800">${label}</label></td>`;
    settings.appendChild(row);
    settingsCell.appendChild(settings);
    Object.keys(controls).forEach((key)=>{
        row = document.createElement('tr');
        control = controls[key];
        elementText = '';
        if(control.upper_bound && control.lower_bound){
            elementText = `<div style="display:block; position:absolute; margin-left:-10px; margin-top:10px;" id="value-${key}">${control.value || control.default}</div><wired-slider id="control-${key}" value="${control.value || control.default}" min="${control.lower_bound}" max="${control.upper_bound}"></wired-slider>`;
        }
        row.innerHTML = `<td><label style="margin-right:10px">${key}</label></td><td>${elementText}</td>`
        settings.appendChild(row);
        const controlEl = document.getElementById(`control-${key}`);
        const valueEl = document.getElementById(`value-${key}`);
        controlEl.addEventListener('change', (event)=>{
            if(event.detail.value !== Math.floor(event.detail.value)){
                controlEl.value = Math.floor(event.detail.value);
                valueEl.innerText = controlEl.value;
            }
            setTimeout(()=>{
                applyFilterToPreview();
            });
        });
    });
    const foot = document.createElement('div');
    foot.setAttribute('style', 'width:100%; text-align:right')
    foot.innerHTML = `
        <wired-button id="cancelFilter">${'Cancel'}</wired-button>
        <wired-button elevation="3" id="applyFilter">${'Apply'}</wired-button>
    `;
    const thesePixels = context.getImageData(0, 0, canvasEl.width, canvasEl.height);
    const marginHorizontal =  Math.floor((pixels.height - canvasEl.height)/2);
    const marginVertical =  Math.floor((pixels.width - canvasEl.width)/2);
    let thisX, thisY, x, y, offset, thisOffset;
    for(thisX = 0; thisX < thesePixels.width; thisX++){
        for(thisY = 0; thisY < thesePixels.height; thisY++){
            thisOffset = thisY * thesePixels.width * 4 + thisX * 4;
            offset = (thisY+marginVertical) * pixels.width * 4 + (thisX+marginHorizontal) * 4;
            thesePixels.data[thisOffset] = pixels[offset];
            thesePixels.data[thisOffset+1] = pixels.data[offset+1];
            thesePixels.data[thisOffset+2] = pixels.data[offset+2];
            thesePixels.data[thisOffset+3] = pixels.data[offset+3];
        }
    }
    context.putImageData(thesePixels, 0, 0, 0, 0, image.width(), image.height());
    settingsCell.appendChild(foot);
}

export const setupColorInteractions = ()=>{
    const wheel = document.getElementById('wheel');
    const picker = document.getElementById('picker');
    const foregroundColor = document.getElementById('foreground-color');
    const backgroundColor = document.getElementById('background-color');
    const colorSwitch = document.getElementById('color-switch');
    colorSwitch.addEventListener('click', ()=>{
        const foreground = foregroundColor.hex;
        const background = backgroundColor.hex;
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
    return { changeForeground, changeBackground };
};