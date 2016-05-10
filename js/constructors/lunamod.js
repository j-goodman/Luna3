var rockets = require('../objectArrays').rockets;
var explosions = require('../objectArrays').explosions;
var powerups = require('../objectArrays').powerups;
var missiles = require('../objectArrays').missiles;
var Explosion = require('./explosion.js');
var Powerup = require('./powerup.js');
var Missile = require('./missile.js');
var player = require('../objects/player.js');
var lunamods = require('../objectArrays.js').lunamods;

var Lunamod = function (x, y, idx, canvas) {
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
      for (i=0; i < dice*8; i++) {
        if (dice > 0.75) {
          powerups.push(new Powerup(this.x+(Math.random()*64)-32, this.y-16, "laser", "3_laser", powerups.length, player));
        } else if (dice > 0.5) {
          powerups.push(new Powerup(this.x+(Math.random()*64)-32, this.y-16, "magnet", "3_magnet", powerups.length, player));
        } else if (dice > 0.25) {
          powerups.push(new Powerup(this.x+(Math.random()*64)-32, this.y-16, "revolver", "3_revolver", powerups.length, player));
        } else {
          powerups.push(new Powerup(this.x+(Math.random()*64)-32, this.y-16, "clusterbomb", "3_clusterbomb", powerups.length, player));
        }
        dice += 0.5;
        if (dice>1) {dice--;}
      }
      if (lunamods.length <= 1) {
        lunamods.push(new Lunamod(-54000, 80, lunamods.length, canvas));
      }
      explosions.push(new Explosion(this.x, this.y, explosions.length));
      explosions.push(new Explosion(this.x+16, this.y+16, explosions.length));
      explosions.push(new Explosion(this.x-22, this.y+8, explosions.length));
      this.ammo = 8;
      this.hoverHeight = 100;
      this.x = 30000;
    }
  };
  this.hover = function () {
    if (this.y > this.hoverHeight) {
      this.yaccel = -0.5;
    } else if (this.y < this.hoverHeight) {
      this.yaccel = 0.1;
    }
  };
  this.move = function () {
    this.hover();
    //SEEK X TARGET
    if (this.x > this.x) {
      this.xaccel = -0.5;
    } else if (this.x < this.x) {
      this.xaccel = 0.5;
    }
    //DROP AND RISE
    var dice = Math.random()*900;
    //FOLLOW PLAYER
    if (dice < 200) {
      if (this.x > player.x) {
        this.xaccel = -0.5;
      } else {
        this.xaccel = 0.5;
      }
    }
    //FIRE MISSILES
    if (this.x > player.x-12 && this.y < player.x+12) {
      if (dice < 8) {
        missiles.push(new Missile(this.x, this.y, 0, 6, missiles.length));
        this.ammo -= 1;
      }
    }
    //RUN AWAY WHEN OUT OF AMMO
    if (this.ammo < 0) {
      this.y -= 12;
      if (this.y < -120) {
        this.x = -15000;
        this.hoverHeight = 200;
        this.ammo = 11;
      }
    }
    //BE VULNERABLE TO ROCKETS
    this.rocketCollide();
    //REGULATE HEIGHT WHEN OFF SCREEN
    if (this.x < -100 || this.x > canvas.width+100) {
      this.y = this.hoverHeight;
    }
    //ENACT SPEED AND ACCEL
    if ((this.yspeed < 10 && this.yaccel > 0)||(this.yspeed > -10 && this.yaccel < 0)) {
      this.yspeed += this.yaccel;
    }
    if ((this.xspeed < 10 && this.xaccel > 0)||(this.xspeed > -10 && this.xaccel < 0)) {
      this.xspeed += this.xaccel;
    }
    this.y += this.yspeed;
    this.x += this.xspeed;
  };
};

module.exports = Lunamod;
