var Missile = require('./missile.js');
var missiles = require('../objectArrays.js').missiles;
var ghosts = require('../objectArrays.js').ghosts;
var shield = require('../objects/shield.js');

var Ghost = function (x, y, degrees, idx) {
  this.x = x;
  this.y = y;
  this.power = 2;
  this.idx = idx;
  this.degrees = degrees;
  this.xspeed = this.power * Math.cos((this.degrees)*DEGREES);
  this.yspeed = this.power * Math.sin((this.degrees)*DEGREES);
  this.yaccel = 0;
  this.deploy = function () {
    this.x += (Math.random()*120)-60;
    if (shield.health > -2) {
      missiles.push(new Missile(this.x, this.y, this.xspeed*(-1), this.yspeed*(-1), missiles.length));
    }
    this.destroy();
  };
  this.destroy = function () {
    ghosts[this.idx] = undefined;
  };
};

module.exports = Ghost;
