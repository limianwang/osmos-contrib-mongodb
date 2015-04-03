# osmos-contrib-mongodb

mongodb Driver for Osmos

# Usage

```
npm install osmo-lite --save
npm install osmos-contrib-mongodb
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
