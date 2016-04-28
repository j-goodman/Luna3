var smallExplosion = function (source) {
  var canvas = document.getElementById("screen"),
    a = canvas.getContext("2d");
    
  a.fillStyle = "#ffffff";
  a.beginPath();
  a.arc(source.x, source.y-16, 14, 0, 360*DEGREES, false);
  a.fill();
};

module.exports = smallExplosion;
