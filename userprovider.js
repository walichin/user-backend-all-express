
var db = require('node-mysql');
var DB = db.DB;
var BaseRow = db.Row;
var BaseTable = db.Table;

UserProvider = function() {

  this.db = new DB({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_DATABASE
  });

  this.db.add({
    name: 'adm_user_mt',
    idFieldName: 'user_id'});

};


//find all users
UserProvider.prototype.findAll = function(callback) {

  this.db.connect(function(conn, callback) {

    conn.query('select * from adm_user_mt', function(err, rows, fields) {

      //if (err) throw err;
      if( err ) callback(err)
      else {
        callback(null, rows);
      }
    });
  }, callback);
};

//find user by ID
UserProvider.prototype.findById = function(userId, callback) {
    
  this.db.connect(function(conn, callback) {

    conn.query('select * from adm_user_mt where user_id = ' + userId, function(err, rows, fields) {

      //if (err) throw err;
      if( err ) callback(err)
      else {
        if (rows[0]) callback(null, rows[0])
        else callback('User does not exist')
      }
    });
  }, callback);
};

//update user
UserProvider.prototype.update = function(userId, userObj, callback) {
  
  var User = this.db.get('adm_user_mt');

  this.db.connect(function(conn, callback) {

    //var user = User.Table.findById(conn, 13, callback);
    User.Table.findById(conn, userId, function(error, userRow) {
      
      if(error) callback(error);
      else {
        userRow.update(conn, userObj, function(error, result) {
          
          if(error) callback(error)
          else callback(null, result)       
        
        });
      }
    });
  }, callback);
};

//delete user
UserProvider.prototype.delete = function(userId, callback) {

  this.db.connect(function(conn, callback) {

    conn.query('delete from adm_user_mt where user_id = ' + userId, function(err, result) {

      if (err) callback(err)
      else callback(null, result)
    });
  }, callback);
};

//create new user
UserProvider.prototype.save = function(userObj, callback) {
  
  var User = this.db.get('adm_user_mt');

  this.db.connect(function(conn, callback) {

    User.Table.create(conn, userObj, function(error, userRow) {
      
      if(error) callback(error)
      else callback(null, userRow)       

    });
  }, callback);
};


exports.UserProvider = UserProvider;
