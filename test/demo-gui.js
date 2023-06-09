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
    layout.innerHTML = '<tr><td style="width:350px; padding: 10px"><canvas id="preview" style="height:350px; width:350px" height="350" width="350"></td><td style="padding: 10px"><wired-card id="settingsCell" elevation="2"></wired-card></td>';
    container.appendChild(layout);
    const imageContext = image.composite('context');
    const canvasEl = document.getElementById('preview');
    const screen = document.getElementById('screen');
    const spinner = document.getElementById('filterSpinner');
    const context = canvasEl.getContext('2d', { willReadFrequently: true });
    const getValues = ()=>{
        const results = {};
        Object.keys(controls).forEach((key)=>{
            results[key] = document.getElementById(`value-${key}`)?
            document.getElementById(`value-${key}`).innerText:
            document.getElementById(`control-${key}`).value;
            if(results[key].value) results[key] = results[key].value;
            if(
                typeof results[key] === 'string' && 
                results[key] === `${parseInt(results[key])}`
            ) results[key] = parseInt(results[key]);
            if(
                typeof results[key] === 'string' && 
                results[key] === `${parseFloat(results[key])}`
            ) results[key] = parseFloat(results[key]);
            if(
                typeof results[key] === 'string' && 
                controls[key].json
            ){
                results[key] = results[key].replace(/\$WIDTH/g, image.width()).replace(/\$HEIGHT/g, image.height());
                console.log('REPLACED', results[key])
                results[key] = JSON.parse(
                    results[key]
                );
            }
        });
        return results;
    }
    let previewPixels = null;
    const applyFilterToPreview = ()=>{
        spinner.style.display = 'block';
        spinner.setAttribute('spinning', true);
        setTimeout(()=>{
            if(!previewPixels) previewPixels = context.getImageData(0, 0, canvasEl.width, canvasEl.height);
            const controls = getValues();
            const newPixels = action.act(previewPixels, controls);
            context.putImageData(newPixels, 0, 0, 0, 0, canvasEl.width, canvasEl.height);
            setTimeout(()=>{
                spinner.removeAttribute('spinning');
                spinner.style.display = 'none';
            }, 100);
        }, 100);
    }
    const applyFilterToImage = ()=>{
        spinner.style.display = 'block';
        spinner.setAttribute('spinning', true);
        setTimeout(()=>{
            const controls = getValues();
            image.currentLayer.act(action.name(), controls);
        }, 100);
    }
    const settingsCell = document.getElementById('settingsCell');
    const settings = document.createElement('table');
    settings.setAttribute('style', 'width:100%; height: 320px')
    let row, elementText, control;
    let labelEl, controlEl;
    row = document.createElement('tr');
    row.innerHTML = `<td colspan="2" style="vertical-align:top"><label class="title" style="font-size:2em; font-weight:800">${label}</label></td>`;
    settings.appendChild(row);
    settingsCell.appendChild(settings);
    Object.keys(controls).forEach((key)=>{
        row = document.createElement('tr');
        control = controls[key];
        elementText = '';
        let post = ()=>{}
        if(control.upper_bound && control.lower_bound){
            elementText = `<div style="display:block; position:absolute; margin-left:-10px; margin-top:10px;" id="value-${key}">${control.value || control.default}</div><wired-slider id="control-${key}" value="${control.value || control.default}" min="${control.lower_bound}" max="${control.upper_bound}"></wired-slider>`;
            post = (controlEl, valueEl)=>{
                controlEl.addEventListener('change', (event)=>{
                    if(event.detail.value !== Math.floor(event.detail.value)){
                        controlEl.value = Math.floor(event.detail.value);
                        valueEl.innerText = controlEl.value;
                    }
                    setTimeout(()=>{
                        applyFilterToPreview();
                    });
                });
            }
        }
        if(control.options){
            if(typeof control.options === 'string') control.options = control.options.split(',');
            elementText = `<wired-combo id="control-${key}" style="font-size: 0.7em">${control.options.map((option)=>{
                return `<wired-item ${control.value === option?'selected':''} value="${option}">${option}</wired-item>`
            }).join('')}</wired-combo>`;
            post = (controlEl, valueEl)=>{
                controlEl.addEventListener('selected', (event)=>{
                    setTimeout(()=>{
                        applyFilterToPreview();
                    });
                });
            }
        }
        if(control.json){
            elementText = `<wired-textarea id="control-${key}" style="font-size: 0.7em">${control.value}</wired-textarea>`;
            post = (controlEl, valueEl)=>{
                controlEl.addEventListener('blur', (event)=>{
                    setTimeout(()=>{
                        applyFilterToPreview();
                    });
                });
            }
        }
        row.innerHTML = `<td><label style="margin-right:10px">${key}</label></td><td>${elementText}</td>`
        settings.appendChild(row);
        const controlEl = document.getElementById(`control-${key}`);
        const valueEl = document.getElementById(`value-${key}`);
        post(controlEl, valueEl);
    });
    const foot = document.createElement('div');
    foot.setAttribute('style', 'width:100%; text-align:right')
    foot.innerHTML = `
        <wired-button id="cancelFilter">${'Cancel'}</wired-button>
        <wired-button elevation="3" id="applyFilter">${'Apply'}</wired-button>
    `;
    const marginHorizontal =  Math.floor((image.width() - canvasEl.width)/2);
    const marginVertical =  Math.floor((image.height() - canvasEl.height)/2);
    const thesePixels = imageContext.getImageData(marginHorizontal, marginVertical, canvasEl.width, canvasEl.height);
    context.putImageData(thesePixels, 0, 0, 0, 0, image.width(), image.height());
    settingsCell.appendChild(foot);
    const cancelFilter = document.getElementById('cancelFilter');
    const applyFilter = document.getElementById('applyFilter');
    cancelFilter.addEventListener('click', ()=>{
        const filterWindow = document.getElementById('window2');
        filterWindow.setAttribute('style', 'position:fixed; display:none');
        screen.style.display = 'none';
        //filterWindow.removeAttribute('open');
    })
    applyFilter.addEventListener('click', ()=>{
        const filterWindow = document.getElementById('window2');
        filterWindow.setAttribute('style', 'display:none');
        screen.style.display = 'none';
        applyFilterToImage();
    })
    settings.addEventListener('mousedown', (event)=>{
        event.stopPropagation();
        //event.preventDefault();
        return false;
    });
    setTimeout(()=>{
        applyFilterToPreview();
    });
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