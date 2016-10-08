var db = require('../db');
var Promise = require('bluebird');
db = Promise.promisifyAll(db);

module.exports = {
  messages: { 
    get: function (req, res) {
      var data = req.body;
      return db.queryAsync('select * from messages', data.username)
        .then((messages) => messages)
        .map((message) => {
          return Promise.all([
            db.queryAsync('select name from rooms where id = ?', message['room_id']),
            db.queryAsync('select name from users where id = ?', message['user_id'])
          ])
          .then((results) => {
            var messageTemp = {
              roomname: null,
              username: null,
              message: null
            };
            console.log('RESULTS from messages GET: ', results);
            messageTemp.roomname = results[0][0].name;
            messageTemp.username = results[1][0].name;
            messageTemp.text = message.text;
            console.log('messageTemp from messages GET: ', messageTemp);
            return messageTemp;
          });
          
        })
        .then((messages) => {
          console.log('GET messages: ', messages);
          res.writeHead(200);
          res.end(JSON.stringify(messages));
        });
    },
    post: function (req, res) {
      var data = req.body;
      var getRoomId = function() {
        return db.queryAsync(`insert ignore rooms (name) values ("${data.roomname}")`)
          .then(() => db.queryAsync(`select * from rooms where name = "${data.roomname}"`))
          .then(room => {
            console.log('ROOM: ', room);
            return room[0];
          });
      };
      var getUserId = function() {
        return db.queryAsync('select * from users where name = ?', data.username)
          .then(users => { 
            if (users[0]) {
              console.log(Array.isArray(users), users[0].id);
              return users[0];
            } else {
              throw new Error(data.username + ' does not exist in users.');
            }
          });
      };

      Promise.all([getRoomId(), getUserId()])
        .catch(err => console.error(err))
        .then((result) => {
          console.log(result);
          var message = {
            'room_id': result[0].id,
            'user_id': result[1].id,
            text: data.message
          };
          return db.queryAsync('insert into messages set ?', message);
        })
        .then((posted) => {
          console.log('MESSAGE POSTED: ', posted);
          res.writeHead(200);
          res.end('user posted sucessfully');
        });
    } 
  },

  users: {
    get: function (req, res) {
      db.queryAsync('select * from users')
      .then((users) => {
        console.log('Users in users.get: ', users, JSON.stringify(users));
        res.writeHead(200);
        res.end(JSON.stringify(users));
      });
    },
    post: function (req, res) { 
      var data = req.body;
      data.name = data.username;
      delete data.username; 
      console.log('data.username: ', data.username, data.name);
      db.queryAsync(`insert ignore into users (name) values ("${data.name}")`)
        .then((results) => {
          console.log('results: ', results);
          res.writeHead(200);
          res.end('user posted sucessfully');
        });
    }
  }
};

