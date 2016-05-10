var lunamods = require('../objectArrays.js').lunamods;
var powerups = require('../objectArrays.js').powerups;
var carrier = require('./carrier.js');
var rockets = require('../objectArrays.js').rockets;
var Rocket = require('../constructors/rocket.js');
var Magnet = require('../constructors/magnet.js');
var Clusterbomb = require('../constructors/clusterbomb.js');
var Laser = require('../constructors/laser.js');
var Revolver = require('../constructors/revolver.js');

var player = {
  x: 600,
  y: 488,
  mobile: false,
  health: 12,
  spin: 0,
  angle: 270,
  xspeed: 0,
  ready: false,
  power: 16,
  score: 0,
  ammoIndex: 0,
  ammoType: "rocket",
  showShift: 0,
  showCount: 0,
  ammoStore: {"rocket": 2, "revolver": 1, "clusterbomb": 1, "laser": 1, "magnet": 1},
  launcherSprite: document.getElementById("launcher"),
  blastedSprite: document.getElementById("blastedHeap"),
  chassisSprite: document.getElementById("chassis"),
  cooldown: 0,
  overheat: 0,
  hover: -1,
  fire: function (x, y, direction, speed) {
    if (player.ammoType === "rocket") {
      rockets.push(new Rocket(x, y, direction, speed, rockets.length));
    } else if (player.ammoType === "magnet") {
      rockets.push(new Magnet(x, y, direction, speed, rockets.length));
    } else if (player.ammoType === "clusterbomb") {
      rockets.push(new Clusterbomb(x, y, direction, speed, rockets.length));
    } else if (player.ammoType === "laser") {
      rockets.push(new Laser(x, y, direction, speed, rockets.length));
    } else if (player.ammoType === "revolver") {
      rockets.push(new Revolver(x, y, direction, speed, rockets.length));
    }

    player.ammoStore[player.ammoType] -= 1;
    if (player.ammoStore[player.ammoType] <= 0) {
      player.ammoType = "rocket";
      player.ammoIndex = 0;
    }
  },
  toggleRocket: function () {
    if (player.ammoIndex+1 === Object.keys(player.ammoStore).length) {
      player.ammoIndex = 0;
    } else {
      player.ammoIndex += 1;
    }
    player.ammoType = Object.keys(player.ammoStore)[player.ammoIndex];
  },
  draw: function (ctx) {
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
  },
  move: function (canvas) {
    if (player.health > 0) {
        player.x += player.xspeed;
        player.angle += player.spin;
        if (player.angle < 210) {player.angle = 210;}
        if (player.angle > 330) {player.angle = 330;}
        player.cooldown -= 1;
        if (player.overheat > 2) {
          player.overheat -= 3;
        }
        //WRAP WHEN OUTSIDE SCREEN
        if (player.x > canvas.width + 32) {
          player.x = -16;
        } else if (player.x < -32) {
          player.x = canvas.width + 16;
        }

        if (player.ammoStore["rocket"] !== 2) {
          player.ammoStore["rocket"] = 2;
        }

      } else {
        carrier.destroyed = true;
        lunamods.forEach( function (lunamod) {
          lunamod.destroy();
        });
        powerups.forEach( function (powerup) {
          if (powerup) {
            powerup.destroy();
          }
        });
      }
    }
};

module.exports = player;
