'use strict';

var util = require('util');
var stream = require('stream');

module.exports = function (options) {
  return new MongoStream(options);
};

var MongoStream = function (options) {
  stream.Writable.call(this, { objectMode: true });

  this._db = options.db;
  this._collectionName = options.collection || 'logs';
  this._collection = this._db.collection(this._collectionName);
  this._capped = {
    capped: options.capped,
    size: options.size || 10000000,
    max: options.max
  };
  this._force = options.force;
  this._prepared = false;
};

util.inherits(MongoStream, stream.Writable);

MongoStream.prototype._write = function (obj, encoding, cb) {
  obj.time = new Date(obj.time);

  if (this._prepared) {
    this._collection.insert(obj, cb);
  } else {
    var me = this;
    this._prepareCollection(function (err) {
      if (err) return cb(err);
      me._collection.insert(obj, cb);
    });
  }
};

MongoStream.prototype._prepareCollection = function (cb) {
  if (this._prepared || !this._db.serverConfig.connected) return cb();

  this._prepared = true;
  var me = this;

  if (this._force) {
    // Check whether the collection exists and if so, convert it to a capped
    // collection
    this._db.collection('system.namespaces')
        .find({
          name: this._db.databaseName + '.' + this._collectionName
        })
        .nextObject(function (err, doc) {
          if (err) return cb(err);

          if (doc) {
            // Convert it into a capped collection
            me._db.command({
              convertToCapped: me._collectionName,
              size: me._capped.size,
              max: me._capped.max
            }, cb);
          } else {
            me._db.createCollection(me._collectionName, me._capped, cb);
          }
        });
  } else {
    // Create a capped collection if it doesn't exist
    this._db.createCollection(this._collectionName, this._capped, cb);
  }
};