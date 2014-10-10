/* 

  The only function that is required in this file is the "move" function

  You MUST export the move function, in order for your code to run
  So, at the bottom of this code, keep the line that says:

  module.exports = move;

  The "move" function must return "North", "South", "East", "West", or "Stay"
  (Anything else will be interpreted by the game as "Stay")
  
  The "move" function should accept two arguments that the website will be passing in: 
    - a "gameData" object which holds all information about the current state
      of the battle

    - a "helpers" object, which contains useful helper functions
      - check out the helpers.js file to see what is available to you

    (the details of these objects can be found on javascriptbattle.com/#rules)

  This file contains four example heroes that you can use as is, adapt, or
  take ideas from and implement your own version. Simply uncomment your desired
  hero and see what happens in tomorrow's battle!

  Such is the power of Javascript!!!

*/

//TL;DR: If you are new, just uncomment the 'move' function that you think sounds like fun!
//       (and comment out all the other move functions)


// // The "Northerner"
// // This hero will walk North.  Always.
// var move = function(gameData, helpers) {
//   var myHero = gameData.activeHero;
//   return 'North';
// };

// // The "Blind Man"
// // This hero will walk in a random direction each turn.
// var move = function(gameData, helpers) {
//   var myHero = gameData.activeHero;
//   var choices = ['North', 'South', 'East', 'West'];
//   return choices[Math.floor(Math.random()*4)];
// };

// // The "Priest"
// // This hero will heal nearby friendly champions.
// var move = function(gameData, helpers) {
//   var myHero = gameData.activeHero;
//   if (myHero.health < 60) {
//     return helpers.findNearestHealthWell(gameData);
//   } else {
//     return helpers.findNearestTeamMember(gameData);
//   }
// };

// // The "Unwise Assassin"
// // This hero will attempt to kill the closest enemy hero. No matter what.
// var move = function(gameData, helpers) {
//   var myHero = gameData.activeHero;
//   if (myHero.health < 30) {
//     return helpers.findNearestHealthWell(gameData);
//   } else {
//     return helpers.findNearestEnemy(gameData);
//   }
// };

// // The "Careful Assassin"
// // This hero will attempt to kill the closest weaker enemy hero.
// var move = function(gameData, helpers) {
//   var myHero = gameData.activeHero;
//   if (myHero.health < 50) {
//     return helpers.findNearestHealthWell(gameData);
//   } else {
//     return helpers.findNearestWeakerEnemy(gameData);
//   }
// };

// // The "Safe Diamond Miner"
// var move = function(gameData, helpers) {
//   var myHero = gameData.activeHero;
// 
//   //Get stats on the nearest health well
//   var healthWellStats = helpers.findNearestObjectDirectionAndDistance(gameData.board, myHero, function(boardTile) {
//     if (boardTile.type === 'HealthWell') {
//       return true;
//     }
//   });
//   var distanceToHealthWell = healthWellStats.distance;
//   var directionToHealthWell = healthWellStats.direction;
//   
// 
//   if (myHero.health < 40) {
//     //Heal no matter what if low health
//     return directionToHealthWell;
//   } else if (myHero.health < 100 && distanceToHealthWell === 1) {
//     //Heal if you aren't full health and are close to a health well already
//     return directionToHealthWell;
//   } else {
//     //If healthy, go capture a diamond mine!
//     return helpers.findNearestNonTeamDiamondMine(gameData);
//   }
// };

// // The "Selfish Diamond Miner"
// // This hero will attempt to capture diamond mines (even those owned by teammates).
// var move = function(gameData, helpers) {
//   var myHero = gameData.activeHero;

//   //Get stats on the nearest health well
//   var healthWellStats = helpers.findNearestObjectDirectionAndDistance(gameData.board, myHero, function(boardTile) {
//     if (boardTile.type === 'HealthWell') {
//       return true;
//     }
//   });

//   var distanceToHealthWell = healthWellStats.distance;
//   var directionToHealthWell = healthWellStats.direction;

//   if (myHero.health < 40) {
//     //Heal no matter what if low health
//     return directionToHealthWell;
//   } else if (myHero.health < 100 && distanceToHealthWell === 1) {
//     //Heal if you aren't full health and are close to a health well already
//     return directionToHealthWell;
//   } else {
//     //If healthy, go capture a diamond mine!
//     return helpers.findNearestUnownedDiamondMine(gameData);
//   }
// };

// // The "Coward"
// // This hero will try really hard not to die.
// var move = function(gameData, helpers) {
//   return helpers.findNearestHealthWell(gameData);
// }

// The "Paladin"
// This hero will prioritize healing nearby freindlies before seeking out weaker enemies.
var move = function(gameData, helpers) {
    var myHero = gameData.activeHero;
    // locate the nearest healthwell
    var hw = helpers.findNearestObjectDirectionAndDistance(gameData.board, myHero, function(tile) {
      if (tile.type === 'HealthWell') {
        return true;
      }
    });
    var hwdis = hw.distance;
    var hwdir = hw.direction;
    // console.log("Well: " + hwdir + ", " + hwdis);

    // locate the nearest friendly
    var friend = helpers.findNearestObjectDirectionAndDistance(gameData.board, myHero, function(tile) {
      if (tile.type === 'Hero' && tile.team === myHero.team) {
        return true;
      }
    });
    var tm = (friend) ? gameData.board.tiles[friend.coords[0]][friend.coords[1]] : false;
    var tmdis = (friend) ? friend.distance : 99;
    var tmdir = (friend) ? friend.direction : "N/A";
    // console.log("Teammate: " + tm.health + ", " + tmdir + ", " + tmdis);

    var enemyTarget = helpers.findNearestObjectDirectionAndDistance(gameData.board, myHero, function(tile) {
      if (tile.type === 'Hero' && tile.team !== myHero.team) {
        return true;
      }
    });
    var enemy = (enemyTarget) ? gameData.board.tiles[enemyTarget.coords[0]][enemyTarget.coords[1]] : false;
    var enemydis = (enemyTarget) ? enemyTarget.distance : 99;
    var enemydir = (enemyTarget) ? enemyTarget.direction : "N/A";
    var weakerEnemy = (enemy) ? enemy.health < myHero.health : false;
    var canKillEnemyInNextTurn = (enemy) ? enemy.health <= 30 && enemydis === 1 : false;
    // console.log("Enemy: " + enemy.health + ", " + enemydir + ", " + enemydis);


    // console.log("My Health: " + myHero.health);
    // first get close to a teammate, then go on the offensive
    if (canKillEnemyInNextTurn && myHero.health > 20) {
      // console.log("Killing the " + enemydir + " enemy!");
      return enemydir;
    } else if (tm && ((myHero.health === 100 & tm.health < 100 && tmdis <= 6) || (tm.health < 50 && tmdis === 1))) {
      // console.log("Going to heal the "+ tmdir +" teamate!");
      return tmdir;
    } else if (myHero.health < 70) {
      // console.log("Heading to "+hwdir+" healthwell!");
      return hwdir;
    } else if (enemy) {
      // console.log("Going after the "+enemydir+" enemy!");
      return enemydir;
    } else {
      // console.log("Going to take over a mine!");
      return helpers.findNearestUnownedDiamondMine(gameData);
    }
}

// Export the move function here
module.exports = move;
