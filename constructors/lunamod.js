var rockets = require('../objectArrays').rockets;
var explosions = require('../objectArrays').explosions;
var powerups = require('../objectArrays').powerups;
var Explosion = require('./explosion.js');
var Powerup = require('./powerup.js');
var player = require('../objects/player.js');
var lunamods = require('../objectArrays.js').lunamods;

var Lunamod = function (x, y, idx) {
  this.x = x;
  this.y = y;
  this.yspeed = 0;
  this.xspeed = 0;
  this.yaccel = 0;
  this.xaccel = 0;
  this.hoverHeight = 100;
  this.ammo = 8;
  this.rocketCollide = function () {
    rockets.forEach(function (rocket) {
      if (rocket) {
        if ((rocket.x > this.x-32 && rocket.x < this.x+32) &&
        (rocket.y < this.y+32 && rocket.y > this.y-32)) {
          player.score += 50;
          rocket.destroy();
          this.destroy();
        }
      }
    }.bind(this));
  };
  this.destroy = function () {
    if (this.hoverHeight < 400) {
      this.hoverHeight += 40;
      this.y += 48;
      explosions.push(new Explosion(this.x, this.y, explosions.length));
    } else {
      var dice = Math.random();
      for (i=0; i < dice*6.25; i++) {
        if (dice > 0.75) {
          powerups.push(new Powerup(this.x+(Math.random()*64)-32, this.y-16, "laser", "3_laser", powerups.length));
        } else if (dice > 0.5) {
          powerups.push(new Powerup(this.x+(Math.random()*64)-32, this.y-16, "magnet", "3_magnet", powerups.length));
        } else if (dice > 0.25) {
          powerups.push(new Powerup(this.x+(Math.random()*64)-32, this.y-16, "revolver", "3_revolver", powerups.length));
        } else {
          powerups.push(new Powerup(this.x+(Math.random()*64)-32, this.y-16, "clusterbomb", "3_clusterbomb", powerups.length));
        }
        dice += 0.5;
        if (dice>1) {dice--;}
      }
      if (lunamods.length <= 1) {
        lunamods.push(new Lunamod(-54000, 80, lunamods.length));
      }
      explosions.push(new Explosion(this.x, this.y, explosions.length));
      explosions.push(new Explosion(this.x+16, this.y+16, explosions.length));
      explosions.push(new Explosion(this.x-22, this.y+8, explosions.length));
      this.ammo = 8;
      this.hoverHeight = 100;
      this.x = 30000;
    }
  };
};

module.exports = Lunamod;
