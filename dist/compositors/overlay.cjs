"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.overlay = void 0;
var _booth = _interopRequireDefault(require("../booth.cjs"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
let count = 0;
const overlay = (aPixels, bPixels, newPixels) => {
  var sx = aPixels.width; //getx
  var sy = aPixels.height; //gety
  var index, a_alpha, b_alpha;
  var x;
  for (var y = 0; y < sy; y++) {
    for (x = 0; x < sx; x++) {
      index = y * (sx * 4) + x * 4;
      a_alpha = aPixels.data[index + 3];
      if (a_alpha == 0) {
        newPixels.data[index] = bPixels.data[index];
        newPixels.data[index + 1] = bPixels.data[index + 1];
        newPixels.data[index + 2] = bPixels.data[index + 2];
        newPixels.data[index + 3] = bPixels.data[index + 3];
      } else if (a_alpha == 255) {
        newPixels.data[index] = aPixels.data[index];
        newPixels.data[index + 1] = aPixels.data[index + 1];
        newPixels.data[index + 2] = aPixels.data[index + 2];
        newPixels.data[index + 3] = a_alpha;
      } else {
        //technically b should be a composite, and not use additive 
        var a_combine_amount = a_alpha / 255;
        var b_combine_amount = (255 - a_alpha) / 255;
        var b_alpha = bPixels.data[index + 3];
        newPixels.data[index] = aPixels.data[index] * a_combine_amount + bPixels.data[index] * b_combine_amount;
        newPixels.data[index + 1] = aPixels.data[index + 1] * a_combine_amount + bPixels.data[index + 1] * b_combine_amount;
        newPixels.data[index + 2] = aPixels.data[index + 2] * a_combine_amount + bPixels.data[index + 2] * b_combine_amount;
        newPixels.data[index + 3] = Math.max(a_alpha, b_alpha);
      }
    }
  }
};
exports.overlay = overlay;