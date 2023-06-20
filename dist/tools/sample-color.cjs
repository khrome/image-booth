"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SampleColor = void 0;
var _tool = require("../tool.cjs");
var _booth = _interopRequireDefault(require("../booth.cjs"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var rgb2hex = function rgb2hex(red, green, blue) {
  var alpha = '1';
  var rgb = (blue | green << 8 | red << 16 | 1 << 24).toString(16).slice(1);

  // parse alpha value into float
  if (alpha.substr(0, 1) === '.') {
    alpha = parseFloat('0' + alpha);
  }

  // cut alpha value after 2 digits after comma
  alpha = parseFloat(Math.round(alpha * 100)) / 100;
  return '#' + rgb.toString(16);
};
class SampleColor extends _tool.Tool {
  constructor(name = 'sample-color', engine) {
    super(name || 'sample-color', engine);
  }
  paint(pixels, x, y, brush, controls) {
    var pos = y * (pixels.width * 4) + x * 4;
    _booth.default.setForeground(rgb2hex(pixels.data[pos], pixels.data[pos + 1], pixels.data[pos + 2]));
    return pixels;
  }
}
exports.SampleColor = SampleColor;
;