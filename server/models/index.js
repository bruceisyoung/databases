var db = require('../db');

module.exports = {
  messages: { 
    get: function () {}, // a function which produces all the messages
    post: function (data) {
      data['user_id'] = 1;
      delete data.username;
      data.text = data.message;
      data['room_id'] = 1;
      delete data.message;
      delete data.roomname;
      console.log(data);
      db.query('insert into messages set ?', data, function(err, rows, fields) {
        if (err) {
          console.error(err);
          throw err;
        }
        console.log(err, rows, fields);
      });
    } // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function () {},
    post: function (data) { 
      //
      data.name = data.username;
      delete data.username; 
      console.log('data.username: ', data.username, data.name);
      db.query('insert into users set ?', data, function(err, rows, fields) {
        if (err) {
          console.error(err);
          throw err;
        }
        console.log(err, rows, fields);
      });
    }
  }
};

