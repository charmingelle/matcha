const config = require('../config/config');
const bodyParser = require('body-parser');
const session = require('client-sessions');
const cors = require('cors');

module.exports = (express, app) => {
  app.use(bodyParser.json({ limit: config.bodyLimit, extended: true }));
  app.use(bodyParser.urlencoded({ limit: config.bodyLimit, extended: true }));
  app.use(express.json());
  app.use(session(config.sessionOptions));
  app.use(cors());
};
