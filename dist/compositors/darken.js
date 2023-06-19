"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.darken = void 0;
const darken = (aPixels, bPixels, newPixels) => {
  var sx = aPixels.width; //getx
  var sy = aPixels.height; //gety
  for (var y = 0; y < sy; y++) {
    for (x = 0; x < sx; x++) {
      newPixels.data[y * (sx * 4) + x * 4] = Math.min(aPixels.data[y * (sx * 4) + x * 4], bPixels.data[y * (sx * 4) + x * 4]);
      newPixels.data[y * (sx * 4) + x * 4 + 1] = Math.min(aPixels.data[y * (sx * 4) + x * 4 + 1], bPixels.data[y * (sx * 4) + x * 4 + 1]);
      newPixels.data[y * (sx * 4) + x * 4 + 2] = Math.min(aPixels.data[y * (sx * 4) + x * 4 + 2], bPixels.data[y * (sx * 4) + x * 4 + 2]);
      newPixels.data[y * (sx * 4) + x * 4 + 3] = Math.min(aPixels.data[y * (sx * 4) + x * 4 + 3], bPixels.data[y * (sx * 4) + x * 4 + 3]);
    }
  }
};
exports.darken = darken;