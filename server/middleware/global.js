const config = require('../config/config');
const bodyParser = require('body-parser');
const session = require('client-sessions');
const cors = require('cors');

module.exports = app => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(session(config.sessionOptions));
  app.use(cors());
};
