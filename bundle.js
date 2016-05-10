/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	window.onload = function () {
	  var canvas = document.getElementById("screen"),
	    ctx = canvas.getContext("2d");
	
	DEGREES = (Math.PI / 180);
	RADIANS = (180 / Math.PI);
	
	//REQUIRE GAME OBJECTS
	//Each object is a singleton
	var shield = __webpack_require__(1);
	var attacker = __webpack_require__(2);
	var player = __webpack_require__(7);
	var earth = __webpack_require__(14);
	var sun = __webpack_require__(15);
	var starfield = __webpack_require__(16);
	var carrier = __webpack_require__(17);
	
	//REQUIRE GAME CONSTRUCTORS
	//Each class corresponds to an array
	var Rocket = __webpack_require__(8);
	  var Magnet = __webpack_require__(10);
	  var Clusterbomb = __webpack_require__(11);
	  var Revolver = __webpack_require__(13);
	  var Laser = __webpack_require__(12);
	
	var Explosion = __webpack_require__(6);
	var Powerup = __webpack_require__(18);
	
	var Missile = __webpack_require__(5);
	var Ghost = __webpack_require__(4);
	
	var Lunamod = __webpack_require__(19);
	
	//REQUIRE OBJECT ARRAYS
	//Constructed objects are pushed into Object Arrays to be moved and drawn
	var objectArrays = __webpack_require__(3);
	
	var keyEvents = __webpack_require__(20);
	keyEvents(document, player, shield);
	
	var Drawer = __webpack_require__(21);
	Drawer(canvas, ctx);
	
	var Mover = __webpack_require__(23);
	Mover(canvas, ctx);
	
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
	  objectArrays.lunamods.push(new Lunamod(19900, 80, objectArrays.lunamods.length));
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
	    ctx.moveMissiles();
	    ctx.moveGhosts();
	    ctx.moveLunamods();
	    ctx.movePowerups();
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


/***/ },
/* 1 */
/***/ function(module, exports) {

	var shield = {
	  color: "#ffffff",
	  citysprite: document.getElementById("city"),
	  ruinssprite: document.getElementById("ruins"),
	  health: 24
	};
	
	module.exports = shield;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var ghosts = __webpack_require__(3).ghosts;
	var Ghost = __webpack_require__(4);
	var shield = __webpack_require__(1);
	
	var attacker = {
	  start: 300,
	  rate: 300,
	  deployGhost: function () {
	    this.start -= 1;
	    var dice = Math.round(Math.random()*attacker.rate);
	    if (dice < 2 && shield.health > -1 && this.start < 30) {
	      ghosts.push(new Ghost(450, 500, Math.round(Math.random()*4)*30+210, ghosts.length));
	    }
	    if (Math.random()*4800 < 4) {
	      this.burst();
	    }
	    if (this.start % this.rate === -0) {
	      ghosts.push(new Ghost(450, 500, Math.round(Math.random()*4)*30+210, ghosts.length));
	    }
	  },
	  burst: function () {
	    var direction = (Math.random()*4)*30+210;
	    // for (var i=0; i<4; i++) {
	      ghosts.push(new Ghost(450, 500, (direction+Math.random()*90)-45, ghosts.length));
	    // }
	  }
	};
	
	module.exports = attacker;


/***/ },
/* 3 */
/***/ function(module, exports) {

	var objectArrays = {
	  rockets: [],
	  explosions: [],
	  missiles: [],
	  ghosts: [],
	  lunamods: [],
	  powerups: [],
	};
	
	module.exports = objectArrays;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Missile = __webpack_require__(5);
	var missiles = __webpack_require__(3).missiles;
	var ghosts = __webpack_require__(3).ghosts;
	var shield = __webpack_require__(1);
	
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
	    if (shield.health > -2) {
	      missiles.push(new Missile(this.x, this.y, this.xspeed*(-1), this.yspeed*(-1), missiles.length));
	    }
	    this.destroy();
	  };
	  this.destroy = function () {
	    ghosts[this.idx] = undefined;
	  };
	};
	
	module.exports = Ghost;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Explosion = __webpack_require__(6);
	var Missile = __webpack_require__(5);
	var player = __webpack_require__(7);
	
	var rockets = __webpack_require__(3).rockets;
	var missiles = __webpack_require__(3).missiles;
	var explosions = __webpack_require__(3).explosions;
	var attacker = __webpack_require__(2);
	
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
	  };
	  this.rocketCollide = function () {
	    rockets.forEach(function (rocket, idx) {
	      if (rocket) {
	        if ((rocket.x > this.x-19 && rocket.x < this.x+19) &&
	        (rocket.y > this.y-19 && rocket.y < this.y+19)) {
	          player.score += 5;
	          if (rocket.type === "rocket" || rocket.type === "clusterbomb") {
	            rocket.destroy();
	          }
	          if (rocket.type !== "laser") {
	            this.destroy();
	          }
	          if (attacker.rate >= 88) {
	            attacker.rate -= 7;
	          }
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
	
	module.exports = Missile;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var explosions = __webpack_require__(3).explosions;
	
	var Explosion = function (x, y, index) {
	  this.x = x;
	  this.y = y;
	  this.age = 0;
	  this.dice = 6;
	  this.destroy = function () {
	    explosions.splice(this.index, 1);
	  };
	};
	
	module.exports = Explosion;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var lunamods = __webpack_require__(3).lunamods;
	var powerups = __webpack_require__(3).powerups;
	var carrier = __webpack_require__(17);
	var rockets = __webpack_require__(3).rockets;
	var Rocket = __webpack_require__(8);
	var Magnet = __webpack_require__(10);
	var Clusterbomb = __webpack_require__(11);
	var Laser = __webpack_require__(12);
	var Revolver = __webpack_require__(13);
	
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


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var smallExplosion = __webpack_require__(9);
	var rockets = __webpack_require__(3).rockets;
	
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
	    smallExplosion(this);
	  };
	};
	
	Rocket.prototype.move = function (player) {
	  this.x += this.xspeed;
	  this.y += this.yspeed;
	  this.yspeed += this.yaccel;
	  this.degrees = Math.atan(this.yspeed/this.xspeed)*RADIANS;
	  if (this.xspeed < 0) {
	    this.degrees += 180;
	  }
	  if ( this.y > 500 ) {
	    this.destroy();
	    if (this.x > player.x-16 && this.x < player.x+16) {
	      player.health -= 2;
	    }
	  }
	  switch(this.type) {
	    case "laser":
	      this.checkLaser();
	      if (this.firingLaser) {this.firingLaser++;}
	      if (this.firingLaser && this.firingLaser>8) {
	        this.stopLaser();
	      }
	      break;
	    case "revolver":
	      this.timer -= 5;
	      if (this.timer < 0 ) {
	        this.deployKoopashells();
	      }
	      break;
	    case "koopashell":
	      this.timer -= 1;
	      if (this.timer < 0) {
	        this.destroy();
	      }
	      break;
	    }
	  };
	
	module.exports = Rocket;


/***/ },
/* 9 */
/***/ function(module, exports) {

	var smallExplosion = function (source) {
	  var canvas = document.getElementById("screen"),
	    ctx = canvas.getContext("2d");
	
	  ctx.fillStyle = "#ffffff";
	  ctx.beginPath();
	  ctx.arc(source.x, source.y-16, 14, 0, 360*DEGREES, false);
	  ctx.fill();
	};
	
	module.exports = smallExplosion;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var Rocket = __webpack_require__(8);
	
	var Surrogate = function () {};
	Surrogate.prototype = Rocket.prototype;
	
	var Magnet = function (x, y, degrees, power, idx) {
	  Rocket.call(this, x, y, degrees, power, idx);
	  this.type = "magnet";
	  this.sprite = "3_magnet";
	};
	
	Magnet.prototype = new Surrogate();
	
	module.exports = Magnet;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var smallExplosion = __webpack_require__(9);
	var Rocket = __webpack_require__(8);
	var rockets = __webpack_require__(3).rockets;
	
	var Surrogate = function () {};
	Surrogate.prototype = Rocket.prototype;
	
	var Clusterbomb = function (x, y, degrees, power, idx) {
	  Rocket.call(this, x, y, degrees, power, idx);
	  this.type = "clusterbomb";
	  this.sprite = "3_clusterbomb";
	  this.destroy = function () {
	    smallExplosion(this);
	    rockets[idx] = undefined;
	    for (var i=0; i < 12; i++) {
	      rockets.push(new Rocket(this.x, this.y, Math.random()*360, Math.random()*12, rockets.length));
	    }
	    if (Math.random() < 0.5) {
	      rockets.push(new Clusterbomb(this.x, this.y, Math.random()*360, Math.random()*12, rockets.length));
	    }
	  }.bind(this);
	};
	
	Clusterbomb.prototype = new Surrogate();
	
	module.exports = Clusterbomb;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var Rocket = __webpack_require__(8);
	var missiles = __webpack_require__(3).missiles;
	
	var Surrogate = function () {};
	Surrogate.prototype = Rocket.prototype;
	
	var Laser = function (x, y, degrees, power, idx) {
	  Rocket.call(this, x, y, degrees, power, idx);
	  this.type = "laser";
	  this.sprite = "3_laser";
	  this.target = null;
	  this.checkLaser = function () {
	    missiles.forEach(function (missile, idx) {
	      if (missile) {
	        if ((missile.x > this.x-130 && missile.x < this.x+130) &&
	        (missile.y > this.y-130 && missile.y < this.y+130)) {
	          this.fireLaser(missile);
	        }
	      }
	    }.bind(this));
	  };
	  this.firingLaser = 0;
	  this.fireLaser = function (missile) {
	    this.firingLaser += 1;
	    this.target = missile;
	  };
	  this.stopLaser = function () {
	    this.firingLaser = 0;
	    this.target.destroy();
	  };
	};
	
	Laser.prototype = new Surrogate();
	
	module.exports = Laser;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var Rocket = __webpack_require__(8);
	var rockets = __webpack_require__(3).rockets;
	
	var Surrogate = function () {};
	Surrogate.prototype = Rocket.prototype;
	
	var Revolver = function (x, y, degrees, power, idx) {
	  Rocket.call(this, x, y, degrees, power, idx);
	  this.type = "revolver";
	  this.sprite = "3_revolver";
	  this.timer = 30;
	  this.deployKoopashells = function () {
	    rockets.push(new Koopashell(this.x, this.y, 270+this.timer, (Math.sqrt(-this.timer)*2), rockets.length));
	    rockets.push(new Koopashell(this.x, this.y, 0+this.timer, (Math.sqrt(-this.timer)*2), rockets.length));
	    rockets.push(new Koopashell(this.x, this.y, 90+this.timer, (Math.sqrt(-this.timer)*2), rockets.length));
	    rockets.push(new Koopashell(this.x, this.y, 180+this.timer, (Math.sqrt(-this.timer)*2), rockets.length));
	  };
	};
	
	Revolver.prototype = new Surrogate();
	Revolver.prototype.constructor = Revolver;
	
	var Koopashell = function (x, y, degrees, power, idx) {
	  this.x = x;
	  this.y = y;
	  this.timer = 3;
	  this.type = "koopashell";
	  this.sprite = "3_koopashell";
	  this.yaccel = 0;
	  this.idx = idx;
	  this.degrees = degrees;
	  this.power = power;
	  this.xspeed = this.power * Math.cos((this.degrees)*DEGREES);
	  this.yspeed = this.power * Math.sin((this.degrees)*DEGREES);
	  this.destroy = function () {
	    rockets[idx] = undefined;
	  };
	  this.move = Rocket.prototype.move;
	};
	
	module.exports = Revolver;


/***/ },
/* 14 */
/***/ function(module, exports) {

	var earth = {
	  y: 600,
	  timer: 0,
	  sprite: document.getElementById("earth"),
	  cloudsprite: document.getElementById("cloudcover"),
	  explosions: [{time: 3000, x: 60, y: 200},
	               {time: 3060, x: 80, y: 60},
	               {time: 3070, x: 160, y: 10},
	               {time: 3090, x: 50, y: 180},
	               {time: 3150, x: 200, y: 80},
	               {time: 3160, x: 90, y: 120},
	               {time: 3190, x: 200, y: 200},
	               {time: 3195, x: 200, y: 250},
	               {time: 3200, x: 90, y: 90},
	               {time: 3220, x: 60, y: 100},
	               {time: 3260, x: 80, y: 30},
	               {time: 3270, x: 180, y: 130},
	               {time: 3290, x: 220, y: 30},
	               {time: 3320, x: 180, y: 270},
	               {time: 3360, x: 160, y: 10},
	               {time: 3380, x: 50, y: 180},
	               {time: 3390, x: 150, y: 100},
	               {time: 3400, x: 220, y: 240},
	               {time: 3420, x: 200, y: 80},
	               {time: 3425, x: 210, y: 85},
	               {time: 3430, x: 90, y: 120},
	               {time: 3440, x: 280, y: 200},
	               {time: 3440, x: 220, y: 260},
	               {time: 3460, x: 110, y: 140},
	               {time: 3470, x: 200, y: 200},
	               {time: 3480, x: 100, y: 130},
	               {time: 3490, x: 100, y: 140}, ]
	};
	
	module.exports = earth;


/***/ },
/* 15 */
/***/ function(module, exports) {

	var sun = {
	  y: -400
	};
	
	module.exports = sun;


/***/ },
/* 16 */
/***/ function(module, exports) {

	starfield = [];
	
	for (var i = 0; i < 75; i++) {
	  var randX = Math.round(Math.random()*900);
	  var randY = Math.round(Math.random()*900);
	  var rad = Math.round(Math.random()*0.6+1);
	  starfield.push([randX, randY, rad]);
	}
	
	module.exports = starfield;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var rockets = __webpack_require__(3).rockets;
	var powerups = __webpack_require__(3).powerups;
	var missiles = __webpack_require__(3).missiles;
	var explosions = __webpack_require__(3).explosions;
	var player = __webpack_require__(7);
	var Powerup = __webpack_require__(18);
	var Missile = __webpack_require__(5);
	var Explosion = __webpack_require__(6);
	
	var carrier = {
	  x: -32000,
	  y: 100,
	  xspeed: 6,
	  destroyed: false,
	  sprite: "carrier_3",
	  rocketCollide: function (player) {
	    rockets.forEach(function (rocket, idx) {
	      if (rocket) {
	        if ((rocket.x > this.x-36 && rocket.x < this.x+36) &&
	        (rocket.y > this.y-36 && rocket.y < this.y+36)) {
	          player.score += 100;
	          rocket.destroy();
	          this.destroy(player);
	        }
	      }
	    }.bind(this));
	  },
	  destroy: function (player) {
	      for (var i=0; i<5; i++) {
	        var dice = Math.random();
	        this.destroyed = true;
	        if (dice > 0.75) {
	          powerups.push(new Powerup(this.x+(Math.random()*64)-32, this.y, "laser", "3_laser", powerups.length, player));
	        } else if (dice > 0.5) {
	          powerups.push(new Powerup(this.x+(Math.random()*64)-32, this.y, "magnet", "3_magnet", powerups.length, player));
	        } else if (dice > 0.25) {
	          powerups.push(new Powerup(this.x+(Math.random()*64)-32, this.y, "revolver", "3_revolver", powerups.length, player));
	        } else {
	          powerups.push(new Powerup(this.x+(Math.random()*64)-32, this.y, "clusterbomb", "3_clusterbomb", powerups.length, player));
	        }
	      }
	
	      explosions.push(new Explosion(this.x, this.y, explosions.length));
	      explosions.push(new Explosion(this.x+16, this.y+16, explosions.length));
	      explosions.push(new Explosion(this.x-22, this.y+8, explosions.length));
	
	
	      this.x = 30000;
	
	    },
	    move: function (canvas, player) {
	      carrier.x += carrier.xspeed;
	      if (carrier.x > 30000) {
	        carrier.xspeed = -6;
	        carrier.sprite = "carrier_9";
	        carrier.destroyed = false;
	        carrier.y = Math.random()*canvas.height/2+12;
	      } else if (carrier.x < -20000) {
	        carrier.xspeed = 6;
	        carrier.sprite = "carrier_3";
	        carrier.destroyed = false;
	        carrier.y = Math.random()*canvas.height/2+12;
	      }
	      carrier.rocketCollide(player);
	    },
	    draw: function (ctx) {
	      if (!carrier.destroyed) {
	        ctx.drawImage(document.getElementById(carrier.sprite), carrier.x, carrier.y, 64, 48);
	      }
	    }
	};
	
	module.exports = carrier;


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var powerups = __webpack_require__(3).powerups;
	
	var Powerup = function (x, y, type, sprite, idx, player) {
	  this.x = x;
	  this.y = y;
	  this.idx = idx;
	  this.type = type;
	  this.sprite = sprite;
	  this.yspeed = Math.random()*(-12);
	  this.yaccel = 0.2;
	  this.playerCollide = function () {
	    if ((player.x > this.x-19 && player.x < this.x+19) &&
	    (player.y > this.y-19 && player.y < this.y+19)) {
	      if (player.score > 4) { player.score -= 5; }
	      this.destroy();
	    }
	  };
	  this.destroy = function () {
	    if (player.ammoStore) {
	      if (player.ammoStore[this.type]) {
	        player.ammoStore[this.type] += 1;
	      } else {
	        player.showShift = 3;
	        player.ammoStore[this.type] = 1;
	      }
	      powerups[this.idx] = undefined;
	    }
	  };
	};
	
	module.exports = Powerup;


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var rockets = __webpack_require__(3).rockets;
	var explosions = __webpack_require__(3).explosions;
	var powerups = __webpack_require__(3).powerups;
	var Explosion = __webpack_require__(6);
	var Powerup = __webpack_require__(18);
	var player = __webpack_require__(7);
	var lunamods = __webpack_require__(3).lunamods;
	
	var Lunamod = function (x, y, idx) {
	  this.x = x;
	  this.y = y;
	  this.yspeed = 0;
	  this.xspeed = 0;
	  this.yaccel = 0;
	  this.xaccel = 0;
	  this.hoverHeight = 100;
	  this.ammo = 8;
	  this.rocketCollide = function () {
	    rockets.forEach(function (rocket) {
	      if (rocket) {
	        if ((rocket.x > this.x-32 && rocket.x < this.x+32) &&
	        (rocket.y < this.y+32 && rocket.y > this.y-32)) {
	          player.score += 50;
	          rocket.destroy();
	          this.destroy();
	        }
	      }
	    }.bind(this));
	  };
	  this.destroy = function () {
	    if (this.hoverHeight < 400) {
	      this.hoverHeight += 40;
	      this.y += 48;
	      explosions.push(new Explosion(this.x, this.y, explosions.length));
	    } else {
	      var dice = Math.random();
	      for (i=0; i < dice*8; i++) {
	        if (dice > 0.75) {
	          powerups.push(new Powerup(this.x+(Math.random()*64)-32, this.y-16, "laser", "3_laser", powerups.length, player));
	        } else if (dice > 0.5) {
	          powerups.push(new Powerup(this.x+(Math.random()*64)-32, this.y-16, "magnet", "3_magnet", powerups.length, player));
	        } else if (dice > 0.25) {
	          powerups.push(new Powerup(this.x+(Math.random()*64)-32, this.y-16, "revolver", "3_revolver", powerups.length, player));
	        } else {
	          powerups.push(new Powerup(this.x+(Math.random()*64)-32, this.y-16, "clusterbomb", "3_clusterbomb", powerups.length, player));
	        }
	        dice += 0.5;
	        if (dice>1) {dice--;}
	      }
	      if (lunamods.length <= 1) {
	        lunamods.push(new Lunamod(-54000, 80, lunamods.length));
	      }
	      explosions.push(new Explosion(this.x, this.y, explosions.length));
	      explosions.push(new Explosion(this.x+16, this.y+16, explosions.length));
	      explosions.push(new Explosion(this.x-22, this.y+8, explosions.length));
	      this.ammo = 8;
	      this.hoverHeight = 100;
	      this.x = 30000;
	    }
	  };
	};
	
	module.exports = Lunamod;


/***/ },
/* 20 */
/***/ function(module, exports) {

	var keyEvents = function (document, player, shield) {
	  document.onkeydown = function (e) {
	    switch(e.keyCode) {
	    case 68: // d
	    case 39: //right
	      if (player.mobile) {player.xspeed = 3;}
	        else {player.spin = 4;}
	      break;
	    case 65: // a
	    case 37: //left
	      if (player.mobile) {player.xspeed = -3;}
	        else {player.spin = -4;}
	      break;
	    case 87: // w
	    case 38: //up
	      player.mobile = true;
	      if (player.health > 0) {
	        player.y = 482;
	      }
	      break;
	    case 83: // s
	    case 40: //down
	      player.xspeed = 0;
	      player.mobile = false;
	      player.y = 488;
	      break;
	    case 32: //space
	      if (player.cooldown < 0 && player.overheat < 300) {
	        player.fire(player.x, player.y, player.angle, player.power);
	        player.cooldown = 16;
	        player.overheat += 100;
	      }
	      break;
	    }
	  };
	
	  document.onkeyup = function (e) {
	    switch(e.keyCode) {
	    case 68: // d
	    case 39: //right
	      if (player.xspeed > 0) { player.xspeed = 0; }
	      if (!player.mobile) {player.spin = 0;}
	      break;
	    case 65: // a
	    case 37: //left
	      if (player.xspeed < 0) { player.xspeed = 0; }
	      if (!player.mobile) {player.spin = 0;}
	      break;
	    case 32: //space
	      if (player.ready) { player.fire(); }
	      break;
	    case 16: //shift
	      if (player.health > 0) {
	        player.toggleRocket();
	        player.showCount = 1.8;
	        while (player.ammoStore[player.ammoType] <= 0) {
	          player.toggleRocket();
	        }
	      }
	      break;
	    case 13: //ENTER
	      if (shield.health < 0 || player.health <= 0) {
	        window.resetGame();
	      }
	      break;
	    }
	  };
	};
	
	module.exports = keyEvents;


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	drawer = function (canvas, ctx) {
	var shield = __webpack_require__(1);
	var player = __webpack_require__(7);
	var earth = __webpack_require__(14);
	var sun = __webpack_require__(15);
	var starfield = __webpack_require__(16);
	var carrier = __webpack_require__(17);
	var rockets = __webpack_require__(3).rockets;
	var explosions = __webpack_require__(3).explosions;
	var missiles = __webpack_require__(3).missiles;
	var ghosts = __webpack_require__(3).ghosts;
	var lunamods = __webpack_require__(3).lunamods;
	var powerups = __webpack_require__(3).powerups;
	var attacker = __webpack_require__(2);
	
	var Explosion = __webpack_require__(22);
	
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


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var explosions = __webpack_require__(3).explosions;
	
	var Explosion = function (x, y, index) {
	  this.x = x;
	  this.y = y;
	  this.age = 0;
	  this.dice = 6;
	  this.destroy = function () {
	    explosions.splice(this.index, 1);
	  };
	};
	
	module.exports = Explosion;


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var mover = function (canvas, ctx) {
	
	  var shield = __webpack_require__(1);
	  var player = __webpack_require__(7);
	  var carrier = __webpack_require__(17);
	
	  var Missile = __webpack_require__(5);
	
	  var rockets = __webpack_require__(3).rockets;
	  var explosions = __webpack_require__(3).explosions;
	  var missiles = __webpack_require__(3).missiles;
	  var ghosts = __webpack_require__(3).ghosts;
	  var lunamods = __webpack_require__(3).lunamods;
	  var powerups = __webpack_require__(3).powerups;
	
	  ctx.moveMissiles = function () {
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
	
	  ctx.moveGhosts = function () {
	    ghosts.forEach(function (ghost) {
	      if (ghost) {
	        ghost.x += ghost.xspeed;
	        ghost.y += ghost.yspeed;
	        if ( ghost.y < -32 || ghost.x < -32 || ghost.x > canvas.width+32) { ghost.deploy(); }
	        if ( ghost.y > canvas.height+32 ) { ghost.destroy(); }
	      }
	    });
	  };
	
	  ctx.movePowerups = function () {
	    powerups.forEach(function (powerup) {
	      if (powerup) {
	        if (powerup.y < 490) {
	          powerup.y += powerup.yspeed;
	        } else {
	          powerup.y = 490;
	        }
	        if (powerup.yspeed < 4) {
	          powerup.yspeed += powerup.yaccel;
	        }
	        powerup.playerCollide();
	      }
	    });
	  };
	
	  ctx.moveLunamods = function () {
	    lunamods.forEach(function (lunamod) {
	      //HOVER
	      if (lunamod.y > lunamod.hoverHeight) {
	        lunamod.yaccel = -0.5;
	      } else if (lunamod.y < lunamod.hoverHeight) {
	        lunamod.yaccel = 0.1;
	      }
	      //SEEK X TARGET
	      if (lunamod.x > lunamod.x) {
	        lunamod.xaccel = -0.5;
	      } else if (lunamod.x < lunamod.x) {
	        lunamod.xaccel = 0.5;
	      }
	      //DROP AND RISE
	      var dice = Math.random()*900;
	      //FOLLOW PLAYER
	      if (dice < 200) {
	        if (lunamod.x > player.x) {
	          lunamod.xaccel = -0.5;
	        } else {
	          lunamod.xaccel = 0.5;
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
	      //REGULATE HEIGHT WHEN OFF SCREEN
	      if (lunamod.x < -100 || lunamod.x > canvas.width+100) {
	        lunamod.y = lunamod.hoverHeight;
	      }
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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map