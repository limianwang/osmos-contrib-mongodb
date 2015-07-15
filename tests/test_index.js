'use strict';

var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;

var mongodb = require('mongodb');
var Driver = require('../');

chai.config.includeStack = true;

describe('mongodb driver', function() {
  var driver, model;

  before(function(done) {
    model = {
      bucket: 'mock'
    };

    mongodb.MongoClient.connect('mongodb://localhost:27017/osmos', {}, function(err, db) {
      if(err) {
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

    it('should be able to find an empty object', function(done) {
      driver
        .get(model, 'test')
        .then(function(doc) {
          expect(doc)
            .to.not.exist;
          done();
        });
    });
  });
});
