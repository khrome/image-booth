"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Image = void 0;
var _environmentSafeCanvas = require("environment-safe-canvas");
var _extendedEmitter = require("extended-emitter");
var _arrayEvents = require("array-events");
var engine = _interopRequireWildcard(require("./engine.js"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var registry = {};
var layer;
var convolveBuffer;
class Image {
  constructor(options = {}) {
    this.options = options;
    this.layers = new _arrayEvents.EventedArray([]);
    this.engine = options.engine || engine;
    new _extendedEmitter.Emitter().onto(this);
    this.ready = new Promise(async (resolve, reject) => {
      try {
        const layer = await this.newLayer({
          source: options.source,
          image: options.image,
          width: options.image ? options.image.width : options.width,
          height: options.image ? options.image.height : options.height
        });
        resolve(layer);
      } catch (ex) {
        reject(ex);
      }
    });
  }
  dirty(value = null) {
    try {
      if (value !== null) {
        this.layers.forEach(layer => layer.dirty = value);
        return value;
      }
      const isDirty = this.layers.reduce((agg, layer) => {
        return agg || layer.dirty;
      }, false);
      return isDirty;
    } catch (ex) {
      console.log('ERR', ex);
    }
  }
  async newLayer(options, callback) {
    return this.engine.newLayer(options, newLayer => {
      newLayer.image = this;
      //if there's no passed height, take the height of the created layer
      if (!this.options.height) this.options.height = newLayer.height;
      if (!this.options.width) this.options.width = newLayer.width;
      this.layers.push(newLayer);
      if (!this.currentLayer) this.currentLayer = newLayer;
      this.focusOn(newLayer);
      if (!layer) layer = newLayer; //autofocus, if there isn't one
      if (callback) callback(newLayer);
    });
  }
  removeLayer(layer) {
    if (typeof layer == 'number') this.layers.splice(layer, 1);else this.layers.erase(layer);
  }
  width() {
    //focused layer
    return this.options.width;
  }
  height() {
    //focused layer
    return this.options.height;
  }
  focusOn(layer) {
    //focused layer
    return this.focused = layer;
  }
  composite(type = 'canvas') {
    //todo: cache previous composite and only rerender from changed layer down
    // todo todo: bidirectional composite cache
    //console.log('!!!!', this.layers[0]);
    var result = this.engine.composite(this.layers, this.height(), this.width(), type);
    const info = {};
    info[type] = result;
    this.emit('composite', info);
    return result;
  }
  save(filename, cb) {
    //composite
    return new Promise(async (resolve, reject) => {
      try {
        var canvas = this.composite('canvas');
        await _environmentSafeCanvas.Canvas.save(filename, canvas);
        resolve(canvas);
      } catch (ex) {
        reject(ex);
      }
    });
  }
}
exports.Image = Image;