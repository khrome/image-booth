"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Negative = void 0;
var _environmentSafeCanvas = require("environment-safe-canvas");
var _operation = require("../operation.cjs");
class Negative extends _operation.Operation {
  constructor(name = 'negative', engine) {
    super(name || 'negative', engine);
  }
  operate(pixels, controls) {
    const mergeBuffer = new _environmentSafeCanvas.Canvas({
      width: pixels.width,
      height: pixels.height
    });
    const context = mergeBuffer.getContext('2d', {
      willReadFrequently: true
    });
    var newPixels = context.getImageData(0, 0, pixels.width, pixels.height);
    var sx = pixels.width; //getx
    var sy = pixels.height; //gety
    var y, x;
    for (y = 0; y < sy; y++) {
      for (x = 0; x < sx; x++) {
        newPixels.data[y * (sx * 4) + x * 4] = 255 - pixels.data[y * (sx * 4) + x * 4];
        newPixels.data[y * (sx * 4) + x * 4 + 1] = 255 - pixels.data[y * (sx * 4) + x * 4 + 1];
        newPixels.data[y * (sx * 4) + x * 4 + 2] = 255 - pixels.data[y * (sx * 4) + x * 4 + 2];
        newPixels.data[y * (sx * 4) + x * 4 + 3] = pixels.data[y * (sx * 4) + x * 4 + 3];
      }
    }
    return newPixels;
  }
  getControls() {
    return {};
  }
}
exports.Negative = Negative;
;