var explosions = require('../objectArrays').explosions;

var Explosion = function (x, y, index) {
  this.x = x;
  this.y = y;
  this.age = 0;
  this.dice = 6;
  this.destroy = function () {
    explosions.splice(this.index, 1);
  };
};

module.exports = Explosion;
