ImageBooth.js
==============
ImageBooth is a javascript layered image convolution and painting library written on top of the canvas abstraction that runs on the browser or the server and is written in native, browser compatible, ES6 modules.

Usage
-----

In it's simplest form it looks like this:

```javascript
import { Image } from 'image-booth';
(async ()=>{
    //load an image from a remote location
    const image = new Image({ source: 'http://some.web/location' });
    await image.ready; //wait for the remote source to load
    image.currentLayer.act('negative'); //photonegative the image
    await image.save('/some/file/location'); //save the resulting image
})()
```

Supported actions are:

- Operations
    - Negative
    - Brightness/Contrast
- Filters
    - Gaussian Blur
    - Emboss
    - High Pass
    - Laplacian
    - Sharpen
    - Sobel Edge Detector
    
The library also supports paint tools, used with different brushes:
- Paintbrush
- Draw
- Flood Fill
- Sample Color
- Clone

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