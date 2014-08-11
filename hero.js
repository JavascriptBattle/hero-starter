/* 
  The only function that is required in this file is the "move" function

  You MUST export the move function, in order for your code to run

  The "move" function must return "North", "South", "East", "West", or "Stay"
  
  The "move" function should accept two arguments that the website will be passing in: 
    - a "gameData" object which holds all information about the current state
      of the battle

    - a "helpers" object, which contains useful helper functions
      - check out the helpers.js file to see what is available to you

    (the details of these objects can be found on javascriptbattle.com/rules)

  This file contains four example heroes that you can use as is, adapt, or
  take ideas from and implement your own version. Simply uncomment your desired
  hero and see what happens in tomorrow's battle!

  Such is the power of Javascript!!!

*/
/*
// Miner
var move = function(gameData, helpers) {
  // Here, we ask if your hero's health is below 50
  if (gameData.activeHero().health <= 50){
    // If it is, head towards the nearest health well
    return helpers.findNearestHealthWell(gameData);
  } else {
    // Otherwise, go mine some diamonds!!!
    return helpers.findNearestDiamondMine(gameData);
  }
};
*/
/*
// Aggressor
var move = function(gameData, helpers) {
  // Here, we ask if your hero's health is below 30
  if (gameData.activeHero().health <= 30){
    // If it is, head towards the nearest health well
    return helpers.findNearestHealthWell(gameData);
  } else {
    // Otherwise, go attack someone...anyone.
    return helpers.findNearestEnemy(gameData);
  }
};
*/
/*
// Health Nut
var move = function(gameData, helpers) {
  // Here, we ask if your hero's health is below 75
  if (gameData.activeHero().health <= 75){
    // If it is, head towards the nearest health well
    return helpers.findNearestHealthWell(gameData);
  } else {
    // Otherwise, go mine some diamonds!!!
    return helpers.findNearestDiamondMine(gameData);
  }
};
*/
// Balanced
var move = function(gameData, helpers) {
  // Here, we ask if your hero's health is below 50
  if (gameData.activeHero().health <= 50){
    // If it is, head towards the nearest health well
    helpers.findNearestHealthWell(gameData);
  } else {
    // Otherwise, we want to know what's closer: a mine or an enemy
    var distanceToDiamondMine = helpers.findNearestDiamondMine(gameData).distance;
    var distanceToEnemy = helpers.findNearestEnemyWithLowHealth(gameData, gameData.activeHero().health).distance;
    if (distanceToDiamondMine <= distanceToEnemy){
      // If the mine is closer, go mine some diamonds!!!
      return helpers.findNearestDiamondMine(gameData);
    } else {
      // Otherwise, go attack the enemy - but only if that enemy has lower health than your hero
      return helpers.findNearestEnemyWithLowHealth(gameData, gameData.activeHero().health);
    }
  }
};
// Export the move function here
module.exports = move;
