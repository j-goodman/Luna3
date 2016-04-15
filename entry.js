window.onload = function () {
  var canvas = document.getElementById("screen"),
    a = canvas.getContext("2d");

DEGREES = (Math.PI / 180);
RADIANS = (180 / Math.PI);

var shield = require('./objects/shield.js');
var attacker = require('./objects/attacker.js');
var player = require('./objects/player.js');
var earth = require('./objects/earth.js');
var sun = require('./objects/sun.js');
var starfield = require('./objects/starfield.js');
var carrier = require('./objects/carrier.js');

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

var objectArrays = require('./objectArrays.js');

var keyEvents = require('./keyEvents');
keyEvents(document, player);

var drawer = require('./drawer.js');
drawer(canvas, a);

var mover = require('./mover.js');
mover(canvas, a);

objectArrays.ghosts.push(new Ghost(450, 500, 240, objectArrays.ghosts.length));
objectArrays.ghosts.push(new Ghost(450, 500, 300, objectArrays.ghosts.length));
objectArrays.lunamods.push(new Lunamod(38000, 80, objectArrays.lunamods.length));
objectArrays.powerups.push(new Powerup(Math.random()*canvas.width, -10000, "clusterbomb", "3_clusterbomb", objectArrays.powerups.length));
objectArrays.powerups.push(new Powerup(Math.random()*canvas.width, -2000, "revolver", "3_revolver", objectArrays.powerups.length));
objectArrays.powerups.push(new Powerup(Math.random()*canvas.width, -18000, "laser", "3_laser", objectArrays.powerups.length));
objectArrays.powerups.push(new Powerup(Math.random()*canvas.width, -26000, "magnet", "3_magnet", objectArrays.powerups.length));

  setInterval(function() {
    a.clearRect(0, 0, canvas.width, canvas.height);
    a.fillStyle = "black";
    a.fillRect(0, 0, canvas.width, canvas.height);

    a.drawSky();

    a.drawCity();

    a.moveRockets();
    a.drawRockets();
    a.drawExplosions();

    a.drawMissiles();
    a.moveMissiles();

    attacker.deployGhost();
    a.moveGhosts();

    a.drawCarrier();
    a.moveCarrier();

    a.drawLunamods();
    a.moveLunamods();

    a.moveCarrier();

    a.drawPowerups();
    a.movePowerups();

    a.movePlayer();
    a.drawPlayer();

    a.drawMoon();

    a.drawHealthBar();

  }, 30);
};
