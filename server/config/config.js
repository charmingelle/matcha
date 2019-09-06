const _ = require('lodash');

const config = {
  dev: 'development',
  prod: 'production',
  port: process.env.PORT || 5000,
  db: {
    url: 'postgres://gannar:postgres@localhost:5432/matcha',
  },
  nodemailerOptions: {
    host: 'smtp.gmail.com',
    port: 587,
    requireTLS: true,
    auth: {
      user: process.env.GMAIL_LOGIN || 'annar703unit@gmail.com',
      pass: process.env.GMAIL_PASSWORD || 'eiling357unit',
    },
  },
  sessionOptions: {
    cookieName: 'session',
    secret: process.env.SESSION_SECRET || 'eg[isfd-8yF9-7w2315df{}+Ijsli;;to8',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
    httpOnly: true,
    ephemeral: true,
  },
};

process.env.NODE_ENV = process.env.NODE_ENV || config.dev;
config.env = process.env.NODE_ENV;

let envConfig;

try {
  envConfig = require('./' + config.env);
  envConfig = envConfig || {};
} catch (e) {
  envConfig = {};
}

module.exports = _.merge(config, envConfig);
