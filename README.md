bole-mongodb
============

#### MongoDB stream for the bole logger ####

[![npm][npm-image]][npm-url]

Plugin for the [bole][bole-url] logger. Saves the logs to a MongoDB collection, `log` by default.

```javascript
var bole = require('bole');
var boleMongo = require('bole-mongodb');

MongoClient.connect(url, function (err, db) {
  if (err) return console.error(err);
  
  var boleMongoStream = boleMongo({ db: db, capped: true })
    .on('error', console.error);
  
  bole.output([
    { level: 'error', stream: boleMongoStream }
  ]);

  var log = bole('my-module');
 });
```

The `Db` object is required. Instead of opening a new connection from inside the plugin, the user is responsible for the connection's lifecycle. Therefore, this plugin assumes that the connection is already open. However, it won't fail if it's not.

MongoDB has the concept of a [Capped collection][capped-collection] and it can be used for logging purposes. This plugin tries to create a capped collection each time a message is logged. Therefore, it's not required to have the connection open at the time of registering the plugin.

___module_(options) : Writable__  
Returns a new Writable stream instance.

Options:

- __db__ - _Object_  
  MongoDB `Db` instance. This option is mandatory.
- __collection__ - _String_  
  Name of the collection. Default `logs`.
- __capped__ - _Boolean_  
  If the collection doesn't exist, creates a new capped collection. Default `false`.
- __size__ - _Number_  
  Size in bytes of the capped collection. Default `10000000` (10MB rounded up to the nearest multiple of 256).
- __max__ - _Number_  
  Maximum number of documents allowed in the capped collection. Default `undefined`.
- __force__ - _Boolean_  
  If the collection already exists, it is converted into a capped collection. Default `false`.

[npm-image]: http://img.shields.io/npm/v/bole-mongodb.svg?style=flat
[npm-url]: https://npmjs.org/package/bole-mongodb
[bole-url]: https://github.com/rvagg/bole
[capped-collection]: http://docs.mongodb.org/manual/core/capped-collections