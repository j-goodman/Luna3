var ghosts = require('../objectArrays.js').ghosts;
var Ghost = require('../constructors/ghost.js');

var attacker = {
  rate: 240,
  deployGhost: function () {
    var dice = Math.round(Math.random()*attacker.rate);
    if (dice < 2) {
      ghosts.push(new Ghost(450, 500, Math.round(Math.random()*4)*30+210, ghosts.length));
    }
    if (this.rate < 180 && Math.random()*1600 < 4) {
      console.log("GO");
      this.burst();
    }
  },
  burst: function () {
    var direction = (Math.random()*4)*30+210;
    for (var i=0; i<12; i++) {
      ghosts.push(new Ghost(450, 500, (direction+Math.random()*45)-22.5, ghosts.length));
    }
  }
};

module.exports = attacker;
