mover = function (canvas, a, shield, player, rockets, explosions, missiles, ghosts, lunamods, powerups, Missile) {
  a.movePlayer = function () {
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
        if (powerup.y < 496) {
          powerup.y += powerup.yspeed;
        } else {
          powerup.y = 496;
        }
        if (powerup.yspeed < 10) {
          powerup.yspeed += powerup.yaccel;
        }
        powerup.playerCollide();
      }
    });
  };

  a.moveLunamods = function () {
    lunamods.forEach(function (lunamod) {
      //HOVER
      if (lunamod.y > lunamod.hoverHeight) {
        lunamod.yaccel = -1;
      } else if (lunamod.y < lunamod.hoverHeight) {
        lunamod.yaccel = 0.1;
      }
      //SEEK X TARGET
      if (lunamod.x > lunamod.x) {
        lunamod.xaccel = -1;
      } else if (lunamod.x < lunamod.x) {
        lunamod.xaccel = 1;
      }
      //DROP AND RISE
      var dice = Math.random()*900;
      //FOLLOW PLAYER
      if (dice < 200) {
        if (lunamod.x > player.x) {
          lunamod.xaccel = -1;
        } else {
          lunamod.xaccel = 1;
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
