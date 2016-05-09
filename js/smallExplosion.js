var smallExplosion = function (source) {
  var canvas = document.getElementById("screen"),
    ctx = canvas.getContext("2d");

  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(source.x, source.y-16, 14, 0, 360*DEGREES, false);
  ctx.fill();
};

module.exports = smallExplosion;
