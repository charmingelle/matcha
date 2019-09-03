const express = require('express');
const router = express.Router();
const { isSignedIn } = require('../middleware');
const { gethash, transport } = require('../utils');
const { NO_REPLY_EMAIL, HOST } = require('../constants');
const DB = require('../DB');
const bcrypt = require('bcrypt');

const checkIfLoginIsEmpty = (req, res, next) =>
  req.body.login ? next() : res.status(500).json('Empty login');

const checkIfPasswordIsEmpty = (req, res, next) =>
  req.body.password ? next() : res.status(500).json('Empty password');

const checkUserExistance = async (req, res, next) => {
  const users = await DB.readUser(req.body.login);

  if (users.length === 1) {
    req.user = users[0];
    next();
  } else {
    res.status(500).json('Unregistered login');
  }
};

const checkIfAccountIsActive = (req, res, next) =>
  req.user.active
    ? next()
    : res.status(500).json('Activate your account first');

const checkIfPasswordIsValid = async (req, res, next) => {
  const { password: savedPassword } = req.user;
  const passwordCompareResult = await bcrypt.compare(
    req.body.password,
    savedPassword,
  );

  passwordCompareResult === true
    ? next()
    : res.status(500).json('Invalid password');
};

const hasHashExpired = async (req, res, next) => {
  const users = await DB.readUsersByEmail(req.body.email);

  users.length !== 1 || users[0].hash !== req.body.hash
    ? res.status(500).json('Expired')
    : next();
};

const checkUserExistanceByEmail = async (req, res, next) => {
  const users = await DB.readUsersByEmail(req.body.email);

  if (users.length === 1) {
    req.user = users[0];
    next();
  } else {
    res.status(500).json('Invalid email');
  }
};

router.post(
  '/signin',
  [
    checkIfLoginIsEmpty,
    checkIfPasswordIsEmpty,
    checkUserExistance,
    checkIfAccountIsActive,
    checkIfPasswordIsValid,
  ],
  async (req, res) => {
    req.session.login = req.body.login;
    await DB.updateUserOnline(req.body.login);
    res.json({ result: 'OK' });
  },
);

router.post(
  '/password/reset/email',
  [checkUserExistanceByEmail, checkIfAccountIsActive],
  async (req, res) => {
    const { email } = req.body;
    const hostname = HOST ? HOST : req.headers.host;
    const hash = gethash();
    const message = {
      from: NO_REPLY_EMAIL,
      to: email,
      subject: 'Reset Your Matcha Password',
      html: `Please use the following link to reset your Matcha password: http://${hostname}/reset-password?email=${email}&hash=${hash}`,
    };

    await DB.updateUserHashByEmail(hash, email);
    transport.sendMail(message, error =>
      error
        ? res.status(500).json('Please try again')
        : res.json({ result: 'OK' }),
    );
  },
);

router.post('/password/reset/link', hasHashExpired, async (req, res) => {
  await DB.updateUserHashByEmail('', req.body.email);
  res.json({ result: 'OK' });
});

router.post('/password/reset', (req, res, next) => {
  bcrypt.genSalt(10, (error, salt) => {
    error && next(error);
    bcrypt.hash(req.body.password, salt, async (error, hash) => {
      error && next(error);
      await DB.updateUserPasswordByEmail(hash, req.body.email);
      res.json({ result: 'Your password has been changed' });
    });
  });
});

router.get('/interests', isSignedIn, async (req, res) => {
  const interests = await DB.readInterests();

  res.json(interests.map(({ interest }) => interest));
});

module.exports = router;
