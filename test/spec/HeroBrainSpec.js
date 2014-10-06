var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

describe('Hero file', function () {
  'use strict';
  var move; 

  beforeEach(function() {
    move = require('../../hero.js');
  });

  it('exists and exports a move function', function () {
    move.should.be.a('function');
  });


});
describe('Helper file', function () {
  'use strict';
  var helpers;

  beforeEach(function() {
    helpers = require('../../helpers.js');
  });

  it('exists and exports a helper object', function () {
    helpers.should.be.a('object');
  });

});