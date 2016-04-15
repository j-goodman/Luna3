var Rocket = require('./rocket.js');
var rockets = require('../objectArrays').rockets;

var Surrogate = function () {};
Surrogate.prototype = Rocket.prototype;

var Revolver = function (x, y, degrees, power, idx) {
  Rocket.call(this, x, y, degrees, power, idx);
  this.type = "revolver";
  this.sprite = "3_revolver";
  this.timer = 30;
  this.deployKoopashells = function () {
    rockets.push(new Koopashell(this.x, this.y, 270+this.timer, (Math.sqrt(-this.timer)*2), rockets.length));
    rockets.push(new Koopashell(this.x, this.y, 0+this.timer, (Math.sqrt(-this.timer)*2), rockets.length));
    rockets.push(new Koopashell(this.x, this.y, 90+this.timer, (Math.sqrt(-this.timer)*2), rockets.length));
    rockets.push(new Koopashell(this.x, this.y, 180+this.timer, (Math.sqrt(-this.timer)*2), rockets.length));
  };
};

Revolver.prototype = new Surrogate();
Revolver.prototype.constructor = Revolver;

var Koopashell = function (x, y, degrees, power, idx) {
  this.x = x;
  this.y = y;
  this.timer = 3;
  this.type = "koopashell";
  this.sprite = "3_koopashell";
  this.yaccel = 0;
  this.idx = idx;
  this.degrees = degrees;
  this.power = power;
  this.xspeed = this.power * Math.cos((this.degrees)*DEGREES);
  this.yspeed = this.power * Math.sin((this.degrees)*DEGREES);
  this.destroy = function () {
    rockets[idx] = undefined;
  };
};

module.exports = Revolver;
