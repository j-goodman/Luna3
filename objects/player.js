var rockets = require('../objectArrays.js').rockets;
var Rocket = require('../constructors/rocket.js');
var Magnet = require('../constructors/magnet.js');
var Clusterbomb = require('../constructors/clusterbomb.js');
var Laser = require('../constructors/laser.js');
var Revolver = require('../constructors/revolver.js');

var player = {
  x: (Math.random()*600)+150,
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
  ammoStore: {"rocket": 2},
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
    // if (ammoStore[ammoType] === 0) {
    //   ammoIndex = 0;
    //   ammoType = "rocket";
    // }
    player.ammoStore[player.ammoType] -= 1;
    if (player.ammoStore[player.ammoType] <= 0) {
      player.toggleRocket();
    }
  },
  toggleRocket: function () {
    if (player.ammoIndex+1 === Object.keys(player.ammoStore).length) {
      player.ammoIndex = 0;
    } else {
      player.ammoIndex += 1;
    }
    player.ammoType = Object.keys(player.ammoStore)[player.ammoIndex];
  }
};

module.exports = player;
