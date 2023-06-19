"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Emboss = void 0;
var _filter = require("../filter.js");
class Emboss extends _filter.Filter {
  constructor(name = 'emboss', engine) {
    super(name || 'emboss', engine);
  }
  emboss_a_matrix = [[2.0, 0.0, 0.0], [0.0, -1.0, 0.0], [0.0, 0.0, -1.0]];
  emboss_b_matrix = [[0.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, -1.0]];
  filter(pixels, controls) {
    if (controls.type == 'a') return this.convolve(pixels, this.emboss_a_matrix, controls.amount, controls.threshold);
    if (controls.type == 'b') return this.convolve(pixels, this.emboss_b_matrix, controls.amount, controls.threshold);
    return pixels;
  }
  getControls() {
    return {
      'type': {
        'value': 'a',
        'default': 'a',
        'options': 'a,b'
      },
      'amount': {
        'value': '2',
        'default': '2',
        'upper_bound': '20',
        'lower_bound': '0'
      },
      'threshold': {
        'value': '5',
        'default': '5',
        'upper_bound': '10',
        'lower_bound': '0'
      }
    };
  }
}
exports.Emboss = Emboss;
;