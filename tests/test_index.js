'use strict';

var chai = require('chai');
var expect = chai.expect;

var mongodb = require('mongodb');
var Driver = require('../');

chai.config.includeStack = true;

describe('mongodb driver', function() {
  var driver;

  before(function(done) {
    mongodb.MongoClient.connect('mongodb://localhost:27017/osmos', {}, function(err, db) {
      if(err) {
        console.log(err);
        done(err);
      } else {
        driver = new Driver(db);

        done();
      }
    });
  });

  describe('generic', function() {
    it('should be a constructor', function() {
      expect(Driver).to.be.a('function');
    });

    it('should wrap mongo object without driver', function() {
      expect(driver).to.be.an('object').to.have.property('database');
    });
  });

  describe('create', function() {
    it('should be able to create an object', function(done) {
      driver
        .create()
        .then(function(doc) {
          expect(doc)
            .to.be.an('object')
            .to.be.empty;

          done();
        });
    });
  });
});
