# Luna3 #
A missile defense browser game. [[Live Link](http://luna3.space)]

![alt tag](http://i.imgur.com/rw7lKHM.png)

The game uses an 30 millisecond interval to redraw and adjust the position of Singleton Objects, defined as their own objects, and Array Objects, contained in distinct Arrays.

## Singleton Objects ##

![alt tag](http://i.imgur.com/r1RMkEY.png)
* **The player**
  * Sorry folks, one player at a time. The player has associated key events to allow user control, and has a method to push different types of Rocket into the Rocket array, thus firing on the incoming missile.

* Celestial bodies
  * The Earth, Sun, and stars are set on a cycle of rising and setting to keep a consistent background atmosphere.

![alt tag](http://i.imgur.com/KLh64OR.png)
* **The city**
  * The city draws the object of our defenses, as well as keeping track of its remaining hit points.

* Health Bar
  * The health bar draws and updates the HUD on the side of the screen, displaying the player's health and the city's.

* The attacker
  * The attacker is an invisible object responsible for managing the rate of the incoming missiles.

## Array Objects ##

![alt tag](http://i.imgur.com/S2ad3EB.png)

![alt tag](http://i.imgur.com/DpezC2W.png) ![alt tag](http://i.imgur.com/Gzfjp9X.png) ![alt tag](http://i.imgur.com/aQY2mQK.png) ![alt tag](http://i.imgur.com/u5JaRbH.png) ![alt tag](http://i.imgur.com/FWrVqJL.png)

* **Rockets**
  * The basic rocket and its variations are stored in the rocket array. They are only responsible for handling their own gravitational physics -- the collisions are left to the enemy missiles.

* Missiles
  * The incoming missiles. These check for collisions by iterating through the Rockets array, destroying both themselves and the rocket in question if one gets within the collision radius. Like rockets, they also rotate their image based on their direction.

* Ghosts
  * Invisible objects that help the missiles to aim at the city. They handle missile creation directly.

![alt tag](http://i.imgur.com/XuDFpYF.gif)
* **Lunar Landers**
  * These incoming enemies have a control system that keeps them seeking the player's x-coordinate while hovering at their own designated y-coordinate. If they're within range of the player's x, they'll drop missiles. They are never truly destroyed: instead, hitting them enough times changes their x-coordinate to one far enough away that it gives the players a few minutes respite from their attack, giving the impression of a never-ending onslaught. This array only ever has at most two Landers in it.

  ## Drawer and Mover ##

  The drawer and mover functions are contained seperately in their own file: the Drawer takes an object's position and sprite and renders it on the screen. The mover, meanwhile, is responsible for moving the object according to its given rules: for instance, rockets have an x-speed, a y-speed, and a y-accel variable, and the Rocket Mover constantly adjusts their x and y positions based on those factors.
