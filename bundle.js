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
	    } else if (player.ammoType === "clusterbomb") {
	      rockets.push(new Clusterbomb(x, y, direction, speed, rockets.length));
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
	    a.fillStyle = "#ffffff";
	    a.beginPath();
	    a.arc(this.x, this.y-16, 14, 0, 360*DEGREES, false);
	    a.fill();
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
	
	var Clusterbomb = function (x, y, degrees, power, idx) {
	  this.x = x;
	  this.y = y;
	  this.type = "clusterbomb";
	  this.sprite = "3_clusterbomb";
	  this.yaccel = 0.25;
	  this.idx = idx;
	  this.degrees = degrees;
	  this.power = power;
	  this.xspeed = this.power * Math.cos((this.degrees)*DEGREES);
	  this.yspeed = this.power * Math.sin((this.degrees)*DEGREES);
	  this.destroy = function () {
	    rockets[idx] = undefined;
	    for (var i=0; i < 12; i++) {
	      rockets.push(new Rocket(this.x, this.y, Math.random()*360, Math.random()*21, rockets.length));
	    }
	    if (Math.random() < 0.5) {
	      rockets.push(new Clusterbomb(this.x, this.y, Math.random()*360, Math.random()*21, rockets.length));
	    }
	  }.bind(this);
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
	          if (rocket.type === "clusterbomb") {
	            rockets[idx].destroy();
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
	      var dice = Math.random();
	      for (i=0; i < dice*6.25; i++) {
	        if (dice > 0.5) {
	          powerups.push(new Powerup(this.x+(Math.random()*64)-32, this.y-16, "clusterbomb", "3_clusterbomb", powerups.length));
	        } else {
	          powerups.push(new Powerup(this.x+(Math.random()*64)-32, this.y-16, "magnet", "3_magnet", powerups.length));
	        }
	        dice += 0.5;
	        if (dice>1) {dice--;}
	      }
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
	
	var keyEvents = __webpack_require__(1);
	keyEvents(document, player);
	
	var drawer = __webpack_require__(2);
	drawer(canvas, a, shield, player, rockets, explosions, missiles, ghosts, lunamods, earth, sun, starfield, powerups, Explosion);
	
	var mover = __webpack_require__(3);
	mover(canvas, a, shield, player, rockets, explosions, missiles, ghosts, lunamods, powerups, Missile);
	
	ghosts.push(new Ghost(450, 500, 240, ghosts.length));
	ghosts.push(new Ghost(450, 500, 300, ghosts.length));
	lunamods.push(new Lunamod(33400, 80, lunamods.length));
	powerups.push(new Powerup(Math.random()*canvas.width, -2000, "clusterbomb", "3_clusterbomb", powerups.length));
	
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


/***/ },
/* 1 */
/***/ function(module, exports) {

	
	var keyEvents = function (document, player) {
	  document.onkeydown = function (e) {
	    switch(e.keyCode) {
	    case 37: //right
	      if (player.mobile) {player.xspeed = -3;}
	        else {player.spin = -4;}
	      break;
	    case 39: //left
	      if (player.mobile) {player.xspeed = 3;}
	        else {player.spin = 4;}
	      break;
	    case 38: //up
	      player.mobile = true;
	      player.y = 482;
	      break;
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
	    case 37: //right
	      if (player.xspeed < 0) { player.xspeed = 0; }
	      if (!player.mobile) {player.spin = 0;}
	      break;
	    case 39: //left
	      if (player.xspeed > 0) { player.xspeed = 0; }
	      if (!player.mobile) {player.spin = 0;}
	      break;
	    case 32: //space
	      if (player.ready) { player.fire(); }
	      break;
	    case 16: //SHIFT
	      player.toggleRocket();
	      while (player.ammoStore[player.ammoType] <= 0) {
	        player.toggleRocket();
	      }
	      break;
	    }
	  };
	};
	
	module.exports = keyEvents;


/***/ },
/* 2 */
/***/ function(module, exports) {

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
	    } else if (player.ammoType === "clusterbomb") {
	      ammoSprite = "3_clusterbomb";
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


/***/ },
/* 3 */
/***/ function(module, exports) {

	mover = function (canvas, a, shield, player, rockets, explosions, missiles, ghosts, lunamods, powerups, Missile) {
	  a.movePlayer = function () {
	    player.x += player.xspeed;
	    player.angle += player.spin;
	    if (player.angle < 210) {player.angle = 210;}
	    if (player.angle > 330) {player.angle = 330;}
	    player.cooldown -= 1;
	    if (player.overheat > 2) {
	      player.overheat -= 3;
	    }
	    if (player.ammoStore["rocket"] !== 2) {
	      player.ammoStore["rocket"] = 2;
	    }
	  };
	
	  a.moveRockets = function () {
	    rockets.forEach(function (rocket) {
	      if (rocket) {
	        rocket.x += rocket.xspeed;
	        rocket.y += rocket.yspeed;
	        rocket.yspeed += rocket.yaccel;
	        rocket.degrees = Math.atan(rocket.yspeed/rocket.xspeed)*RADIANS;
	        if (rocket.xspeed < 0) {
	          rocket.degrees += 180;
	        }
	        if ( rocket.y > 500 ) {
	          rocket.destroy();
	          if (rocket.x > player.x-16 && rocket.x < player.x+16) {
	            player.health -= 2;
	          }
	        }
	      }
	    });
	  };
	
	  a.moveMissiles = function () {
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
	
	  a.moveGhosts = function () {
	    ghosts.forEach(function (ghost) {
	      if (ghost) {
	        ghost.x += ghost.xspeed;
	        ghost.y += ghost.yspeed;
	        if ( ghost.y < -32 || ghost.x < -32 || ghost.x > canvas.width+32) { ghost.deploy(); }
	        if ( ghost.y > canvas.height+32 ) { ghost.destroy(); }
	      }
	    });
	  };
	
	  a.movePowerups = function () {
	    powerups.forEach(function (powerup) {
	      if (powerup) {
	        if (powerup.y < 496) {
	          powerup.y += powerup.yspeed;
	        } else {
	          powerup.y = 496;
	        }
	        if (powerup.yspeed < 4) {
	          powerup.yspeed += powerup.yaccel;
	        }
	        powerup.playerCollide();
	      }
	    });
	  };
	
	  a.moveLunamods = function () {
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