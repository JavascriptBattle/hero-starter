
![](https://raw.githubusercontent.com/JavascriptBattle/javascript-battle-website/master/public/img/black-knight.png)

#Javascript Battle - Hero Starter Repo#

---
##Rules##

If you want to update your hero, you will benefit from knowing a little more about the rules of the game. Below, you will find detailed descriptions of the different aspects of the game logic.

###Win Conditions###

The game is decided in one of two ways:
  1. A team eliminates all of the other team's heroes or...
  2. After 1250 turns, a team collects the most diamonds

Your hero has the potential to behave in any way you program it, either by re-writing the code yourself or simply by replacing your hero type with another pre-defined hero type. Every change you make could alter the outcome of the game. If you program your hero to be a Selfish Diamond Miner, for example, then you will likely rank high in the diamond mines captured category, but will not be helping your team, possibly causing a loss in your stats. The win conditions are important to keep in mind as you think about how you want to program your hero.

###Turns###

Several things happen on each turn. Let's take a single turn from your hero as an example, and walk through the steps.

1. The first question we ask on your hero's turn is whether or not the game is over. If it is, well, then that's it.
2. The next question we ask is whether or not your hero is dead.
3. If he or she is not, then we do a few things:
  1. We take the direction that your hero wants to go (ie - the direction that your move function returned) and ask if it is a valid coordinate. If it is, we move your hero to that tile. If not, your hero stays put.
  2. If the tile your hero wants to move to is unoccupied (ie - another hero is not there, there is not an obstruction there, etc), then your hero moves on to that tile.
  3. If the tile your hero wants to move to is the grave of a fallen hero, your hero will rob that grave and be given credit.
  4. If the tile your hero wants to move to is a diamond mine, then your hero will capture the diamond mine, but will not move on to that tile. Additionally, your hero will receive 20 damage because diamond mines are magic.
  5. If the tile your hero wants to move to is a health well, then your hero will receive 30 health, but will not move on to that tile.
  6. If the tile your hero wants to move to is an enemy hero, then your hero will deal 10 damage to the enemy hero, but will not move on to that tile.
  7. If the tile your hero wants to move to is a friendly hero, then the friendly hero will receive 40 health, but your hero will not move on to that tile.
4. If your hero dies after moving, then we update the hero's status to 'dead' and dig a grave where the hero once was.
5. If your hero is still alive after moving, then your hero deals 20 damage to any enemy hero on an adjacent tile. This is in addition to the specific damage done by your hero earlier in the turn.
6. After this, your hero's turn is over and we increment the game's turn and move on to the next hero.

###Statistics###

After a win condition has been met, we keep track of a number of statistics. Your hero will have the following statistics added to his or her total in our database:

  * Wins
  * Losses
  * Deaths
  * Kills
  * Damage Dealt
  * Graves Robbed
  * Health Given
  * Health Recovered
  * Diamonds Earned
  * Mines Captured
