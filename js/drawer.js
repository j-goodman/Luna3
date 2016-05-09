drawer = function (canvas, ctx) {
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
var attacker = require('./objects/attacker.js');

var Explosion = require('./constructors/Explosion');

  ctx.drawStartScreen = function () {
    ctx.fillStyle = "white";
    if (attacker.start > 160) {
      ctx.font = "60px Tahoma";
      ctx.lineWidth = 1;
      ctx.fillText("L     U     N     A        3", 160, 220);
    } else {
      ctx.drawInstructions();
    }
    ctx.drawCity();
  };

  ctx.drawReload = function () {
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = "black";
    ctx.font = "12px Courier";
    ctx.lineWidth = 1;
    ctx.fillText("press ENTER to try again", 364, 525);
    ctx.globalAlpha = 1;
  };

  ctx.drawInstructions = function () {
    ctx.strokeStyle = "white";
    ctx.strokeRect(235, 140, 50, 50);
    ctx.moveTo(260, 148);
    ctx.lineTo(245, 178);
    ctx.lineTo(275, 178);
    ctx.fill();
    ctx.strokeRect(295, 140, 50, 50);
    ctx.moveTo(320, 180);
    ctx.lineTo(305, 150);
    ctx.lineTo(335, 150);
    ctx.fill();
    ctx.font = "20px Courier";
    ctx.fillText("toggle between HOVER & AIM", 365, 170);
    ctx.strokeRect(315, 220, 140, 44);
    ctx.fillText("S P A C E", 330, 248);
    ctx.fillText("FIRE rocket", 475, 248);
    ctx.strokeRect(265, 300, 140, 44);
    ctx.fillText("S H I F T", 280, 328);
    ctx.fillText("CHANGE rocket type", 435, 330);
  };

  ctx.drawSky = function () {
    starfield.forEach(function (star) {
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(star[0], star[1], star[2], 0, 360*DEGREES, false);
      ctx.fill();
      star[1] -= 0.15;
      if (star[1] < 0) {
        star[1] = canvas.height;
      }
    });

    var gradient = ctx.createRadialGradient(450,earth.y+152,200,450,earth.y+152,60);
    gradient.addColorStop(0,"black");
    gradient.addColorStop(1,"blue");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(450, earth.y+152, 200, 0, 360*DEGREES, false);
    ctx.fill();

    ctx.drawImage(earth.sprite, 300, earth.y, 300, 300);
    ctx.globalAlpha = 0.75;
    ctx.drawImage(earth.cloudsprite, 300, earth.y, 300, 300);
    ctx.globalAlpha = 1;
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
            if (ghost.idx%2) {
              ghost.destroy();
            }
          }
        });
      }
    });

    gradient = ctx.createRadialGradient(450,sun.y,200,450,sun.y,175);
    gradient.addColorStop(0,"black");
    gradient.addColorStop(1,"#ffbe00");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(450, sun.y, 200, 0, 360*DEGREES, false);
    ctx.fill();
    sun.y -= 0.2;
    if (sun.y < -1760) {
      sun.y = 900;
    }
  };

  ctx.drawCity = function () {
    if (Math.random()*4+20<(24-shield.health)) {
      ctx.globalAlpha = 0;
    }

    ctx.fillStyle = shield.color;
    ctx.beginPath();
    ctx.arc(450, 500, 60, Math.PI, 0, false);
    ctx.fill();

    ctx.globalAlpha = 0;
    if (sun.y > 400 && sun.y < 800) { ctx.globalAlpha = 1; }
    if (sun.y > 600) { ctx.globalAlpha = 1-(sun.y-600)/300; }
    if (sun.y < 400 && sun.y > 200) { ctx.globalAlpha = (sun.y-200)/200; }

    if (Math.random()*4+20<(24-shield.health)) {
      ctx.globalAlpha = 0;
    }

    ctx.fillStyle = "#ffbe00";
    ctx.beginPath();
    ctx.arc(450, 500, 60, Math.PI, 0, false);
    ctx.fill();

    ctx.globalAlpha = 1;

    if (shield.health >= 0) {
      ctx.drawImage(shield.citysprite, 400, 452, 96, 48);
    } else if (shield.health > -8) {
      ctx.drawImage(shield.ruinssprite, 400, 452, 96, 48);
    }
  };

  ctx.drawMoon = function () {
    ctx.fillStyle = "#e0e0e5";
    ctx.fillRect(0, 500, canvas.width, 100);
  };

  ctx.drawPlayer = function () {
      ctx.save();
      ctx.translate(player.x, player.y);
      ctx.rotate((player.angle+90)*DEGREES);
      ctx.translate(-16, -19);
      if (player.health > 0) {
        ctx.drawImage(player.launcherSprite, 0, 0, 32, 32);
      } else {
        ctx.drawImage(player.blastedSprite, 0, 0, 32, 32);
        player.y = 489;
      }
      ctx.restore();
    ctx.drawImage(player.chassisSprite, player.x-16, player.y-19, 32, 32);
  };

  // ROCKETS are the player's defensive projectiles, MISSILES are the incoming enemy bombs
  ctx.drawRockets = function () {
    rockets.forEach(function (rocket) {
      if (rocket) {

        ctx.save();
        ctx.translate(rocket.x, rocket.y);
        ctx.rotate(rocket.degrees*DEGREES);
        ctx.translate(-12, -12);
        ctx.drawImage(document.getElementById(rocket.sprite), 0, 0, 24, 24);
        ctx.restore();

        if (rocket.type === "laser" && rocket.firingLaser) {
          ctx.drawLaser(rocket);
        }
      }
    });
  };

  ctx.drawLaser = function (rocket) {
    ctx.globalAlpha = Math.round(Math.random());
    ctx.strokeStyle = "orange";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(rocket.x, rocket.y);
    ctx.lineTo(rocket.target.x, rocket.target.y);
    ctx.stroke();
    ctx.globalAlpha = 1;
  };

  ctx.drawCarrier = function () {
    if (!carrier.destroyed) {
      ctx.drawImage(document.getElementById(carrier.sprite), carrier.x, carrier.y, 64, 48);
    }
  };

  ctx.drawExplosions = function () {
    explosions.forEach(function (explosion) {
      if (explosion) {
        if (explosion.dice > 3) {
          var radius = (Math.random()*12)+8;
          var xoffset = (Math.random()*10)-5;
          var yoffset = (Math.random()*10)-5;
        }
        explosion.dice = Math.random()*6;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(explosion.x+xoffset, explosion.y+yoffset, radius, 0, 360*DEGREES, false);
        ctx.fill();
        explosion.age += 1;
        if (explosion.age > 16) {
          explosion.destroy();
        }
      }
    });
  };

  ctx.drawMissiles = function () {
    missiles.forEach(function (missile) {
      if (missile) {
        ctx.save();
        ctx.translate(missile.x, missile.y);
        ctx.rotate(missile.degrees*DEGREES);
        ctx.translate(-12, -12);
        ctx.drawImage(document.getElementById("3_missile"), 0, 0, 32, 32);
        ctx.restore();
      }
    });
  };

  ctx.drawGhosts = function () {
    ghosts.forEach(function (ghost) {
      if (ghost) {
        ctx.fillStyle = "#0000ff";
        ctx.beginPath();
        ctx.arc(ghost.x, ghost.y, 12, 0, 2*Math.PI, false);
        ctx.globalAlpha = 0.4;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    });
  };

  ctx.drawLunamods = function () {
    lunamods.forEach(function (lunamod) {
      if (lunamod) {
        if (lunamod.hoverHeight < 120) {
          ctx.drawImage(document.getElementById("lunamod"), lunamod.x-24, lunamod.y-24, 48, 48);
        } else if (lunamod.hoverHeight < 340) {
          ctx.drawImage(document.getElementById("lunamod_1"), lunamod.x-24, lunamod.y-24, 48, 48);
        } else {
          ctx.drawImage(document.getElementById("lunamod_2"), lunamod.x-24, lunamod.y-24, 48, 48);
        }
      }
    });
  };

  ctx.drawPowerups = function () {
    powerups.forEach(function (powerup) {
      if (powerup) {
        ctx.save();
        ctx.translate(powerup.x, powerup.y);
        ctx.rotate(270*DEGREES);
        ctx.translate(-12, -12);
        ctx.drawImage(document.getElementById(powerup.sprite), 0, 0, 28, 28);
        ctx.restore();
      }
    });
  };

  ctx.drawHealthBar = function () {
    if (player.health > 0) {
      ctx.fillStyle = "red";
      ctx.fillRect(10, 178, 20, (player.health/12)*220);
    }
    if (shield.health > 0) {
      ctx.fillStyle = "white";
      ctx.fillRect(44, 178, 20, (shield.health/24)*220);
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
    if (shield.health >= 0) {
      ctx.fillStyle = "white";
      ctx.font = "14px Courier";
      var scoreString = player.score.toString();
      if (scoreString.length < 5) {
        for (var i = 5-player.score.toString().length; i > 0; i--) {
          scoreString = "0" + scoreString;
        }
      }
      ctx.strokeStyle = "white";
      ctx.lineWidth = 1;
      ctx.fillText(scoreString, 16, 165);
    } else {
      if (!player.finalScore) {
        player.finalScore = player.score;
      }
      var finalScoreString = player.finalScore.toString();
      if (finalScoreString.length < 5) {
        for (var j = 5-player.finalScore.toString().length; j > 0; j--) {
          finalScoreString = "0" + finalScoreString;
        }
      }
      ctx.fillRect(10, 144, 60, 30);
      ctx.fillStyle = "black";
      ctx.font = "14px Courier";
      ctx.strokeStyle = "white";
      ctx.lineWidth = 1;
      ctx.fillText(finalScoreString, 16, 165);
    }


    if (player.showShift > 0.02) {
      player.showShift -= 0.02;
    }
    if (player.showCount > 0.02) {
      player.showCount -= 0.02;
    }
    ctx.globalAlpha = player.showShift;
    ctx.strokeRect(106, 115, 53, 26);
    ctx.fillStyle = "white";
    ctx.font = "14px Courier";
    ctx.fillText("SHIFT", 111, 132);
    ctx.globalAlpha = 1;

    ctx.font = "18px Courier";
    ctx.globalAlpha = player.showCount;
    var count = player.ammoStore[player.ammoType];
    if (player.ammoType === "rocket") {
      count = "∞";
    }
    ctx.fillText(count, 85, 133);
    ctx.globalAlpha = 1;

    ctx.drawImage(document.getElementById("healthbar"), 0, 100, 100, 400);
    ctx.drawImage(document.getElementById(ammoSprite), 22, 112, 32, 32);
  };

};


module.exports = drawer;
