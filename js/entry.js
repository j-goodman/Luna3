window.onload = function () {
  var canvas = document.getElementById("screen"),
    a = canvas.getContext("2d");

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
Drawer(canvas, a);

var Mover = require('./mover.js');
Mover(canvas, a);

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
  player.ammoStore = {"rocket": 2, "revolver": 1, "clusterbomb": 1, "laser": 1, "magnet": 1};
  player.ammoType = "rocket";
  player.ammoIndex = 0;
  attacker.rate = 300;
  attacker.start = 300;
  shield.health = 24;
};

window.setupGame = function () {
  objectArrays.ghosts.push(new Ghost(450, 500, 240, objectArrays.ghosts.length));
  objectArrays.ghosts.push(new Ghost(450, 500, 300, objectArrays.ghosts.length));
  objectArrays.lunamods.push(new Lunamod(19900, 80, objectArrays.lunamods.length));
  objectArrays.powerups.push(new Powerup(Math.random()*canvas.width, -10000, "clusterbomb", "3_clusterbomb", objectArrays.powerups.length));
  objectArrays.powerups.push(new Powerup(Math.random()*canvas.width, -2000, "revolver", "3_revolver", objectArrays.powerups.length));
  objectArrays.powerups.push(new Powerup(Math.random()*canvas.width, -18000, "laser", "3_laser", objectArrays.powerups.length));
  objectArrays.powerups.push(new Powerup(Math.random()*canvas.width, -26000, "magnet", "3_magnet", objectArrays.powerups.length));
};

a.drawObjects = function () {
    a.drawSky();
    a.drawCity();
    a.drawRockets();
    a.drawExplosions();
    a.drawMissiles();
    a.drawCarrier();
    a.drawLunamods();
    a.drawPowerups();
    a.drawMoon();
    a.drawHealthBar();
    a.drawPlayer();
  };

  a.moveObjects = function () {
    a.moveRockets();
    a.moveMissiles();
    a.moveGhosts();
    a.moveCarrier();
    a.moveLunamods();
    a.movePowerups();
    a.movePlayer();
  };

  setupGame();
  setInterval(function() {

    a.clearRect(0, 0, canvas.width, canvas.height);
    a.fillStyle = "black";
    a.fillRect(0, 0, canvas.width, canvas.height);

    a.moveObjects();
    a.drawObjects();

    attacker.deployGhost();

    if (shield.health < 0 || player.health <= 0) {
      a.drawReload();
    }

    if (attacker.start > 0) { a.drawStartScreen() ;}
  }, 32);
};
