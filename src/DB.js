var Datastore = require('nedb')
  , db = new Datastore({ filename: './../database.json', autoload: true });

export default db