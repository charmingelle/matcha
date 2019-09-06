const config = require('../config/config');
const bodyParser = require('body-parser');
const session = require('client-sessions');
const cors = require('cors');

module.exports = app => {
  app.use(bodyParser.json({ limit: config.bodyLimit }));
  app.use(bodyParser.urlencoded({ extended: true, limit: config.bodyLimit }));
  app.use(session(config.sessionOptions));
  app.use(cors());
};
