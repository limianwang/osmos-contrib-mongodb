# osmos-contrib-mongodb

[![Build Status](https://travis-ci.org/limianwang/osmos-contrib-mongodb.svg?branch=master)](https://travis-ci.org/limianwang/osmos-contrib-mongodb)
[![Coverage Status](https://coveralls.io/repos/limianwang/osmos-contrib-mongodb/badge.svg?branch=master)](https://coveralls.io/r/limianwang/osmos-contrib-mongodb?branch=master)

mongodb Driver for Osmos

# Usage

```
npm install mongodb --save

npm install osmo-lite --save
npm install osmos-contrib-mongodb --save
```

```js
var osmos = require('osmos-lite');
var Driver = require('osmos-contrib-mongodb');
var mongodb = require('mongodb');

mongodb.MongoClient.connect(url, options, function(err, db) {
  if(err) {
    return done(err);
  }

  var driver =  new osmosMongo(db);

  osmos.drivers.register('mongodb', driver);

  model = new Model('TestMongo', schema, 'name', 'mongodb');

  model.create(...)
});
```
