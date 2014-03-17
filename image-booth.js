(function (root, factory) {
    var clientCanvas = function(){
        return document.createElement('canvas');
    }
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['array-events'], function(events){
            return factory(events, clientCanvas)
        });
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('array-events'), require('canvas'));
    } else {
        // Browser globals (root is window)
        root.returnExports = factory(root.EventedArray, clientCanvas);
    }
}(this, function(EventedArray, Canvas){
    var registry;
    var layer;
    var convolveBuffer;
    //var convolveBuffer;
    function Image(options){
        options = options || {};
        this.options = options;
        this.layers = new EventedArray([]);
        this.engine = options.engine || engine;
        this.newLayer({
            source : options.source
        }, function(){
            if(options.ready) options.ready();
        });
    }
    Image.prototype.newLayer = function(options, callback){
        var ob = this;
        this.engine.newLayer(options, function(newLayer){
            newLayer.image = ob;
            //if there's no passed height, take the height of the created layer
            if(!ob.options.height) ob.options.height = newLayer.height;
            if(!ob.options.width) ob.options.width = newLayer.width;
            ob.layers.push(newLayer);
            if(!layer) layer = newLayer; //autofocus, if there isn't one
            callback.apply(callback, arguments);
        });
    };
    Image.prototype.removeLayer = function(layer){
        if(typeof layer == 'number') this.layers.splice(layer, 1);
        else this.layers.erase(layer);
    };
    Image.prototype.focused = function(){ //focused layer
        return layer;
    };
    Image.prototype.width = function(){ //focused layer
        return this.options.width;
    };
    Image.prototype.height = function(){ //focused layer
        return this.options.height;
    };
    Image.prototype.focusOn = function(layer){ //focused layer
        return layer;
    };
    Image.prototype.composite = function(){ //focused layer
        //todo: cache previous composite and only rerender from changed layer down
        // todo todo: bidirectional composite cache
        //console.log('!!!!', this.layers[0]);
        var renderedPixels = composite(this.layers);
        this.emit('composite', {
            pixels : renderedPixels
        });
        return renderedPixels;
    };
    
    //emitter
    Image.prototype.on = function(){ return this.layers.on.apply(this.layers, arguments) };
    Image.prototype.off = function(){ return this.layers.off.apply(this.layers, arguments) };
    Image.prototype.once = function(){ return this.layers.once.apply(this.layers, arguments) };
    Image.prototype.emit = function(){ return this.layers.emit.apply(this.layers, arguments) };
    Image.prototype.when = function(){ return this.layers.when.apply(this.layers, arguments) };
    
    Image.prototype.save = function(filename, cb){ //composite
        var pixels = this.composite();
        var buffer = new Canvas(this.height(), this.width());
        console.log('1111', this.height(), this.width());
        buffer.toDataURL('image/png', function(err, dataURL){
            console.log('22222', err);
            if(err) return cb(err);
            var base64 = dataURL.substring(dataURL.indexOf(','));
            var buffer = new Buffer(base64, 'base64');
            console.log('??', buffer);
            fs.writeFile(filename, buffer, function(err){
                cb(err, buffer);
            })
        });
    };
    
    var getImage = function(location, callback){
        var img = new (window.Image || Canvas.Image)();
        img.onload = function(){
            callback(img);
        };
        //TJ did some dumb shit here, let's fix it
        if(typeof module !== 'undefined' && module.exports){
            var src = '';
            var sizeOf = require('image-size');
            var fs = require('fs');
            fs.readFile(location, function(err, data){
                img.src = data;
                //img.src = new Buffer(0);
                /*sizeOf(newValue, function (err, dimensions){
                    img.width = dimensions.width;
                    img.height = dimensions.height;
                    console.log('^^^^', img.width = dimensions.width, img.height, img.width, dimensions.width, dimensions.height);
                    if(img.onload){
                        img.onload.apply(img);
                        delete img.onload;
                    }
                });*/
                console.log('^^^^', err, data, img.height, img.width);
                console.log('^^^^', Object.keys(img));
            });
            /*Object.defineProperty(img, "src", {
                get : function(){
                    return src;
                },
                set : function(newValue){
                    src = newValue;
                    img.src = location;
                    var ob = this; // this == img == ob;
                    fs.readFile(newValue, function(err, data){
                        src = data;
                        sizeOf(newValue, function (err, dimensions){
                            img.width = dimensions.width;
                            img.height = dimensions.height;
                            console.log('^^^^', img.width = dimensions.width, img.height, img.width, dimensions.width, dimensions.height);
                            if(img.onload){
                                img.onload.apply(img);
                                delete img.onload;
                            }
                        });
                    });
                },
                enumerable : true,
                configurable : true
            });*/
        }
        img.src = location;
    }
    var engine = {
        filter : function(layer, options){ // convolve
            if(!options.name) throw new Error('engine not linked to image-booth');
            if(!registry.filters[options.name]) throw new Error('image-booth does not have filter '+options.name);
            if(!layer.isCanvas) throw new Error('attempting to work on a layer generated by another engine');
        },
        brush : function(layer, options){ // paint on a path
            if(!options.name) throw new Error('engine not linked to image-booth');
            if(!registry.brushes[options.name]) throw new Error('image-booth does not have brush '+options.name);
            if(!layer.isCanvas) throw new Error('attempting to work on a layer generated by another engine');
            
        },
        newImage : function(options){ 
            return new Image(options);
        },
        newLayer : function newLayer(options, callback){
            if(typeof options == 'function' && !callback){
                callback = options;
                options = {};
            }
            var buffer = new Canvas();
            var result = {
                filter : function(name, options){
                    if(typeof name == 'object' && !options){
                        options = name;
                        name = options.name;
                    }
                    
                },
                brush : function(name, options){
                    if(typeof name == 'object' && !options){
                        options = name;
                        name = options.name;
                    }
                    
                },
                operate : function(name, options){
                    if(typeof name == 'object' && !options){
                        options = name;
                        name = options.name;
                    }
                    
                },
                tool : function(name, options){
                    if(typeof name == 'object' && !options){
                        options = name;
                        name = options.name;
                    }
                    
                }
            };
            var height;
            var width;
            var img;
            if(options.source){
                return getImage(options.source, function(image){
                    options.img = image;
                    delete options.source;
                    newLayer(options, callback);
                });
            }
            if(options.img || (options.height && options.width)){
                height = options.img?options.img.height:options.height;
                width = options.img?options.img.width:options.width;
            }else throw new Error('The image has no dimensions or progenitor');
            console.log('3333', height, width, options.img.height);
            result.height = height;
            result.width = width;
            result.buffer = new Canvas(height, width);
            result.context2d = result.buffer.getContext('2d');
            if(options.image){
                result.context2d.drawImage(options.image, 0, 0);
                result.pixels = result.context2d.getImageData(width, height);
            }else{
                //clear canvas
                var data = result.context2d.getImageData(0,0, width, height)
                for(var ypos = 0; ypos < height; ypos++){
                    for(xpos = 0; xpos < width; xpos++){
                            pos = ((ypos*(width*4)) + (xpos*4));
                            data.data[pos + 3] = 0;
                    }
                }
                result.pixels = data;
            }
            callback(result);
            //return result;
        },
        operate : function(layer, options){ // custom pixel logic
            if(!options.name) throw new Error('engine not linked to image-booth');
            if(!registry.operations[options.name]) throw new Error('image-booth does not have operation '+options.name);
            if(!layer.isCanvas) throw new Error('attempting to work on a layer generated by another engine');
            
        },
        tool : function(layer, options){ // operate on a path or location
            if(!options.name) throw new Error('engine not linked to image-booth');
            if(!registry.tools[options.name]) throw new Error('image-booth does not have tool '+options.name);
            if(!layer.isCanvas) throw new Error('attempting to work on a layer generated by another engine');
            
        },
        setBooth : function(booth){ // this is the object we find our various filters/brushes/ops/tools on
            registry = booth;
        }
    };
    
    //Graphics Util (merge with engine);
    // convolve(pixels, filter, filter_div, offset);
    // merge(aPixels, bPixels, buffer, mode, opacity);
    var convolve = function(pixels, filter, filter_div, offset){
        if(!convolveBuffer) convolveBuffer = new Canvas();
        if (pixels == null)throw new Error('Tried to convolve nothing!');
        //setup buffer
        convolveBuffer.setProperty('width', pixels.width);
        convolveBuffer.setProperty('height', pixels.height);
        var context = convolveBuffer.getContext('2d');
        var newPixels  = context.getImageData(0,0, pixels.width, pixels.height);
        var sx = pixels.width; //getx
        var sy = pixels.height; //gety
        var new_r, new_g, new_b, new_a, alpha, yv, pxl, new_pxl, kernel_size;
        //kernel_size = filter.length; //coming soon
        for(var y = 0; y < sy; y++){
            for(x = 0; x < sx; x++){
                new_r = new_g = new_b = 0;
                new_a = pixels.data[((y*(sx*4)) + (x*4)) + 3];
                //convolve this pixel to produce this pixel's value
                for(var j = 0; j < filter.length; j++) { //rows
                    yv = Math.min( Math.max(y - 1 + j, 0), sy - 1);
                    for(var i = 0; i < filter[j].length; i++) { //cols
                        pxl = [ Math.min( Math.max(x - 1 + i, 0), sx - 1), yv]; 
                        if(filter[j] && filter[j][i]){
                            new_r += pixels.data[((pxl[1]*(sx*4)) + (pxl[0]*4))    ] * filter[j][i];
                            new_g += pixels.data[((pxl[1]*(sx*4)) + (pxl[0]*4)) + 1] * filter[j][i];
                            new_b += pixels.data[((pxl[1]*(sx*4)) + (pxl[0]*4)) + 2] * filter[j][i];
                        }
                    }
                }
                if ((y >= 0) && (y < sy)) { //y coordinate in range?
                    //
                    new_r = (new_r/filter_div)+offset;
                    new_g = (new_g/filter_div)+offset;
                    new_b = (new_b/filter_div)+offset;
                    //bound 0 .. 255
                    new_r = (new_r > 255)? 255 : ((new_r < 0)? 0:new_r); 
                    new_g = (new_g > 255)? 255 : ((new_g < 0)? 0:new_g);
                    new_b = (new_b > 255)? 255 : ((new_b < 0)? 0:new_b);
                    //copy the altered values for this pixel into the buffer we created
                    newPixels.data[((y*(sx*4)) + (x*4))    ] += new_r;
                    newPixels.data[((y*(sx*4)) + (x*4)) + 1] += new_g;
                    newPixels.data[((y*(sx*4)) + (x*4)) + 2] += new_b;
                    newPixels.data[((y*(sx*4)) + (x*4)) + 3] += new_a;
                }
            }
        }
        // return the buffer
        return newPixels;
    }
    var merge = function(aPixels, bPixels, buffer, mode, opacity){ //src == image
        if(!convolveBuffer) convolveBuffer = new Canvas();
        //for clarity's sake, we are layering layer a over layer b
        if (aPixels == null || bPixels == null) throw new Error('Tried to convolve nothing!');
        if(aPixels.height != bPixels.height || aPixels.width != bPixels.width){
            throw new Error('Mismatched pixel sizes: '+aPixels.length+' vs '+bPixels.length);
        }
        if(mode == null) mode = 'overlay';
        //setup buffer
        var newPixels;
        if(!buffer || buffer == null){
            //convolveBuffer.setProperty('width', aPixels.width);
            //convolveBuffer.setProperty('height', aPixels.height);
            convolveBuffer.width = aPixels.width;
            convolveBuffer.height = aPixels.height;
            var context = convolveBuffer.getContext('2d');
            newPixels  = context.getImageData(0,0, aPixels.width, aPixels.height);
        }else{
            newPixels = buffer.getImageData(0,0, aPixels.width, aPixels.height);
        }
        var sx = aPixels.width; //getx
        var sy = aPixels.height; //gety
        switch(mode){
            case 'average':
                
                break;
            case 'lighten':
                for(var y = 0; y < sy; y++){
                    for(x = 0; x < sx; x++){
                        newPixels.data[((y*(sx*4)) + (x*4))     ] = Math.max(
                            aPixels.data[((y*(sx*4)) + (x*4))     ],
                            bPixels.data[((y*(sx*4)) + (x*4))     ]
                        );
                        newPixels.data[((y*(sx*4)) + (x*4)) + 1 ] = Math.max(
                            aPixels.data[((y*(sx*4)) + (x*4)) + 1 ],
                            bPixels.data[((y*(sx*4)) + (x*4)) + 1 ]
                        );
                        newPixels.data[((y*(sx*4)) + (x*4)) + 2 ] = Math.max(
                            aPixels.data[((y*(sx*4)) + (x*4)) + 2 ],
                            bPixels.data[((y*(sx*4)) + (x*4)) + 2 ]
                        );
                        newPixels.data[((y*(sx*4)) + (x*4)) + 3 ] = Math.max(
                            aPixels.data[((y*(sx*4)) + (x*4)) + 3 ],
                            bPixels.data[((y*(sx*4)) + (x*4)) + 3 ]
                        );
                    }
                }
                break;
            case 'darken':
                for(var y = 0; y < sy; y++){
                    for(x = 0; x < sx; x++){
                        newPixels.data[((y*(sx*4)) + (x*4))     ] = Math.min(
                            aPixels.data[((y*(sx*4)) + (x*4))     ],
                            bPixels.data[((y*(sx*4)) + (x*4))     ]
                        );
                        newPixels.data[((y*(sx*4)) + (x*4)) + 1 ] = Math.min(
                            aPixels.data[((y*(sx*4)) + (x*4)) + 1 ],
                            bPixels.data[((y*(sx*4)) + (x*4)) + 1 ]
                        );
                        newPixels.data[((y*(sx*4)) + (x*4)) + 2 ] = Math.min(
                            aPixels.data[((y*(sx*4)) + (x*4)) + 2 ],
                            bPixels.data[((y*(sx*4)) + (x*4)) + 2 ]
                        );
                        newPixels.data[((y*(sx*4)) + (x*4)) + 3 ] = Math.min(
                            aPixels.data[((y*(sx*4)) + (x*4)) + 3 ],
                            bPixels.data[((y*(sx*4)) + (x*4)) + 3 ]
                        );
                    }
                }
                break;
            case 'overlay':
                var index, a_alpha, b_alpha;
                for(var y = 0; y < sy; y++){
                    for(x = 0; x < sx; x++){
                        index = ((y*(sx*4)) + (x*4));
                        a_alpha = aPixels.data[index  + 3];
                        if(a_alpha == 0){
                            newPixels.data[index    ] =  bPixels.data[index     ];
                            newPixels.data[index + 1 ] = bPixels.data[index + 1 ];
                            newPixels.data[index + 2 ] = bPixels.data[index + 2 ];
                            newPixels.data[index + 3 ] = bPixels.data[index + 3 ];
                        }else if (a_alpha == 255){
                            newPixels.data[index    ] =  aPixels.data[index     ];
                            newPixels.data[index + 1 ] = aPixels.data[index + 1 ];
                            newPixels.data[index + 2 ] = aPixels.data[index + 2 ];
                            newPixels.data[index + 3 ] = a_alpha;
                        }else{
                            //technically b should be a composite, and not use additive 
                            var a_combine_amount = a_alpha/255;
                            var b_combine_amount = (255-a_alpha)/255;
                            var b_alpha = bPixels.data[index  + 3];
                            newPixels.data[index    ] = 
                                (aPixels.data[index     ] * a_combine_amount) 
                                + (bPixels.data[index     ] * b_combine_amount)
                            ;
                            newPixels.data[index + 1 ] = 
                                (aPixels.data[index + 1 ] * a_combine_amount) 
                                + (bPixels.data[index + 1 ] * b_combine_amount)
                            ;
                            newPixels.data[index + 2 ] = 
                                (aPixels.data[index + 2 ] * a_combine_amount) 
                                + (bPixels.data[index + 2 ] * b_combine_amount)
                            ;
                            newPixels.data[index + 3 ] = Math.max(a_alpha, b_alpha);
                        }
                    }
                }
                break;
        }
        (buffer || convolveBuffer.getContext('2d')).putImageData(newPixels, 0, 0);
        return newPixels;
    }
    var dump = function(buffer, x, y){
        var data = '';
        var pos;
        for(var ypos = 0; ypos < y; ypos++){
            for(xpos = 0; xpos < x; xpos++){
                pos = ((ypos*(x*4)) + (xpos*4));
                data  += 
                    buffer.data[pos    ].toString(16).toUpperCase() +
                    buffer.data[pos + 1].toString(16).toUpperCase() +
                    buffer.data[pos + 2].toString(16).toUpperCase() +
                    buffer.data[pos + 3].toString(16).toUpperCase();
            }
            data += '\n';
        }
        return data;
    }
    var composite = function(layers, returnType){
        // todo: top down opacity mask so opaque pixels aren't calculated below the level they achieve 100% opacity
        // (maybe hard to integrate with a bidirectional buffer)
        var height = layers[0].image.height();
        var width = layers[0].image.width();
        var buffer = new Canvas(height, width);
        var context = buffer.getContext('2d');
        var pixels = context.getImageData(0,0, width, height);
        layers.forEach(function(layer){
            if(!layer.pixels) throw new Error('this layer has no pixels');
            pixels = merge(pixels, layer.pixels);
        });
        if(returnType === 'pixels' || returnType === undefined) return pixels;
        context.putImageData(pixels);
        if(returnType === 'canvas') return buffer;
        if(returnType === 'context' || returnType === 'context2d') return buffer;
    }
    return {
        newImage : function(options){
            return new Image(options);
        } 
    };
}));