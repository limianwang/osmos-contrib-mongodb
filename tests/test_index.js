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

  describe('when getting data from mongodb', function() {

    describe('when an error occurred', function() {

      it('should catch error', function(done) {
        sinon.stub(driver.database, 'collection', function(bucket) {
          return {
            findOne: function(arg, callback) {
              process.nextTick(function() {
                callback(new Error('fake'));
              });
            }
          };
        });

        driver.get(model, 'key').catch(function(err) {
          expect(err).to.exist;
          expect(err).to.have.property('message').to.be.equal('fake');

          driver.database.collection.restore();

          done();
        });
      });

    });

    describe('when document is found', function() {

      it('should be able to transform id to hexstring', function(done) {

        sinon.stub(driver.database, 'collection', function(bucket) {
          return {
            findOne: function(spec, callback) {
              process.nextTick(function() {
                callback(null, {
                  _id: {
                    toHexString: function() {
                      return spec._id;
                    }
                  }
                })
              });
            }
          };
        });

        driver.get(model, 'key').then(function(doc) {

          expect(doc).to.have.property('_id').to.be.equal('key');

          driver.database.collection.restore();

          done();
        });

      });
    });
  });

  describe('when creating data', function() {
    var document;

    beforeEach(function() {
        document = {
            model: model
        };
    });

    it('should catch error returned from collection', function(done) {
      sinon.stub(driver.database, 'collection', function(bucket) {
        return {
          insert: function(spec, callback) {
            process.nextTick(function() {
              callback(new Error('fake'));
            });
          }
        };
      });

      driver.post(document, { _id: 'b' })
        .catch(function(err) {
          expect(err).to.exist;

          driver.database.collection.restore();

          done();
        });
    });

    it('should yield array of created objects', function(done) {
      sinon.stub(driver.database, 'collection', function(bucket) {
        return {
          insert: function(spec, callback) {
            process.nextTick(function() {
              callback(null, [{ _id: 'test', a: 'b' }]);
            });
          }
        };
      });

      driver.post(document, { _id: 'test' })
        .then(function() {

          driver.database.collection.restore();

          done();
        });
    });

  });

});
