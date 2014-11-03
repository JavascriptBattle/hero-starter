var moves = {
  healthNut:  function(gameData, helpers) {
    // Here, we ask if your hero's health is below 75
    if (gameData.activeHero.health <= 75){
      // If it is, head towards the nearest health well
      return helpers.findNearestHealthWell(gameData);
    } else {
      // Otherwise, go mine some diamonds!!!
      return helpers.findNearestNonTeamDiamondMine(gameData);
    }
  }
  ,
  sm1 : function(gameData, helpers){
    var weak , stro , ally, mine, well, grav, hero , board, list;
    hero = gameData.activeHero;
    board = gameData.board;
    weak = helpers.findNearestWeakerEnemy(gameData);
    stro = helpers.findNearestEnemy(gameData);
    ally = helpers.findNearestTeamMember(gameData);
    well = helpers.findNearestHealthWell(gameData);
    mine = helpers.findNearestNonTeamDiamondMine(gameData);

    if (well && well.distance==1 && stro && stro.distance==1) return well.direction;
    if (weak && weak.distance <= 2) return weak.direction;
    if (hero.health < 90 && well) return well.direction;
    if (mine && mine.distance <= 2 && hero.health > 50) return mine.direction;
    if (mine && hero.health > 80) return mine.direction;
    return ( (well || weak || mine || ally || stro).direction );
  }
};

var move = moves.sm1;

module.exports = move;
