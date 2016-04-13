drawer = function (canvas, a, shield, player, rockets, explosions, missiles, ghosts, lunamods, earth, sun, starfield, powerups, Explosion) {

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

  a.drawMoon = function () {
    a.fillStyle = "#e0e0e5";
    a.fillRect(0, 500, canvas.width, 100);
    a.fillStyle = shield.color;
    a.beginPath();
    a.arc(450, 500, 60, Math.PI, 0, false);
    a.fill();

    a.globalAlpha = 0;
    if (sun.y > 400 && sun.y < 800) {
      a.globalAlpha = 1;
    }
    if (sun.y > 600) {
      a.globalAlpha = 1-(sun.y-600)/300;
    }
    if (sun.y < 400 && sun.y > 200) {
      a.globalAlpha = (sun.y-200)/200;
    }
    a.fillStyle = "#ffbe00";
    a.beginPath();
    a.arc(450, 500, 60, Math.PI, 0, false);
    a.fill();
    a.globalAlpha = 1;

    a.drawImage(document.getElementById("city"), 400, 452, 96, 48);
  };

  a.drawPlayer = function () {
    a.fillStyle = "#008080";
    a.beginPath();
    a.arc(player.x, player.y, 12, (player.angle+60)*DEGREES, (player.angle-60)*DEGREES, false);
    a.fill();
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
      }
    });
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
        // a.fillStyle = "white";
        // a.font = "10px Courier";
        // a.fillText(missile.idx, missile.x-16, missile.y-16);
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
        a.drawImage(document.getElementById(powerup.sprite), powerup.x-14, powerup.y-14, 28, 28);
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
    a.globalAlpha = player.showShift;
    a.strokeRect(91, 115, 53, 26);
    a.fillStyle = "white";
    a.font = "14px Courier";
    a.fillText("SHIFT", 96, 132);
    a.globalAlpha = 1;

    a.drawImage(document.getElementById("healthbar"), 0, 100, 100, 400);
    a.drawImage(document.getElementById(ammoSprite), 22, 112, 32, 32);
  };

};


module.exports = drawer;
