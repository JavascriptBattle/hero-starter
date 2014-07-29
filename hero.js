/* 
  The only function that is required in this file is the "move" function

  The "move" function must return "North", "South", "East", "West", or "Stay"
  
  The "move" function should accept two arguments: 
    - a "gameData" object which holds all information about the current state
      of the battle

    - a "helpers" object, which contains useful helper functions

    (the details of these objects can be found on javascriptbattle.com/rules)

*/

var move = function(gameData, helpers) {
  var choices = ['North', 'East', 'South', 'West', 'Stay'];
  return choices[Math.floor(Math.random()*5)];
};