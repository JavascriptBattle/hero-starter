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
helpers.findNearestObjectDirectionAndDistance = function(board, fromTile, tileCallback, safePath) {
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
    dft = coords[0];
    dfl = coords[1];

    // Loop through cardinal directions
    var directions = ['North', 'East', 'South', 'West'];
    directions.push(directions.splice((directions.length*Math.random())>>0 , 1)[0]);
    directions.push(directions.splice((directions.length*Math.random())>>0 , 1)[0]);
    directions.push(directions.splice((directions.length*Math.random())>>0 , 1)[0]);
    for (var i = 0; i < directions.length; i++) {

      // For each of the cardinal directions get the next tile...
      var direction = directions[i];

      // ...Use the getTileNearby helper method to do this
      var nextTile = helpers.getTileNearby(board, dft, dfl, direction);

      // If nextTile is a valid location to move...
      if (nextTile) {

        // Assign a key variable the nextTile's coordinates to put into our visited object later
        var key = nextTile.distanceFromTop + '|' + nextTile.distanceFromLeft;

        var isGoalTile = false;
        try {
          isGoalTile = tileCallback(nextTile);
        } catch(err) {
          isGoalTile = false;
        }

        // If we have visited this tile before
        if (visited.hasOwnProperty(key)) {

          //Do nothing--this tile has already been visited

        //Is this tile the one we want?
        } else if (isGoalTile) {

          // This variable will eventually hold the first direction we went on this path
          var correctDirection = direction;

          // This is the distance away from the final destination that will be incremented in a bit
          var distance = 1;

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
          var goalTile = nextTile;
          goalTile.direction = correctDirection;
          goalTile.distance = distance;
          goalTile.coords = finalCoords;
          return goalTile;

          // If the tile is unoccupied, then we need to push it into our queue
        } else if (nextTile.type === 'Unoccupied' && (safePath? !nextTile.unsafe : true) ) {

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

// Returns the direction of the nearest non-team diamond mine or false, if there are no diamond mines
helpers.findNearestNonTeamDiamondMine = function(gameData) {
  var hero = gameData.activeHero;
  var board = gameData.board;

  //Get the path info object
  var pathInfoObject = helpers.findNearestObjectDirectionAndDistance(board, hero, function(mineTile) {
    if (mineTile.type === 'DiamondMine') {
      if (mineTile.owner) {
        return (mineTile.owner.team !== hero.team) || mineTile.owner.dead;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }, board);

  //Return the direction that needs to be taken to achieve the goal
  return pathInfoObject.direction;
};

// Returns the nearest unowned diamond mine or false, if there are no diamond mines
helpers.findNearestUnownedDiamondMine = function(gameData) {
  var hero = gameData.activeHero;
  var board = gameData.board;

  //Get the path info object
  var pathInfoObject = helpers.findNearestObjectDirectionAndDistance(board, hero, function(mineTile) {
    if (mineTile.type === 'DiamondMine') {
      if (mineTile.owner) {
        return mineTile.owner.id !== hero.id;
      } else {
        return true;
      }
    } else {
      return false;
    }
  });

  //Return the direction that needs to be taken to achieve the goal
  return pathInfoObject.direction;
};

// Returns the nearest health well or false, if there are no health wells
helpers.findNearestHealthWell = function(gameData) {
  var hero = gameData.activeHero;
  var board = gameData.board;

  //Get the path info object
  var pathInfoObject = helpers.findNearestObjectDirectionAndDistance(board, hero, function(healthWellTile) {
    return healthWellTile.type === 'HealthWell';
  });

  //Return the direction that needs to be taken to achieve the goal
  return pathInfoObject.direction;
};

// Returns the direction of the nearest enemy with lower health
// (or returns false if there are no accessible enemies that fit this description)
helpers.findNearestWeakerEnemy = function(gameData) {
  var hero = gameData.activeHero;
  var board = gameData.board;

  //Get the path info object
  var pathInfoObject = helpers.findNearestObjectDirectionAndDistance(board, hero, function(enemyTile) {
    return enemyTile.type === 'Hero' && enemyTile.team !== hero.team && enemyTile.health < hero.health;
  });

  //Return the direction that needs to be taken to achieve the goal
  //If no weaker enemy exists, will simply return undefined, which will
  //be interpreted as "Stay" by the game object
  return pathInfoObject.direction;
};

// Returns the direction of the nearest enemy
// (or returns false if there are no accessible enemies)
helpers.findNearestEnemy = function(gameData) {
  var hero = gameData.activeHero;
  var board = gameData.board;

  //Get the path info object
  var pathInfoObject = helpers.findNearestObjectDirectionAndDistance(board, hero, function(enemyTile) {
    return enemyTile.type === 'Hero' && enemyTile.team !== hero.team;
  });

  //Return the direction that needs to be taken to achieve the goal
  return pathInfoObject.direction;
};

// Returns the direction of the nearest friendly champion
// (or returns false if there are no accessible friendly champions)
helpers.findNearestTeamMember = function(gameData) {
  var hero = gameData.activeHero;
  var board = gameData.board;

  //Get the path info object
  var pathInfoObject = helpers.findNearestObjectDirectionAndDistance(board, hero, function(heroTile) {
    return heroTile.type === 'Hero' && heroTile.team === hero.team;
  });

  //Return the direction that needs to be taken to achieve the goal
  return pathInfoObject.direction;
};

helpers.findNearestGrave = function(gameData) {
  var hero = gameData.activeHero;
  var board = gameData.board;

  //Get the path info object
  var pathInfoObject = helpers.findNearestObjectDirectionAndDistance(board, hero, function(graveTile) {
    return graveTile.type === 'Unoccupied' && graveTile.subType === 'Bones';
  });

  //Return the direction that needs to be taken to achieve the goal
  return pathInfoObject.direction;
};

// Returns all tiles close to a given one, even empty or impassable tiles
helpers.adjacentTiles = function(gameData, tile, writeDirectionsToTiles) {
  var directions = ['North','East','South','West'];
  var tiles = [];
  for (var i=0; i < directions.length; ++i){
    if ( (temp = helpers.getTileNearby(gameData.board, tile.distanceFromTop, tile.distanceFromLeft, directions[i]))){
      tiles.push(temp);
      if ( writeDirectionsToTiles){
        tiles[tiles.length-1].direction = directions[i];
        tiles[tiles.length-1].distance = 1;
      };
    };
  };
  return tiles;
};

helpers.ringTwoTiles = function(gameData, tile) {
  var delta = [[0,2],[1,1],[2,0],[1,-1],[0,-2],[-1,-1],[-2,0],[-1,1]];
  var tiles = [];

  var isInacessible = function(direction){
    var temp = helpers.getTileNearby(gameData.board, tile.distanceFromTop, tile.distanceFromLeft, direction);
    return !temp || !(temp.type === 'Unoccupied' || (temp.type === 'Hero' && temp.health < 40));
  };

  if (isInacessible('North')){
    if (isInacessible('East')) delta.splice(7,1);
    delta.splice(6,1);
  };
  if (isInacessible('West')){
    if (isInacessible('North')) delta.splice(5,1);
    delta.splice(4,1);
  };
  if (isInacessible('South')){
    if (isInacessible('West')) delta.splice(3,1);
    delta.splice(2,1);
  };
  if (isInacessible('East')){
    if (isInacessible('South')) delta.splice(1,1);
    delta.splice(0,1);
  };
  for (var i=0; i < delta.length; ++i){
    var dft = tile.distanceFromTop + delta[i][0];
    var dfl = tile.distanceFromLeft+ delta[i][1];
    if (helpers.validCoordinates(gameData.board, dft, dfl)){
      tiles.push(gameData.board.tiles[dft][dfl]);
    };
  };
  return tiles;
};

// Returns a list of reachable objects, sorted by distance, with certain properties
helpers.makeListOfObjectDirectionAndDistance = function(board, fromTile, tileCallback) {
  // Storage list of tiles to return
  var goalTiles = [];
  // Storage queue to keep track of places the fromTile has been
  var queue = [];
  //Keeps track of places the fromTile has been for constant time lookup later
  var visited = {};
  var dft = fromTile.distanceFromTop;
  var dfl = fromTile.distanceFromLeft;
  // Stores the coordinates, the direction fromTile is coming from, and it's location
  var visitInfo = [dft, dfl, 'None', 'START'];
  //Just a unique way of storing each location we've visited
  visited[dft + '|' + dfl] = true;
  // Push the starting tile on to the queue
  queue.push(visitInfo);
  while (queue.length > 0) {
    // Shift off first item in queue
    var coords = queue.shift();
    // Reset the coordinates to the shifted object's coordinates
    dft = coords[0];
    dfl = coords[1];
    var directions = ['North', 'East', 'South', 'West'];
    for (var i = 0; i < directions.length; i++) {
      var direction = directions[i];
      var nextTile = helpers.getTileNearby(board, dft, dfl, direction);
      if (nextTile) {
        var key = nextTile.distanceFromTop + '|' + nextTile.distanceFromLeft;

        var isGoalTile = false;
        try {
          isGoalTile = tileCallback(nextTile);
        } catch(err) {
          isGoalTile = false;
        }

        // If we have visited this tile before
        if (visited.hasOwnProperty(key)) {

          continue;//Do nothing--this tile has already been visited

        //Is this tile the one we want?
        } else if (isGoalTile) {

          // This variable will eventually hold the first direction we went on this path
          var correctDirection = direction;

          // This is the distance away from the final destination that will be incremented in a bit
          var distance = 1;

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
          var goalTile = nextTile;
          goalTile.direction = correctDirection;
          goalTile.distance = distance;
          goalTile.coords = finalCoords;
          goalTiles.push(goalTile);

          visited[key] = true; // prevent multiple copies in result

          // If the tile is unoccupied, then we need to push it into our queue
        };// not using else; unoccupied tiles can be goal tiles and pushed to queue
        if (nextTile.type === 'Unoccupied') {

          queue.push([nextTile.distanceFromTop, nextTile.distanceFromLeft, direction, coords]);

          // Give the visited object another key with the value we stored earlier
          visited[key] = true;
        }
      }
    }
  }
  // sort by increasing distance order
  return goalTiles//.sort(function(t1,t2){return t1.distance > t2.distance;});
};

helpers.findAllReachableObjects = function(gameData){
  return helpers.makeListOfObjectDirectionAndDistance(gameData.board, gameData.activeHero, function(tile) {
    return tile.type !== 'Impassable' && tile.type !== 'Unoccupied';
  });
};

// Use gameData.board.inspect() for prettier output, this is rough
helpers.asciiBoard = function(gameData){
  var r = '';
  var m = function(t1){
    if (t1.type=='Hero')
      return (t1.team!=gameData.activeHero.team)?'x_x ':(
        t1.id == gameData.activeHero.id ? 'O^O ' : '\\o/ ') ;
    if (t1.type == 'DiamondMine') return (!t1.owner?'_M_ ':t1.owner.team==gameData.activeHero.id.team?'-$- ':'-@- ');
    if (t1.type == 'HealthWell') return '/H\\ ';
    if (t1.type == 'Impassable') return '[##]';
    return '. . ';
  };
  for (var i=0; i < gameData.board.lengthOfSide; ++i){
    for (var j=0; j < gameData.board.lengthOfSide; ++j ) r+=(m(gameData.board.tiles[i][j]));
    r+=('\n');
  };
  return r;
};

module.exports = helpers;
