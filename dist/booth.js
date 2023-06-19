"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Booth = void 0;
var _environmentSafeCanvas = require("environment-safe-canvas");
var _image = require("./image.js");
var _filter = require("./filter.js");
var _action = require("./action.js");
var _tool = require("./tool.js");
var _brush = require("./brush.js");
var _blur = require("./filters/blur.js");
var _emboss = require("./filters/emboss.js");
var _laplacian = require("./filters/laplacian.js");
var _sharpen = require("./filters/sharpen.js");
var _highPass = require("./filters/high-pass.js");
var _sobel = require("./filters/sobel.js");
var _brightnessContrast = require("./operations/brightness-contrast.js");
var _negative = require("./operations/negative.js");
var _paintbrush = require("./tools/paintbrush.js");
var _draw = require("./tools/draw.js");
var _sampleColor = require("./tools/sample-color.js");
var _floodFill = require("./tools/flood-fill.js");
var _clone = require("./tools/clone.js");
var _pxRound = require("./brushes/5px-round.js");
var _pxRound2 = require("./brushes/3px-round.js");
var _pxSquare = require("./brushes/1px-square.js");
var _pxSquare2 = require("./brushes/5px-square.js");
var _pxScatter = require("./brushes/10px-scatter.js");
var _pxSoftRound = require("./brushes/5px-soft-round.js");
var _pxSoftRound2 = require("./brushes/10px-soft-round.js");
var _pxSoftRound3 = require("./brushes/15px-soft-round.js");
var _pxSoftRound4 = require("./brushes/20px-soft-round.js");
var _pxSoftRound5 = require("./brushes/40px-soft-round.js");
var _tinyTextureTumbler = require("./generators/tiny-texture-tumbler.js");
var _noise = require("./generators/noise.js");
var defaultEngine = _interopRequireWildcard(require("./engine.js"));
var _extendedEmitter = require("extended-emitter");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
//core

//actions

//tools

//brushes

//generators

const metalist = ['Shift', 'Control', 'Alt', 'Meta'];
class Booth {
  constructor(engine) {
    this.engine = engine;
    this.toDump = [];
    this.registry = {};
    this.tools = {};
    this.brushes = {};
    this.currentTool = null;
    this.currentBrush = null;
    this.cloneMeta = {};
    new _extendedEmitter.Emitter().onto(this);
  }
  working(value) {
    const el = document.getElementById('working');
    if (value) {
      el.style.display = 'block';
    } else {
      el.style.display = 'none';
    }
  }
  setForeground(color) {
    this.foreground = color;
    this.emit('set-foreground', color);
  }
  setBackground(color) {
    this.background = color;
    this.emit('set-background', color);
  }
  bind(canvas, image, resolution = 100) {
    canvas.width = image.width();
    canvas.height = image.height();
    canvas.setAttribute('style', "cursor : url('./icon/Precision.cur'), crosshair");
    let framelock;
    const getFrame = handler => {
      if (!framelock) {
        framelock = true;
        requestAnimationFrame(() => {
          framelock = false;
          handler();
        });
      }
    };
    const interval = setInterval(() => {
      let dirty = null;
      getFrame(() => {
        dirty = image.dirty();
        if (dirty) {
          const context = canvas.getContext('2d', {
            willReadFrequently: true
          });
          const pixels = image.composite('pixels');
          context.putImageData(pixels, 0, 0, 0, 0, pixels.width, pixels.height);
          image.dirty(false);
        }
      });
    }, resolution);
    const context = canvas.getContext('2d', {
      willReadFrequently: true
    });
    const pixels = image.composite('pixels');
    context.putImageData(pixels, 0, 0, 0, 0, image.width(), image.height());
  }
  enableDraw(canvas, image) {
    this.meta = {};
    window.addEventListener('keydown', event => {
      const metaIndex = metalist.indexOf(event.code.replace('Left', '').replace('Right', ''));
      if (metaIndex !== -1) {
        this.meta[metalist[metaIndex].toLowerCase()] = true;
      }
    });
    window.addEventListener('keyup', event => {
      const metaIndex = metalist.indexOf(event.code.replace('Left', '').replace('Right', ''));
      if (metaIndex !== -1) {
        this.meta[metalist[metaIndex].toLowerCase()] = false;
      }
    });
    var drawing = false;
    const drawPoint = event => {
      if (this.currentTool && this.currentBrush && drawing && image.focused) {
        const rect = canvas.getBoundingClientRect();
        const x = event.x - rect.left;
        const y = event.y - rect.top;
        const brush = this.currentBrush.kernel({});
        setTimeout(() => {
          //detach from event
          this.currentTool.paint(image.focused.pixels, x, y, brush, {
            foreground: this.foreground,
            background: this.background,
            cloneMeta: this.cloneMeta
            //background: this.background,
          });

          image.currentLayer.context2d.putImageData(image.focused.pixels, 0, 0);
          image.currentLayer.dirty = true;
          //image.currentLayer.alteredSinceLastPreview = true;
          //image.currentLayer.parentImage.repaint();
        });
      }
    };

    canvas.addEventListener('mousedown', () => {
      drawing = true;
      drawPoint(event);
    });
    canvas.addEventListener('mouseup', () => {
      drawing = false;
    });
    canvas.addEventListener('mousemove', event => {
      drawPoint(event);
    });
    this.bind(canvas, image, 5);
  }
  register(ob) {
    let callable = ob.getLabel().split(' ').join('');
    callable = callable.substring(0, 1).toLowerCase() + callable.substring(1);
    if (this[callable]) throw new Error(`${callable} is a reserved symbol`);
    if (ob instanceof _action.Action) {
      this.registry[ob.name()] = ob;
      this[callable] = (pixels, controls) => this[callable].act(pixels, controls);
    }
    if (ob instanceof _tool.Tool) {
      this.tools[ob.name()] = ob;
      //if(!this.currentTool) this.currentTool = ob;
      this[callable] = (pixels, shape, controls) => this[callable].stroke(pixels, controls);
    }
    if (ob instanceof _brush.Brush) {
      this.brushes[ob.name()] = ob;
      //if(!this.currentBrush) this.currentBrush = ob;
    }
  }

