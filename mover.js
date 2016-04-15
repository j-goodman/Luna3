var mover = function (canvas, a) {

  var shield = require('./objects/shield.js');
  var player = require('./objects/player.js');
  var carrier = require('./objects/carrier.js');

  var Missile = require('./constructors/missile.js');

  var rockets = require('./objectArrays.js').rockets;
  var explosions = require('./objectArrays.js').explosions;
  var missiles = require('./objectArrays.js').missiles;
  var ghosts = require('./objectArrays.js').ghosts;
  var lunamods = require('./objectArrays.js').lunamods;
  var powerups = require('./objectArrays.js').powerups;

  a.movePlayer = function () {
    if (player.health > 0) {
      player.x += player.xspeed;
      player.angle += player.spin;
      if (player.angle < 210) {player.angle = 210;}
      if (player.angle > 330) {player.angle = 330;}
      player.cooldown -= 1;
      if (player.overheat > 2) {
        player.overheat -= 3;
      }
      if (player.ammoStore["rocket"] !== 2) {
        player.ammoStore["rocket"] = 2;
      }
    } else {
      carrier.destroyed = true;
      lunamods[0].destroy();
      powerups.forEach( function (powerup) {
        if (powerup) {
          powerup.destroy();
        }
      });
    }
  };

  a.moveRockets = function () {
    rockets.forEach(function (rocket) {
      if (rocket) {
        rocket.x += rocket.xspeed;
        rocket.y += rocket.yspeed;
        rocket.yspeed += rocket.yaccel;
        rocket.degrees = Math.atan(rocket.yspeed/rocket.xspeed)*RADIANS;
        if (rocket.xspeed < 0) {
          rocket.degrees += 180;
        }
        if ( rocket.y > 500 ) {
          rocket.destroy();
          if (rocket.x > player.x-16 && rocket.x < player.x+16) {
            player.health -= 2;
          }
        }
        if (rocket.type === "laser") {
          rocket.checkLaser();
          if (rocket.firingLaser) {rocket.firingLaser++;}
          if (rocket.firingLaser && rocket.firingLaser>8) {
            rocket.stopLaser();
          }
        }
        if (rocket.type === "revolver") {
          rocket.timer -= 5;
          if (rocket.timer < 0 ) {
            rocket.deployKoopashells();
          }
        }
        if (rocket.type === "koopashell") {
          rocket.timer -= 1;
          if (rocket.timer < 0) {
            rocket.destroy();
          }
        }
      }
    });
  };

  a.moveMissiles = function () {
    missiles.forEach(function (missile) {
      if (missile) {
        missile.x += missile.xspeed;
        missile.y += missile.yspeed;
        missile.xspeed += missile.xaccel;
        missile.yspeed += missile.yaccel;
        missile.degrees = Math.atan(missile.yspeed/missile.xspeed)*RADIANS;
        if (missile.xspeed < 0) {
          missile.degrees += 180;
        }
        if (missile.rocketCollide()) {
          missile.destroy();
        }
        if ( missile.y > 484 ) {
          missile.destroy();
          if ( missile.x > 385 && missile.x < 540) {
            shield.health -= 2;
          }
          if (missile.x > player.x-16 && missile.x < player.x+16) {
            player.health -= 3;
          }
        }
      }
    });
  };

  a.moveGhosts = function () {
    ghosts.forEach(function (ghost) {
      if (ghost) {
        ghost.x += ghost.xspeed;
        ghost.y += ghost.yspeed;
        if ( ghost.y < -32 || ghost.x < -32 || ghost.x > canvas.width+32) { ghost.deploy(); }
        if ( ghost.y > canvas.height+32 ) { ghost.destroy(); }
      }
    });
  };

  a.movePowerups = function () {
    powerups.forEach(function (powerup) {
      if (powerup) {
        if (powerup.y < 490) {
          powerup.y += powerup.yspeed;
        } else {
          powerup.y = 490;
        }
        if (powerup.yspeed < 4) {
          powerup.yspeed += powerup.yaccel;
        }
        powerup.playerCollide();
      }
    });
  };

  a.moveCarrier = function () {
    carrier.x += carrier.xspeed;
    if (carrier.x > 30000) {
      carrier.xspeed = -4;
      carrier.sprite = "carrier_9";
      carrier.destroyed = false;
      carrier.y = Math.random()*canvas.height/2+12;
    } else if (carrier.x < -20000) {
      carrier.xspeed = 4;
      carrier.sprite = "carrier_3";
      carrier.destroyed = false;
      carrier.y = Math.random()*canvas.height/2+12;
    }
    carrier.rocketCollide();
  };

  a.moveLunamods = function () {
    lunamods.forEach(function (lunamod) {
      //HOVER
      if (lunamod.y > lunamod.hoverHeight) {
        lunamod.yaccel = -0.5;
      } else if (lunamod.y < lunamod.hoverHeight) {
        lunamod.yaccel = 0.1;
      }
      //SEEK X TARGET
      if (lunamod.x > lunamod.x) {
        lunamod.xaccel = -0.5;
      } else if (lunamod.x < lunamod.x) {
        lunamod.xaccel = 0.5;
      }
      //DROP AND RISE
      var dice = Math.random()*900;
      //FOLLOW PLAYER
      if (dice < 200) {
        if (lunamod.x > player.x) {
          lunamod.xaccel = -0.5;
        } else {
          lunamod.xaccel = 0.5;
        }
      }
      //FIRE MISSILES
      if (lunamod.x > player.x-12 && lunamod.y < player.x+12) {
        if (dice < 8) {
          missiles.push(new Missile(lunamod.x, lunamod.y, 0, 6, missiles.length));
          lunamod.ammo -= 1;
        }
      }
      //RUN AWAY WHEN OUT OF AMMO
      if (lunamod.ammo < 0) {
        lunamod.y -= 12;
        if (lunamod.y < -120) {
          lunamod.x = -15000;
          this.hoverHeight = 200;
          lunamod.ammo = 11;
        }
      }
      //BE VULNERABLE TO ROCKETS
      lunamod.rocketCollide();
      //ENACT SPEED AND ACCEL
      if ((lunamod.yspeed < 10 && lunamod.yaccel > 0)||(lunamod.yspeed > -10 && lunamod.yaccel < 0)) {
        lunamod.yspeed += lunamod.yaccel;
      }
      if ((lunamod.xspeed < 10 && lunamod.xaccel > 0)||(lunamod.xspeed > -10 && lunamod.xaccel < 0)) {
        lunamod.xspeed += lunamod.xaccel;
      }
      lunamod.y += lunamod.yspeed;
      lunamod.x += lunamod.xspeed;
    });
  };

};

module.exports = mover;
