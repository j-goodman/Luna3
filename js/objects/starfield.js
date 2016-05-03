starfield = [];

for (var i = 0; i < 75; i++) {
  var randX = Math.round(Math.random()*900);
  var randY = Math.round(Math.random()*900);
  var rad = Math.round(Math.random()*0.6+1);
  starfield.push([randX, randY, rad]);
}

module.exports = starfield;
