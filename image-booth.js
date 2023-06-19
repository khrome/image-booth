const { Booth, default: boothDefault } = require('./dist/booth.js');
const { Image } = require('./dist/image.js');
module.exports = { Image, Booth };
module.exports.default = boothDefault;