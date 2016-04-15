var Explosion = require('./explosion.js');
var Missile = require('./missile.js');
var player = require('../objects/player.js');

var rockets = require('../objectArrays.js').rockets;
var missiles = require('../objectArrays.js').missiles;
var explosions = require('../objectArrays.js').explosions;
var attacker = require('../objects/attacker.js');

var Missile = function (x, y, xspeed, yspeed, idx) {
  this.x = x;
  this.y = y;
  this.xspeed = xspeed;
  this.yspeed = yspeed;
  this.idx = idx;
  this.degrees = Math.atan(yspeed/xspeed)*RADIANS;
  if (this.degrees < 0) {this.degrees+=180;}
  this.yaccel = 0;
  this.xaccel = 0;
  this.destroy = function () {
    missiles[this.idx] = undefined;
    explosions.push(new Explosion(this.x, this.y, explosions.length));
  };
  this.rocketCollide = function () {
    rockets.forEach(function (rocket, idx) {
      if (rocket) {
        if ((rocket.x > this.x-19 && rocket.x < this.x+19) &&
        (rocket.y > this.y-19 && rocket.y < this.y+19)) {
          player.score += 5;
          if (rocket.type === "rocket" || rocket.type === "clusterbomb") {
            rocket.destroy();
          }
          if (rocket.type !== "laser") {
            this.destroy();
          }
          if (attacker.rate >= 88) {
            attacker.rate -= 1;
          }
        }
        if (rocket.type === "magnet") {
          if (this.x > rocket.x) {
            this.xaccel = -0.05;
          } else {
            this.xaccel = 0.05;
          }
          if (this.y > rocket.y) {
            this.yaccel = -0.05;
          } else {
            this.yaccel = 0.05;
          }
        }
      }
    }.bind(this));
  };
  this.clock = function () {
    var clock;
    if (this.degrees >= 0 & this.degrees < 36) { clock = 4; }
    else if (this.degrees >= 36 & this.degrees < 72) { clock = 5; }
    else if (this.degrees >= 72 & this.degrees < 108) { clock = 6; }
    else if (this.degrees >= 108 & this.degrees < 144) { clock = 7; }
    else if (this.degrees >= 144 & this.degrees < 180) { clock = 8; }
    else {clock = 6;}
    return clock;
  }.bind(this);
};

module.exports = Missile;
