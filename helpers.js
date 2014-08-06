var Game = require('./Game.js');

var helpers = {};

// Returns false if the given coordinates are out of range
helpers.validCoordinates = function(board, distanceFromTop, distanceFromLeft) {
  return (!(distanceFromTop < 0 || distanceFromLeft < 0 ||
      distanceFromTop > board.lengthOfSide - 1 || distanceFromLeft > board.lengthOfSide - 1));
};

// Returns the tile [direction] (North, South, East, or West) of the given X/Y coordinate
helpers.getTileNearby = function(board, distanceFromTop, distanceFromLeft, direction) {

  // These are the X/Y coordinates
  var fromTopNew = distanceFromTop;
  var fromLeftNew = distanceFromLeft;

  // This associates the cardinal directions with an X or Y coordinate
  if (direction === 'North') {
    fromTopNew -= 1;
  } else if (direction === 'East') {
    fromLeftNew += 1;
  } else if (direction === 'South') {
    fromTopNew += 1;
  } else if (direction === 'West') {
    fromLeftNew -= 1;
  } else {
    return false;
  }

  // If the coordinates of the tile nearby are valid, return the tile object at those coordinates
  if (helpers.validCoordinates(board, fromTopNew, fromLeftNew)) {
    return board.tiles[fromTopNew][fromLeftNew];
  } else {
    return false;
  }
};

// Returns an object with certain properties of the nearest object we are looking for
helpers.findNearestObjectDirectionAndDistance = function(fromTile, toTileType, board) {
  // Storage queue to keep track of places the fromTile has been
  var queue = [];

  //Keeps track of places the fromTile has been for constant time lookup later
  var visited = {};

  // Variable assignments for fromTile's coordinates
  var dft = fromTile.distanceFromTop;
  var dfl = fromTile.distanceFromLeft;

  // Stores the coordinates, the direction fromTile is coming from, and it's location
  var visitInfo = [dft, dfl, 'None', 'START'];

  //Just a unique way of storing each location we've visited
  visited[dft + '|' + dfl] = true;

  // Push the starting tile on to the queue
  queue.push(visitInfo);

  // While the queue has a length
  while (queue.length > 0) {

    // Shift off first item in queue
    var coords = queue.shift();

    // Reset the coordinates to the shifted object's coordinates
    var dft = coords[0];
    var dfl = coords[1];

    // Loop through cardinal directions
    var directions = ['North', 'East', 'South', 'West'];
    for (var i = 0; i < directions.length; i++) {

      // For each of the cardinal directions get the next tile...
      var direction = directions[i];

      // ...Use the getTileNearby helper method to do this
      var nextTile = helpers.getTileNearby(board, dft, dfl, direction);

      // If nextTile is a valid location to move...
      if (nextTile) {

        // Assign a key variable the nextTile's coordinates to put into our visited object later
        var key = nextTile.distanceFromTop + '|' + nextTile.distanceFromLeft;

        // If we have visited this tile before
        if (visited.hasOwnProperty(key)) {

          //Do nothing--this tile has already been visited

        } else if (nextTile.type === toTileType) {

          // This variable will eventually hold the first direction we went on this path
          var correctDirection = direction;

          // This is the distance away from the final destination that will be incremented in a bit
          var distance = 1;

          // If the tileType has a health property, we will want to return it in our object
          if (nextTile.health){
            var health = nextTile.health;
          } else {

            // If it does not, we need to assign a health property to return
            // Otherwise an error will be thrown when this function is used in other methods
            var health = undefined;
          }

          // These are the coordinates of our target tileType
          var finalCoords = [nextTile.distanceFromTop, nextTile.distanceFromLeft];

          // Loop back through path until we get to the start
          while (coords[3] !== 'START') {

            // Haven't found the start yet, so go to previous location
            correctDirection = coords[2];

            // We also need to increment the distance
            distance++;

            // And update the coords of our current path
            coords = coords[3];
          }

          //Return object with the following pertinent info
          return {
            direction: correctDirection,
            distance: distance,
            health: health,
            coords: finalCoords
          };

          // If the tile is unoccupied, then we need to push it into our queue
        } else if (nextTile.type === 'Unoccupied') {

          queue.push([nextTile.distanceFromTop, nextTile.distanceFromLeft, direction, coords]);

          // Give the visited object another key with the value we stored earlier
          visited[key] = true;
        }
      }
    }
  }

  // If we are blocked and there is no way to get where we want to go, return false
  return false;
};

// Returns the nearest diamond mine or false, if there are no diamond mines
helpers.findNearestDiamondMine = function(gameObj){
  return helpers.findNearestObjectDirectionAndDistance(gameObj.activeHero(), 'DiamondMine', gameObj.board).direction || false;
};

// Returns the nearest health well or false, if there are no health wells
helpers.findNearestHealthWell = function(gameObj){
  return helpers.findNearestObjectDirectionAndDistance(gameObj.activeHero(), 'HealthWell', gameObj.board).direction || false;
};

// Returns the nearest enemy or false, if there are no more enemies
helpers.findNearestEnemy = function(gameObj){
  return helpers.findNearestObjectDirectionAndDistance(gameObj.activeHero(), 'Hero', gameObj.board).direction || false;
};

// Returns the nearest enemy with a health level below the passed in number or false, if no such enemy exists
helpers.findNearestEnemyWithLowHealth = function(gameObj, healthLevel){

  // This stores a cumbersome method in a short variable
  var fn = helpers.findNearestObjectDirectionAndDistance;

  // While the enemy's health is greater than the specified amount...
  while (fn(gameObj.activeHero(), 'Hero', gameObj.board).health > healthLevel){

    // ...get the coordinates of that enemy and set the tile to null
    var coords = fn(gameObj.activeHero(), 'Hero', gameObj.board).coords;
    gameObj.board.tiles[coords[0]][coords[1]] = null;
  }

  // Once we break out of the loop, we either return the direction to head or false
  return fn(gameObj.activeHero(), 'Hero', gameObj.board).direction || false;

};
