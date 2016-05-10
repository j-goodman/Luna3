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

Rocket.prototype.move = function (player) {
  this.x += this.xspeed;
  this.y += this.yspeed;
  this.yspeed += this.yaccel;
  this.degrees = Math.atan(this.yspeed/this.xspeed)*RADIANS;
  if (this.xspeed < 0) {
    this.degrees += 180;
  }
  if ( this.y > 500 ) {
    this.destroy();
    if (this.x > player.x-16 && this.x < player.x+16) {
      player.health -= 2;
    }
  }
  switch(this.type) {
    case "laser":
      this.checkLaser();
      if (this.firingLaser) {this.firingLaser++;}
      if (this.firingLaser && this.firingLaser>8) {
        this.stopLaser();
      }
      break;
    case "revolver":
      this.timer -= 5;
      if (this.timer < 0 ) {
        this.deployKoopashells();
      }
      break;
    case "koopashell":
      this.timer -= 1;
      if (this.timer < 0) {
        this.destroy();
      }
      break;
    }
  };

module.exports = Rocket;
