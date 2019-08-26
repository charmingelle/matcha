const DB = require('./DB');
const {
  isEmailValid,
  isLoginValid,
  isPasswordValid,
  isFirstLastNameValid,
} = require('./utils');
const bcrypt = require('bcrypt');

module.exports = {
  async requireLogin(req, res, next) {
    if (!req.session || !req.session.login) {
      return res.status(500).json({ result: 'Not signed in' });
    }
    const data = await DB.getUserDetails(req.session.login);

    data.length === 1
      ? next()
      : res.status(500).json({ result: 'Not signed in' });
  },

  isSignupDataValid(req, res, next) {
    isEmailValid(req.body.email) &&
    isLoginValid(req.body.login) &&
    isPasswordValid(req.body.password) &&
    isFirstLastNameValid(req.body.firstname) &&
    isFirstLastNameValid(req.body.lastname)
      ? next()
      : res.json({
          status: 'error',
          result: 'One of the fields is invalid',
        });
  },

  async areLoginAndEmailFree(req, res, next) {
    const users = await DB.getUsersByEmailOrLogin(
      req.body.email,
      req.body.login,
    );

    users.length > 0
      ? res.json({
          status: 'error',
          result: 'Your email or login is busy',
        })
      : next();
  },

  async isAccountExisting(req, res, next) {
    const users = await DB.getUsersByEmailAndHash(
      req.body.email,
      req.body.hash,
    );

    users.length === 1
      ? next()
      : res.json({
          status: 'error',
          result: 'The account to be activated cannot be found',
        });
  },

  async isAccountExistingAndValid(req, res, next) {
    const users = await DB.getUsersByEmail(req.body.email);

    users.length !== 1
      ? res.json({ status: 'error', result: 'Invalid email' })
      : users[0].active
      ? next()
      : res.json({
          status: 'error',
          result:
            'Please activate your account using the link received in Matcha Registration Confirmation email first',
        });
  },

  async isHashExpired(req, res, next) {
    const users = await DB.getHashByEmail(req.body.email);

    users.length !== 1 || users[0].hash !== req.body.hash
      ? res.json({ result: 'expired' })
      : next();
  },

  async areLoginAndPasswordValid(req, res, next) {
    const { login, password } = req.body;
    const users = await DB.getActiveAndPasswordByLogin(login);

    if (users.length !== 1) {
      return res.json({
        status: 'error',
        result: 'Invalid login or password',
      });
    }
    const { active, password: savedPassword } = users[0];

    if (!active) {
      return res.json({
        status: 'error',
        result: 'Activate your account first',
      });
    }
    const passwordCompareResult = await bcrypt.compare(password, savedPassword);

    passwordCompareResult === true
      ? next()
      : res.json({
          status: 'error',
          result: 'Invalid login or password',
        });
  },
};
