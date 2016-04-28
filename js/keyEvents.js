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
