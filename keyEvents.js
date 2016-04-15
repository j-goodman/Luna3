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
      if (player.health > 0) {
        player.y = 482;
      }
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
    case 16: //shift
      if (player.health > 0) {
        player.toggleRocket();
        player.showCount = 1.8;
        while (player.ammoStore[player.ammoType] <= 0) {
          player.toggleRocket();
        }
      }
      break;
    }
  };
};

module.exports = keyEvents;
