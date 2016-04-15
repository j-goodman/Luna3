drawer = function (canvas, a) {
var shield = require('./objects/shield.js');
var player = require('./objects/player.js');
var earth = require('./objects/earth.js');
var sun = require('./objects/sun.js');
var starfield = require('./objects/starfield.js');
var carrier = require('./objects/carrier.js');
var rockets = require('./objectArrays.js').rockets;
var explosions = require('./objectArrays.js').explosions;
var missiles = require('./objectArrays.js').missiles;
var ghosts = require('./objectArrays.js').ghosts;
var lunamods = require('./objectArrays.js').lunamods;
var powerups = require('./objectArrays.js').powerups;

var Explosion = require('./constructors/Explosion');

  a.drawSky = function () {
    starfield.forEach(function (star) {
      a.fillStyle = "#ffffff";
      a.beginPath();
      a.arc(star[0], star[1], star[2], 0, 360*DEGREES, false);
      a.fill();
      star[1] -= 0.15;
      if (star[1] < 0) {
        star[1] = canvas.height;
      }
    });

    var gradient = a.createRadialGradient(450,earth.y+152,200,450,earth.y+152,60);
    gradient.addColorStop(0,"black");
    gradient.addColorStop(1,"blue");
    a.fillStyle = gradient;
    a.beginPath();
    a.arc(450, earth.y+152, 200, 0, 360*DEGREES, false);
    a.fill();

    a.drawImage(document.getElementById("earth"), 300, earth.y, 300, 300);
    a.globalAlpha = 0.75;
    a.drawImage(document.getElementById("cloudcover"), 300, earth.y, 300, 300);
    a.globalAlpha = 1;
    earth.y -= 0.2;
    if (earth.y < -1760) {
      earth.y = 900;
    }

    earth.timer += 1;
    earth.explosions.forEach(function (explosion) {
      if (earth.timer === explosion.time ||
          earth.timer === explosion.time-140 ||
          earth.timer === explosion.time-100 ||
          earth.timer === explosion.time-130 ||
          earth.timer === explosion.time-170 ||
          earth.timer+120 === explosion.time) {
        explosions.push(new Explosion(300+explosion.x, earth.y+explosion.y, explosions.length));
        ghosts.forEach( function (ghost) {
          if (ghost) {
            ghost.destroy();
          }
        });
      }
    });

    gradient = a.createRadialGradient(450,sun.y,200,450,sun.y,175);
    gradient.addColorStop(0,"black");
    gradient.addColorStop(1,"#ffbe00");
    a.fillStyle = gradient;
    a.beginPath();
    a.arc(450, sun.y, 200, 0, 360*DEGREES, false);
    a.fill();
    sun.y -= 0.2;
    if (sun.y < -1760) {
      sun.y = 900;
    }
  };

  a.drawCity = function () {
    if (Math.random()*10+14<(24-shield.health)) {
      a.globalAlpha = 0;
    }

    a.fillStyle = shield.color;
    a.beginPath();
    a.arc(450, 500, 60, Math.PI, 0, false);
    a.fill();

    a.globalAlpha = 0;
    if (sun.y > 400 && sun.y < 800) { a.globalAlpha = 1; }
    if (sun.y > 600) { a.globalAlpha = 1-(sun.y-600)/300; }
    if (sun.y < 400 && sun.y > 200) { a.globalAlpha = (sun.y-200)/200; }

    if (Math.random()*10+14<(24-shield.health)) {
      a.globalAlpha = 0;
    }

    a.fillStyle = "#ffbe00";
    a.beginPath();
    a.arc(450, 500, 60, Math.PI, 0, false);
    a.fill();

    a.globalAlpha = 1;

    if (shield.health >= 0) {
      a.drawImage(document.getElementById("city"), 400, 452, 96, 48);
    } else if (shield.health > -12) {
      a.drawImage(document.getElementById("ruins"), 400, 452, 96, 48);
    }
  };

  a.drawMoon = function () {
    a.fillStyle = "#e0e0e5";
    a.fillRect(0, 500, canvas.width, 100);
  };

  a.drawPlayer = function () {
      a.save();
      a.translate(player.x, player.y);
      a.rotate((player.angle+90)*DEGREES);
      a.translate(-16, -19);
      if (player.health > 0) {
        a.drawImage(document.getElementById("launcher"), 0, 0, 32, 32);
      } else {
        a.drawImage(document.getElementById("blastedHeap"), 0, 0, 32, 32);
        player.y = 489;
      }
      a.restore();
    a.drawImage(document.getElementById("chassis"), player.x-16, player.y-19, 32, 32);
  };

  // ROCKETS are the player's defensive projectiles, MISSILES are the incoming enemy bombs
  a.drawRockets = function () {
    rockets.forEach(function (rocket) {
      if (rocket) {

        a.save();
        a.translate(rocket.x, rocket.y);
        a.rotate(rocket.degrees*DEGREES);
        a.translate(-12, -12);
        a.drawImage(document.getElementById(rocket.sprite), 0, 0, 24, 24);
        a.restore();

        if (rocket.type === "laser" && rocket.firingLaser) {
          a.drawLaser(rocket);
        }
      }
    });
  };

  a.drawLaser = function (rocket) {
    a.globalAlpha = Math.round(Math.random());
    a.strokeStyle = "orange";
    a.lineWidth = 2;
    a.beginPath();
    a.moveTo(rocket.x, rocket.y);
    a.lineTo(rocket.target.x, rocket.target.y);
    a.stroke();
    a.globalAlpha = 1;
  };

  a.drawCarrier = function () {
    if (!carrier.destroyed) {
      a.drawImage(document.getElementById(carrier.sprite), carrier.x, carrier.y, 64, 48);
    }
  };

  a.drawExplosions = function () {
    explosions.forEach(function (explosion) {
      if (explosion) {
        if (explosion.dice > 3) {
          var radius = (Math.random()*12)+8;
          var xoffset = (Math.random()*10)-5;
          var yoffset = (Math.random()*10)-5;
        }
        explosion.dice = Math.random()*6;
        a.fillStyle = "#ffffff";
        a.beginPath();
        a.arc(explosion.x+xoffset, explosion.y+yoffset, radius, 0, 360*DEGREES, false);
        a.fill();
        explosion.age += 1;
        if (explosion.age > 16) {
          explosion.destroy();
        }
      }
    });
  };

  a.drawMissiles = function () {
    missiles.forEach(function (missile) {
      if (missile) {
        a.save();
        a.translate(missile.x, missile.y);
        a.rotate(missile.degrees*DEGREES);
        a.translate(-12, -12);
        a.drawImage(document.getElementById("3_missile"), 0, 0, 32, 32);
        a.restore();
      }
    });
  };

  a.drawGhosts = function () {
    ghosts.forEach(function (ghost) {
      if (ghost) {
        a.fillStyle = "#0000ff";
        a.beginPath();
        a.arc(ghost.x, ghost.y, 12, 0, 2*Math.PI, false);
        a.fill();
      }
    });
  };

  a.drawLunamods = function () {
    lunamods.forEach(function (lunamod) {
      if (lunamod) {
        a.drawImage(document.getElementById("lunamod"), lunamod.x-24, lunamod.y-24, 48, 48);
      }
    });
  };

  a.drawPowerups = function () {
    powerups.forEach(function (powerup) {
      if (powerup) {
        a.save();
        a.translate(powerup.x, powerup.y);
        a.rotate(270*DEGREES);
        a.translate(-12, -12);
        a.drawImage(document.getElementById(powerup.sprite), 0, 0, 28, 28);
        a.restore();
      }
    });
  };

  a.drawHealthBar = function () {
    if (player.health > 0) {
      a.fillStyle = "red";
      a.fillRect(10, 178, 20, (player.health/12)*220);
    }
    if (shield.health > 0) {
      a.fillStyle = "white";
      a.fillRect(44, 178, 20, (shield.health/24)*220);
    }
    var ammoSprite;
    if (player.ammoType === "rocket") {
      ammoSprite = "3_rocket";
    } else if (player.ammoType === "magnet") {
      ammoSprite = "3_magnet";
    } else if (player.ammoType === "clusterbomb") {
      ammoSprite = "3_clusterbomb";
    } else if (player.ammoType === "laser") {
      ammoSprite = "3_laser";
    } else if (player.ammoType === "revolver") {
      ammoSprite = "3_revolver";
    }
    a.fillStyle = "white";
    a.font = "14px Courier";
    var scoreString = player.score.toString();
    if (scoreString.length < 5) {
      for (var i = 5-player.score.toString().length; i > 0; i--) {
        scoreString = "0" + scoreString;
      }
    }

    a.strokeStyle = "white";
    a.lineWidth = 1;
    a.fillText(scoreString, 16, 165);

    if (player.showShift > 0.02) {
      player.showShift -= 0.02;
    }
    if (player.showCount > 0.02) {
      player.showCount -= 0.02;
    }
    a.globalAlpha = player.showShift;
    a.strokeRect(106, 115, 53, 26);
    a.fillStyle = "white";
    a.font = "14px Courier";
    a.fillText("SHIFT", 111, 132);
    a.globalAlpha = 1;

    a.font = "18px Courier";
    a.globalAlpha = player.showCount;
    var count = player.ammoStore[player.ammoType];
    if (player.ammoType === "rocket") {
      count = "∞";
    }
    a.fillText(count, 85, 133);
    a.globalAlpha = 1;

    a.drawImage(document.getElementById("healthbar"), 0, 100, 100, 400);
    a.drawImage(document.getElementById(ammoSprite), 22, 112, 32, 32);
  };

};


module.exports = drawer;
