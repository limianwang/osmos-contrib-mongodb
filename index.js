'use strict';

/**
 * module dependencies
 */

var Promise = require('native-or-bluebird');
var async = require('async');
var mongo = require('mongodb');

var ObjectID = mongo.ObjectID;

function mongoKey(key) {
  if (!key || key.constructor.name === 'ObjectID') {
    return key;
  }

  var id;

  try {
    id = new ObjectID(key);
  } catch (e) {
    id = key;
  }

  return id;
}

/**
 * module exports
 */

var Driver = module.exports = function OsmosMongoDriver(database) {
  this.database = database;
};

Driver.prototype.create = function(model) {
  return Promise.resolve({});
};

Driver.prototype.get = function(model, key) {
  var self = this;

  return new Promise(function(resolve, reject) {
    var spec = {
      _id: mongoKey(key)
    };

    return self.database.collection(model.bucket).findOne(spec, function(err, doc) {
      if(err) {
        return reject(err);
      }

      if(doc) {
        doc._id = doc._id.toHexString ? doc._id.toHexString() : doc._id;
      }

      return resolve(doc);
    });
  });
};

Driver.prototype.post = function(document, data) {
  data._id = mongoKey(data._id);
  var self = this;

  return new Promise(function(resolve, reject) {
    return self.database.collection(document.model.bucket).insert(data, function(err, docs) {
      if(err) {
        return reject(err);
      }

      document.primaryKey = docs[0]._id.toHexString ? docs[0]._id.toHexString() : docs[0]._id;
      return resolve();
    });
  });
};

Driver.prototype.put = function(document, set, unset) {
  var self = this;

  return new Promise(function(resolve, reject) {
    if(!document.primaryKey) {
      return reject(new Error('You cannot update a document without a primaryKey'));
    }

    var payload = {
      '$set': set,
      '$unset': unset
    };

    self.database.collection(document.model.bucket).update({
      _id: mongoKey(document._id)
    }, payload, { upsert: true }, function(err) {
      if(err) {
        return reject(err);
      }

      return resolve();
    });
  });
};

Driver.prototype.del = function(model, key) {
  if (key.constructor.name === 'Object') {
    key = key[Object.keys(key)[0]];
  }

  var self = this;

  return new Promise(function(resolve, reject) {
    return self.database.collection(model.bucket).remove({
      _id: mongoKey(key)
    }, function(err) {
      if(err) {
        return reject(err);
      }

      return resolve();
    });
  });
};

Driver.prototype.count = function(model, spec) {
  var self = this;
  return new Promise(function(resolve, reject) {
    return self.database.collection(model.bucket).find(spec).count(function(err, count) {
      if(err) {
        return reject(err);
      }

      return resolve(count);
    });
  });
};

Driver.prototype.findOne = function(model, spec) {
  var self = this;
  return new Promise(function(resolve, reject) {
    return self.database.collection(model.bucket).findOne(spec, function(err, doc) {
      if(err) {
        return reject(err);
      }

      return resolve(doc);
    });
  });
};

Driver.prototype.find = function(model, spec, done) {
  var self = this;

  return new Promise(function(resolve, reject) {
    return self.database.collection(model.bucket).find(spec, function(err, rs) {
      if(err) {
        return reject(err);
      }

      return rs.toArray(function(err, docs) {
        if(err) {
          return reject(err);
        }

        return resolve(docs);
      });
    });
  });
};

Driver.prototype.findLimit = function findLimit(model, spec, start, limit) {
  var self = this;
  var searchSpec = spec.$query ? spec.$query : spec;

  return new Promise(function(resolve, reject) {
    async.parallel({
      count: function(cb) {
        self.database.collection(model.bucket).find(searchSpec).count(cb);
      },
      docs: function(cb) {
        self.database.collection(model.bucket).find(spec).skip(start).limit(limit, function(err, rs) {
          if (err) {
            return cb(err);
          }

          rs.toArray(cb);
        });
      }
    }, function(err, result) {
      if (err) {
        return reject(err);
      }

      return resolve(result);
    });
  });
};
