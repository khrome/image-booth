const { Booth, default: boothDefault } = require('./dist/booth.cjs');
const { Image } = require('./dist/image.cjs');
module.exports = { Image, Booth };
module.exports.default = boothDefault;