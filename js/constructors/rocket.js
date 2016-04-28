var smallExplosion = require('../smallExplosion.js');
var rockets = require('../objectArrays.js').rockets;

var Rocket = function (x, y, degrees, power, idx) {
  this.x = x;
  this.y = y;
  this.type = "rocket";
  this.sprite = "3_rocket";
  this.yaccel = 0.25;
  this.idx = idx;
  this.degrees = degrees;
  this.power = power;
  this.xspeed = this.power * Math.cos((this.degrees)*DEGREES);
  this.yspeed = this.power * Math.sin((this.degrees)*DEGREES);
  this.destroy = function () {
    rockets[idx] = undefined;
    smallExplosion(this);
  };
};

Rocket.prototype.destroy = function () {

};

module.exports = Rocket;
