bole-mongodb
============

#### MongoDB stream for the bole logger ####

[![npm version][npm-version-image]][npm-url]

[![npm install][npm-install-image]][npm-url]

Plugin for the [bole][bole-url] logger. Saves the logs to a MongoDB collection, `log` by default.

```javascript
var bole = require ("bole");
var boleMongo = require ("bole-mongodb");

var url = ...

MongoClient.connect (url, function (error, db){
  if (error) return console.error (error);
  
  var boleMongoStream = boleMongo ({ db: db, capped: true })
    //The error handler shouldn't be called. If it is called, then something is
    //wrong with the database url or connection options, so it's up to you
    //how to handle these kind of errors: crashing the server (without
    //registering this error handler) or logging it somewhere
    .on ("error", console.error);
  
  bole.output ([
    { level: 'error', stream: boleMongoStream }
  ]);
  
  ...
 });
```

The `Db` object is required. Instead of opening a new connection from inside the plugin, the user is responsible for the connection's lifecycle. Therefore, this plugin assumes that the connection is already open. However, it won't fail if it's not.

MongoDB has the concept of a [Capped collection][capped-collection] and it can be used for logging purposes. This plugin tries to create a capped collection for the first time a message is logged, and it can be forced to convert an existing one into a capped collection.

<a name="create"></a>
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

[npm-version-image]: http://img.shields.io/npm/v/bole-mongodb.svg
[npm-install-image]: https://nodei.co/npm/bole-mongodb.png?mini=true
[npm-url]: https://npmjs.org/package/bole-mongodb
[bole-url]: https://github.com/rvagg/bole
[capped-collection]: http://docs.mongodb.org/manual/core/capped-collections