  use(classDef) {
    const instance = new classDef(null, this.engine);
    this.register(instance);
  }
  newImage(options) {
    const image = new _image.Image(options);
    return image;
  }
  async save(location, ob) {
    if (ob.data && ob.height && ob.width) {
      //imageData
      const canvas = new _environmentSafeCanvas.Canvas({
        height: ob.height,
        width: ob.width
      });
      const context = canvas.getContext('2d', {
        willReadFrequently: true
      });
      context.putImageData(ob, 0, 0, 0, 0, ob.width, ob.height);
      await _environmentSafeCanvas.Canvas.save(location, canvas);
    }
    if (ob.getContext) {
      //canvas
      await _environmentSafeCanvas.Canvas.save(location, ob);
    }
  }
  dump(id, ob) {
    this.toDump.push({
      id,
      ob
    });
  }
  async flush() {
    let lcv = 0;
    for (; lcv < this.toDump.length; lcv++) {
      if (this.toDump[lcv].ob) {
        if (this.toDump[lcv].ob.data) console.log('WRITING', Array.prototype.filter.call(this.toDump[lcv].ob.data, value => !(value === 0 || value === 255)));
      }
      await this.save(this.toDump[lcv].id + '.png', this.toDump[lcv].ob);
    }
  }
}

//make the default a kitchen sink booth
exports.Booth = Booth;
const booth = new Booth(defaultEngine);
var _default = booth; //Filters
exports.default = _default;
booth.use(_blur.GaussianBlur);
booth.use(_emboss.Emboss);
booth.use(_laplacian.Laplacian);
booth.use(_sharpen.Sharpen);
booth.use(_highPass.HighPass);
booth.use(_sobel.Sobel);

//Operations
booth.use(_brightnessContrast.BrightnessContrast);
booth.use(_negative.Negative);

//Tools
booth.use(_paintbrush.Paintbrush);
booth.use(_draw.Draw);
booth.use(_clone.Clone);
booth.use(_sampleColor.SampleColor);
booth.use(_floodFill.FloodFill);

//Brushes
booth.use(_pxSquare.Square1px);
booth.use(_pxSquare2.Square5px);
booth.use(_pxRound2.Round3px);
booth.use(_pxRound.Round5px);
booth.use(_pxScatter.Scatter10px);
booth.use(_pxSoftRound.SoftRound5px);
booth.use(_pxSoftRound2.SoftRound10px);
booth.use(_pxSoftRound3.SoftRound15px);
booth.use(_pxSoftRound4.SoftRound20px);
booth.use(_pxSoftRound5.SoftRound40px);

//Generators
booth.use(_tinyTextureTumbler.TinyTextureTumbler);
booth.use(_noise.Noise);