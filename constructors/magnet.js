var Rocket = require('./rocket.js');

var Surrogate = function () {};
Surrogate.prototype = Rocket.prototype;

var Magnet = function (x, y, degrees, power, idx) {
  Rocket.call(this, x, y, degrees, power, idx);
  this.type = "magnet";
  this.sprite = "3_magnet";
};

Magnet.prototype = new Surrogate();

module.exports = Magnet;
