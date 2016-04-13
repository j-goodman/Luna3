window.onload = function () {
  var canvas = document.getElementById("screen"),
    a = canvas.getContext("2d");

DEGREES = (Math.PI / 180);
RADIANS = (180 / Math.PI);

var shield = {
  color: "#ffffff",
  health: 24
};

var attacker = {
  rate: 240
};

var player = {
  x: 300,
  y: 482,
  mobile: true,
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
  ammoStore: {"rocket": 2},
  cooldown: 0,
  overheat: 0,
  fire: function (x, y, direction, speed) {
    if (player.ammoType === "rocket") {
      rockets.push(new Rocket(x, y, direction, speed, rockets.length));
    } else if (player.ammoType === "magnet") {
      rockets.push(new Magnet(x, y, direction, speed, rockets.length));
    }
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

var earth = {
  y: 600,
  timer: 0,
  explosions: [{time: 3000, x: 60, y: 200},
               {time: 3060, x: 80, y: 60},
               {time: 3070, x: 160, y: 10},
               {time: 3090, x: 50, y: 180},
               {time: 3150, x: 200, y: 80},
               {time: 3160, x: 90, y: 120},
               {time: 3200, x: 90, y: 90},
               {time: 3220, x: 60, y: 100},
               {time: 3260, x: 80, y: 30},
               {time: 3360, x: 160, y: 10},
               {time: 3380, x: 50, y: 180},
               {time: 3420, x: 200, y: 80},
               {time: 3430, x: 90, y: 120},
               {time: 3460, x: 110, y: 140},
               {time: 3480, x: 100, y: 130},
               {time: 3490, x: 100, y: 140}, ]
};

var sun = {
  y: -400
};

var starfield = [];

for (var i = 0; i < 100; i++) {
  var randX = Math.round(Math.random()*canvas.width);
  var randY = Math.round(Math.random()*canvas.width);
  var rad = Math.round(Math.random()*0.6+1);
  starfield.push([randX, randY, rad]);
}

var rockets = [];
var explosions = [];
var missiles = [];
var ghosts = [];
var lunamods = [];
var powerups = [];

var Rocket = function (x, y, degrees, power, idx) {
  this.x = x;
  this.y = y;
  this.type = "rocket";
  this.sprite = "3_rocket";
  this.yaccel = 0.25;
  this.idx = idx;
  this.degrees = degrees;
  this.power = power;
  this.xspeed = this.power * Math.cos((this.degrees)*DEGREES);
  this.yspeed = this.power * Math.sin((this.degrees)*DEGREES);
  this.destroy = function () {
    rockets[idx] = undefined;
  };
};

var Magnet = function (x, y, degrees, power, idx) {
  this.x = x;
  this.y = y;
  this.type = "magnet";
  this.sprite = "3_magnet";
  this.yaccel = 0.25;
  this.idx = idx;
  this.degrees = degrees;
  this.power = power;
  this.xspeed = this.power * Math.cos((this.degrees)*DEGREES);
  this.yspeed = this.power * Math.sin((this.degrees)*DEGREES);
  this.destroy = function () {
    rockets[idx] = undefined;
  };
};

var Missile = function (x, y, xspeed, yspeed, idx) {
  this.x = x;
  this.y = y;
  this.xspeed = xspeed;
  this.yspeed = yspeed;
  this.idx = idx;
  this.degrees = Math.atan(yspeed/xspeed)*RADIANS;
  if (this.degrees < 0) {this.degrees+=180;}
  this.yaccel = 0;
  this.xaccel = 0;
  this.destroy = function () {
    missiles[this.idx] = undefined;
    explosions.push(new Explosion(this.x, this.y, explosions.length));
    if (attacker.rate > 120) {
      attacker.rate -= 1;
    }
  };
  this.rocketCollide = function () {
    rockets.forEach(function (rocket, idx) {
      if (rocket) {
        if ((rocket.x > this.x-19 && rocket.x < this.x+19) &&
        (rocket.y > this.y-19 && rocket.y < this.y+19)) {
          player.score += 5;
          this.destroy();
        }
        if (rocket.type === "magnet") {
          if (this.x > rocket.x) {
            this.xaccel = -0.05;
          } else {
            this.xaccel = 0.05;
          }
          if (this.y > rocket.y) {
            this.yaccel = -0.05;
          } else {
            this.yaccel = 0.05;
          }
        }
      }
    }.bind(this));
  };
  this.clock = function () {
    var clock;
    if (this.degrees >= 0 & this.degrees < 36) { clock = 4; }
    else if (this.degrees >= 36 & this.degrees < 72) { clock = 5; }
    else if (this.degrees >= 72 & this.degrees < 108) { clock = 6; }
    else if (this.degrees >= 108 & this.degrees < 144) { clock = 7; }
    else if (this.degrees >= 144 & this.degrees < 180) { clock = 8; }
    else {clock = 6;}
    return clock;
  }.bind(this);
};

var Explosion = function (x, y, index) {
  this.x = x;
  this.y = y;
  this.age = 0;
  this.dice = 6;
  this.destroy = function () {
    explosions.splice(this.index, 1);
  };
};

var Ghost = function (x, y, degrees, idx) {
  this.x = x;
  this.y = y;
  this.power = 2;
  this.idx = idx;
  this.degrees = degrees;
  this.xspeed = this.power * Math.cos((this.degrees)*DEGREES);
  this.yspeed = this.power * Math.sin((this.degrees)*DEGREES);
  this.yaccel = 0;
  this.deploy = function () {
    this.x += (Math.random()*120)-60;
    missiles.push(new Missile(this.x, this.y, this.xspeed*(-1), this.yspeed*(-1), missiles.length));
    ghosts.splice(this.index, 1);
  };
  this.destroy = function () {
    ghosts[this.idx] = undefined;
  };
};

var Powerup = function (x, y, type, sprite, idx) {
  this.x = x;
  this.y = y;
  this.idx = idx;
  this.type = type;
  this.sprite = sprite;
  this.yspeed = 0;
  this.yaccel = 0.2;
  this.playerCollide = function () {
    if ((player.x > this.x-19 && player.x < this.x+19) &&
    (player.y > this.y-19 && player.y < this.y+19)) {
      if (player.score > 4) { player.score -= 5; }
      this.destroy();
    }
  };
  this.destroy = function () {
    if (player.ammoStore[this.type]) {
      player.ammoStore[this.type] += 1;
    } else {
      player.showShift = 3;
      player.ammoStore[this.type] = 1;
    }
    powerups[this.idx] = undefined;
  };
};

var Lunamod = function (x, y, idx) {
  this.x = x;
  this.y = y;
  this.yspeed = 0;
  this.xspeed = 0;
  this.yaccel = 0;
  this.xaccel = 0;
  this.hoverHeight = 200;
  this.cargo = "magnet-rocket";
  this.ammo = 11;
  this.rocketCollide = function () {
    rockets.forEach(function (rocket) {
      if (rocket) {
        if ((rocket.x > this.x-32 && rocket.x < this.x+32) &&
        (rocket.y < this.y+32 && rocket.y > this.y-32)) {
          player.score += 50;
          this.destroy();
        }
      }
    }.bind(this));
  };
  this.destroy = function () {
    if (this.hoverHeight < 360) {
      this.hoverHeight += 20;
      this.y += 20;
      explosions.push(new Explosion(this.x, this.y, explosions.length));
    } else {
      powerups.push(new Powerup(this.x, this.y-16, "magnet", "3_magnet", powerups.length));
      explosions.push(new Explosion(this.x, this.y, explosions.length));
      explosions.push(new Explosion(this.x+16, this.y+16, explosions.length));
      explosions.push(new Explosion(this.x-22, this.y+8, explosions.length));
      this.ammo = 11;
      this.hoverHeight = 200;
      this.x = 30000;
    }
  };
};

a.deployGhost = function () {
  var dice = Math.round(Math.random()*attacker.rate);
  if (dice < 2) {
    ghosts.push(new Ghost(450, 500, Math.round(Math.random()*4)*30+210, ghosts.length));
  }
};

var keyEvents = require('./keyEvents');
keyEvents(document, player);

var drawer = require('./drawer.js');
drawer(canvas, a, shield, player, rockets, explosions, missiles, ghosts, lunamods, earth, sun, starfield, powerups, Explosion);

var mover = require('./mover.js');
mover(canvas, a, shield, player, rockets, explosions, missiles, ghosts, lunamods, powerups, Missile);

ghosts.push(new Ghost(450, 500, 240, ghosts.length));
ghosts.push(new Ghost(450, 500, 300, ghosts.length));
lunamods.push(new Lunamod(33400, 80, lunamods.length));
powerups.push(new Powerup(Math.random()*canvas.width, -6000, "magnet", "3_magnet", powerups.length));

  setInterval(function() {
    a.clearRect(0, 0, canvas.width, canvas.height);
    a.fillStyle = "black";
    a.fillRect(0, 0, canvas.width, canvas.height);

    a.drawSky();

    a.drawMoon();
    a.movePlayer();
    a.drawPlayer();

    a.moveRockets();
    a.drawRockets();
    a.drawExplosions();

    a.drawMissiles();
    a.moveMissiles();

    a.deployGhost();
    a.moveGhosts();

    a.drawLunamods();
    a.moveLunamods();

    a.drawPowerups();
    a.movePowerups();

    a.drawHealthBar();

  }, 30);
};
