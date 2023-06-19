"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tool = void 0;
class Tool {
  constructor(name, engine) {
    this.internalName = name;
    this.engine = engine;
  }
  name() {
    return this.internalName;
  }
  paint(layer, x, y, brush, controls) {
    throw new Error('.paint() must be implemented in the tool class');
  }
  stroke(layer, x, y, x2, y2, brush, controls = {}) {
    const distanceBetweenPoints = controls.spacing || 3;
    const diffX = x2 - x;
    const diffY = y2 - y;
    const distance = Math.sqrt(diffX * diffX + diffY * diffY);
    const numPoints = Math.ceil(distance / distanceBetweenPoints);
    const xAdjust = (x2 - x) / numPoints;
    const yAdjust = (y2 - y) / numPoints;
    let lcv = 0;
    let thisX, thisY;
    for (; lcv <= numPoints; lcv++) {
      thisX = x + lcv * xAdjust;
      thisY = y + lcv * yAdjust;
      this.paint(layer, thisX, thisY, brush, controls);
    }
    return layer;
  }
  getControls() {
    return {};
  }
  getLabel() {
    return this.name().split('-').map(str => str.substring(0, 1).toUpperCase() + str.substring(1)).join(' ');
  }
}
exports.Tool = Tool;
;