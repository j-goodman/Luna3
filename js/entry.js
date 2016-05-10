window.onload = function () {
  var canvas = document.getElementById("screen"),
    ctx = canvas.getContext("2d");

DEGREES = (Math.PI / 180);
RADIANS = (180 / Math.PI);

//REQUIRE GAME OBJECTS
//Each object is a singleton
var shield = require('./objects/shield.js');
var attacker = require('./objects/attacker.js');
var player = require('./objects/player.js');
var earth = require('./objects/earth.js');
var sun = require('./objects/sun.js');
var starfield = require('./objects/starfield.js');
var carrier = require('./objects/carrier.js');

//REQUIRE GAME CONSTRUCTORS
//Each class corresponds to an array
var Rocket = require('./constructors/rocket.js');
  var Magnet = require('./constructors/magnet.js');
  var Clusterbomb = require('./constructors/clusterbomb.js');
  var Revolver = require('./constructors/revolver.js');
  var Laser = require('./constructors/laser.js');

var Explosion = require('./constructors/explosion.js');
var Powerup = require('./constructors/powerup.js');

var Missile = require('./constructors/missile.js');
var Ghost = require('./constructors/ghost.js');

var Lunamod = require('./constructors/lunamod.js');

//REQUIRE OBJECT ARRAYS
//Constructed objects are pushed into Object Arrays to be moved and drawn
var objectArrays = require('./objectArrays.js');

var keyEvents = require('./keyEvents');
keyEvents(document, player, shield);

var Drawer = require('./drawer.js');
Drawer(canvas, ctx);

window.resetGame = function () {
  objectArrays.missiles.splice(0,objectArrays.missiles.length);
  objectArrays.rockets.splice(0,objectArrays.rockets.length);
  objectArrays.explosions.splice(0,objectArrays.explosions.length);
  objectArrays.ghosts.splice(0,objectArrays.ghosts.length);
  objectArrays.lunamods.splice(0,objectArrays.lunamods.length);
  objectArrays.powerups.splice(0,objectArrays.powerups.length);
  window.setupGame();
  player.health = 12;
  player.mobile = false;
  player.y = 488;
  player.score = 0;
  player.xspeed = 0;
  player.ammoIndex = 0;
  player.ammoType = "rocket";
  player.ammoStore = {"rocket": 2, "revolver": 1, "clusterbomb": 1, "laser": 1, "magnet": 1};
  attacker.rate = 300;
  attacker.start = 300;
  shield.health = 24;
};

window.setupGame = function () {
  objectArrays.ghosts.push(new Ghost(450, 500, 240, objectArrays.ghosts.length));
  objectArrays.ghosts.push(new Ghost(450, 500, 300, objectArrays.ghosts.length));
  objectArrays.lunamods.push(new Lunamod(19900, 80, objectArrays.lunamods.length, canvas));
  objectArrays.powerups.push(new Powerup(Math.random()*canvas.width, -10000, "clusterbomb", "3_clusterbomb", objectArrays.powerups.length, player));
  objectArrays.powerups.push(new Powerup(Math.random()*canvas.width, -2000, "revolver", "3_revolver", objectArrays.powerups.length, player));
  objectArrays.powerups.push(new Powerup(Math.random()*canvas.width, -18000, "laser", "3_laser", objectArrays.powerups.length, player));
  objectArrays.powerups.push(new Powerup(Math.random()*canvas.width, -26000, "magnet", "3_magnet", objectArrays.powerups.length, player));
};

ctx.drawObjects = function () {
    ctx.drawSky();
    ctx.drawCity();
    ctx.drawRockets();
    ctx.drawExplosions();
    ctx.drawMissiles();
    ctx.drawLunamods();
    ctx.drawPowerups();
    ctx.drawMoon();
    ctx.drawHealthBar();
    carrier.draw(ctx);
    player.draw(ctx);
  };

  ctx.moveObjects = function () {
    objectArrays.missiles.forEach(function (missile) {
      if (missile) { missile.move(); }
    });
    objectArrays.ghosts.forEach(function (ghost) {
      if (ghost) { ghost.move(canvas); }
    });
    objectArrays.lunamods.forEach(function (lunamod) {
      if (lunamod) { lunamod.move(); }
    });
    objectArrays.powerups.forEach(function (powerup) {
      if (powerup) { powerup.move(); }
    });
    objectArrays.rockets.forEach(function (rocket) {
      if (rocket && !rocket.move) {
        console.log(rocket);
        rocket.destroy();
      }
      if (rocket) { rocket.move(player); }
    });
    carrier.move(canvas, player);
    player.move(canvas);
  };

  setupGame();
  setInterval(function() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.moveObjects();

    attacker.deployGhost();

    if (shield.health < 0 || player.health <= 0) {
      ctx.drawReload();
    }

    ctx.drawObjects();

    if (attacker.start > 0) { ctx.drawStartScreen() ;}
    if (shield.health <= 0 || player.health <= 0) { ctx.drawReload() ;}
  }, 32);
};
