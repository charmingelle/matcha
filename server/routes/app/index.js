const config = require('../../config/config');
const express = require('express');
const router = express.Router();
const { isSignedIn } = require('../../middleware/common');
const {
  hasHashExpired,
  signinMiddlewareArray,
  passwordResetEmailMiddlewareArray,
} = require('./middleware');
const { gethash, transport } = require('../../utils');
const { NO_REPLY_EMAIL } = require('../../constants');
const DB = require('../../DB');
const bcrypt = require('bcrypt');

router.post('/auth', isSignedIn, (req, res) => res.json({ result: 'OK' }));

router.post('/signin', signinMiddlewareArray, async (req, res) => {
  if (process.env.NODE_ENV === config.prod) {
    global.domain = req.headers.host;
  }
  req.session.login = req.body.login;
  await DB.updateUserOnline(req.body.login);
  res.json({ result: 'OK' });
});

router.post(
  '/password/reset/email',
  passwordResetEmailMiddlewareArray,
  async (req, res) => {
    const { email } = req.body;
    const hostname = config.host ? config.host : req.headers.host;
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
