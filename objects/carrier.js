var rockets = require('../objectArrays.js').rockets;
var powerups = require('../objectArrays.js').powerups;
var missiles = require('../objectArrays.js').missiles;
var explosions = require('../objectArrays.js').explosions;
var player = require('./player.js');
var Powerup = require('../constructors/powerup.js');
var Missile = require('../constructors/missile.js');
var Explosion = require('../constructors/explosion.js');

var carrier = {
  x: -32000,
  y: 100,
  xspeed: 3,
  destroyed: false,
  sprite: "carrier_3",
  rocketCollide: function () {
    rockets.forEach(function (rocket, idx) {
      if (rocket) {
        if ((rocket.x > this.x-36 && rocket.x < this.x+36) &&
        (rocket.y > this.y-36 && rocket.y < this.y+36)) {
          player.score += 101;
          rocket.destroy();
          this.destroy();
        }
      }
    }.bind(this));
  },
  destroy: function () {
      for (var i=0; i<2; i++) {
        var dice = Math.random();
        this.destroyed = true;
        if (dice > 0.75) {
          powerups.push(new Powerup(this.x+(Math.random()*64)-32, this.y, "laser", "3_laser", powerups.length));
        } else if (dice > 0.5) {
          powerups.push(new Powerup(this.x+(Math.random()*64)-32, this.y, "magnet", "3_magnet", powerups.length));
        } else if (dice > 0.25) {
          powerups.push(new Powerup(this.x+(Math.random()*64)-32, this.y, "revolver", "3_revolver", powerups.length));
        } else {
          powerups.push(new Powerup(this.x+(Math.random()*64)-32, this.y, "clusterbomb", "3_clusterbomb", powerups.length));
        }
      }

      explosions.push(new Explosion(this.x, this.y, explosions.length));
      explosions.push(new Explosion(this.x+16, this.y+16, explosions.length));
      explosions.push(new Explosion(this.x-22, this.y+8, explosions.length));


      this.x = 30000;

    }
};

module.exports = carrier;
