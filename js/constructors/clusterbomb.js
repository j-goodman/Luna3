var smallExplosion = require('../smallExplosion.js');
var Rocket = require('./rocket.js');
var rockets = require('../objectArrays.js').rockets;

var Surrogate = function () {};
Surrogate.prototype = Rocket.prototype;

var Clusterbomb = function (x, y, degrees, power, idx) {
  Rocket.call(this, x, y, degrees, power, idx);
  this.type = "clusterbomb";
  this.sprite = "3_clusterbomb";
  this.destroy = function () {
    smallExplosion(this);
    rockets[idx] = undefined;
    for (var i=0; i < 12; i++) {
      rockets.push(new Rocket(this.x, this.y, Math.random()*360, Math.random()*12, rockets.length));
    }
    if (Math.random() < 0.5) {
      rockets.push(new Clusterbomb(this.x, this.y, Math.random()*360, Math.random()*12, rockets.length));
    }
  }.bind(this);
};

Clusterbomb.prototype = new Surrogate();

module.exports = Clusterbomb;
