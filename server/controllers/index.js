var models = require('../models');

module.exports = {
  messages: {
    get: function (req, res) {}, // a function which handles a get request for all messages
    post: function (req, res) {
      console.log(req.body);
      models.messages.post(req.body);
      res.writeHead(200);
      res.end('user posted sucessfully');
    } // a function which handles posting a message to the database
  },

  users: {
    // Ditto as above
    get: function (req, res) {},
    post: function (req, res) {
      // req body and 
      console.log(req.body);
      models.users.post(req.body);
      res.writeHead(200);
      res.end('user posted sucessfully');
    }
  }
};

