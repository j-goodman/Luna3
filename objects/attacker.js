var ghosts = require('../objectArrays.js').ghosts;
var Ghost = require('../constructors/ghost.js');
var shield = require('./shield.js');

var attacker = {
  start: 300,
  rate: 300,
  deployGhost: function () {
    this.start -= 1;
    var dice = Math.round(Math.random()*attacker.rate);
    if (dice < 2 && shield.health > -6 && this.start < 30) {
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
