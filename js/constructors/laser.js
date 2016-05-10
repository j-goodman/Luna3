var Rocket = require('./rocket.js');
var missiles = require('../objectArrays').missiles;

var Surrogate = function () {};
Surrogate.prototype = Rocket.prototype;

var Laser = function (x, y, degrees, power, idx) {
  Rocket.call(this, x, y, degrees, power, idx);
  this.type = "laser";
  this.sprite = "3_laser";
  this.target = null;
  this.checkLaser = function () {
    missiles.forEach(function (missile, idx) {
      if (missile) {
        if ((missile.x > this.x-130 && missile.x < this.x+130) &&
        (missile.y > this.y-130 && missile.y < this.y+130)) {
          this.fireLaser(missile);
        }
      }
    }.bind(this));
  };
  this.firingLaser = 0;
  this.fireLaser = function (missile) {
    this.firingLaser += 1;
    this.target = missile;
  };
  this.stopLaser = function () {
    this.firingLaser = 0;
    this.target.destroy();
  };
};

Laser.prototype = new Surrogate();

module.exports = Laser;
