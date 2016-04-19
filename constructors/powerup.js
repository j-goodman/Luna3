var player = require('../objects/player.js');
var powerups = require('../objectArrays.js').powerups;

var Powerup = function (x, y, type, sprite, idx) {
  this.x = x;
  this.y = y;
  this.idx = idx;
  this.type = type;
  this.sprite = sprite;
  this.yspeed = Math.random()*(-12);
  this.yaccel = 0.2;
  this.playerCollide = function () {
    if ((player.x > this.x-19 && player.x < this.x+19) &&
    (player.y > this.y-19 && player.y < this.y+19)) {
      if (player.score > 4) { player.score -= 5; }
      this.destroy();
    }
  };
  this.destroy = function () {
    if (player.ammoStore) {
      if (player.ammoStore[this.type]) {
        player.ammoStore[this.type] += 1;
      } else {
        player.showShift = 3;
        player.ammoStore[this.type] = 1;
      }
      powerups[this.idx] = undefined;
    }
  };
};

module.exports = Powerup;
