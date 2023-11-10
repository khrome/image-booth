ImageBooth.js
==============
[ ![image](https://raw.githubusercontent.com/khrome/image-booth/master/test/images/image-booth-screenshot.png) ](https://khrome.github.io/image-booth/)

ImageBooth is a javascript [raster graphics](https://en.wikipedia.org/wiki/Raster_graphics_editor) [layered](https://en.wikipedia.org/wiki/Layers_(digital_image_editing)) [image convolution](https://en.wikipedia.org/wiki/Kernel_(image_processing)#Convolution) and [painting](https://en.wikipedia.org/wiki/Image_editing) library written on top of the canvas abstraction that runs on the browser or the server and is written in native, browser compatible, ES6 modules. For compatibility (I'm looking at you, electron) they are also available as a commonjs module, built in `/dist`.

The ultimate goal is being able to open [PSDs](https://www.adobe.com/devnet-apps/photoshop/fileformatashtml/) and run [actions](https://helpx.adobe.com/photoshop/using/actions-actions-panel.html), in addition to basic editing needs for both server and client use cases.

Usage
-----

In it's simplest form it looks like this:

```javascript
import { Image } from 'image-booth';
// or: const { Image } = require('image-booth');
(async ()=>{
    // load an image from a remote location
    const image = new Image({ source: 'http://some.web/location' });
    await image.ready; //wait for the remote source to load
    image.currentLayer.act('negative'); //photonegative the image
    await image.save('/some/file/location'); //save the resulting image
})()
```

Supported actions are:

- Operations
    - Negative - Take the [photonegative](https://en.wikipedia.org/wiki/Negative_(photography)) of the image.
    - Brightness/Contrast - Adjust the relative [brightness](https://en.wikipedia.org/wiki/Brightness) and [contrast](https://en.wikipedia.org/wiki/Contrast_(vision)) of the image
- Filters
    - Gaussian Blur - [smoothing](https://en.wikipedia.org/wiki/Gaussian_blur) the image using a gaussian function
    - Emboss - A false [relief effect](https://en.wikipedia.org/wiki/Image_embossing).
    - High Pass - A [high Pass filter](https://en.wikipedia.org/wiki/High-pass_filter) to manipulate noise in an image.
    - Laplacian - The [spatial derivative of the image](https://en.wikipedia.org/wiki/Discrete_Laplace_operator)
    - Sharpen - Uses a kernel to [sharpen the original image](https://en.wikipedia.org/wiki/Unsharp_masking)
    - Sobel Edge Detector - Uses the [sobel operator](https://en.wikipedia.org/wiki/Sobel_operator) to highlight "edges" within the image
- Generators
    - Noise - Allows you to generate [Simplex Noise](https://en.wikipedia.org/wiki/Simplex_noise) and [Perlin Noise](https://en.wikipedia.org/wiki/Perlin_noise)
    - Tiny Texture Tumbler - Uses [TTT](https://phoboslab.org/ttt/#W1szMiwzMiwxMzEzNSwwLDEsMSwzMCwzMCw2NTUyOCw4LDEzMTM1LDIsNTI0MTksMSwyLDUsMl0sWzMyLDMyLDEzMTM1LDEsMiwyLDQsNCw4LDgsNjU1MjQsNSw4NDU4LDQsMCwwLDAsMzIsMzIsNV1d) to [generate progressive textures](https://phoboslab.org/log/2021/09/q1k3-making-of) and adds a `$HEIGHT` and `$WIDTH` value to allow you to easily fill the canvas.
    
The library also supports paint tools, used with different brushes:
- Paintbrush - A [digital painting](https://en.wikipedia.org/wiki/Digital_painting) brush that supports a variety of brushes 
- Draw - A simple single pixel line drawing tool.
- Flood Fill - A [paintbucket](https://en.wikipedia.org/wiki/Flood_fill) operation.
- Sample Color - An [eyedropper](https://en.wikipedia.org/wiki/Color_picker#Eyedropper) tool for sampling colors within the image.
- Clone - [Clone](https://en.wikipedia.org/wiki/Image_editing#Stamp_Clone_Tool) from one part of your image to another.

Testing
-------

Roadmap
-------
- [ ] - headless browser testing
- [ ] - expose compositors
- [ ] - expose tool options
- [ ] - selection model
- [ ] - non-destructive move operation
- [ ] - convolve brush
- [ ] - masks
- [ ] - channel masks
- [ ] - plugins
- [ ] - intelligent scissors
- [ ] - sprite brush
- [ ] - dynamic media
- [ ] - tablet support
- [ ] - text layers (fabric.js?)
- [ ] - shape layers (fabric.js?)
- [ ] - vector file import (svg, pdf, eps, etc)

Testing
-------

Run the tests headless.
```bash
npm run test
```
to run the same test inside the browser:

```bash
npm run browser-test
```
to run the same test headless inside docker:

```bash
npm run container-test
```