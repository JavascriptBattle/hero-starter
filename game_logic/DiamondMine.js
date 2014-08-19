var DiamondMine = function(distanceFromTop, distanceFromLeft) {
  this.id = undefined;

  this.distanceFromTop = distanceFromTop;
  this.distanceFromLeft = distanceFromLeft;

  this.type = 'DiamondMine';
  this.subType = 'DiamondMine';

  this.owner = undefined;
};

DiamondMine.prototype.getCode = function() {
  var idStr = this.id.toString();
  if (idStr.length === 1) {
    idStr = '0' + idStr;
  }
  return 'D' + idStr;
};

DiamondMine.prototype.updateOwner = function(hero) {
  if (this.owner !== undefined) {
    //Removes this mine from the previous owner's array
    this.owner.loseMine(this);
  }

  //Updates the owner to be the new hero
  this.owner = hero;
};

module.exports = DiamondMine;
