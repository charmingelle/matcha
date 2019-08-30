const express = require('express');
const app = express();
const host = process.env.MATCHA_MOD == 'dev' ? 'localhost:3000' : null;
const DB = require('./DB');
const bodyParser = require('body-parser');
const session = require('client-sessions');
const path = require('path');
const { check } = require('express-validator/check');
const bcrypt = require('bcrypt');
const sendmail = require('sendmail')();
const { gethash } = require('./utils');
const { NO_REPLY_EMAIL } = require('./constants');
const MAGIC = require('./magic');
const {
  requireLogin,
  isSignupDataValid,
  areLoginAndEmailFree,
  isAccountExisting,
  isAccountExistingAndValid,
  isHashExpired,
  areLoginAndPasswordValid,
} = require('./middleware');

app.use(bodyParser.json({ limit: '50mb' }));

app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

app.use(
  session({
    cookieName: 'session',
    secret: 'eg[isfd-8yF9-7w2315df{}+Ijsli;;to8',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
    httpOnly: true,
    ephemeral: true,
  }),
);

app.use(express.static(path.join(__dirname, '../client/build')));

app.use(express.static(path.join(__dirname, '../photos')));

app.post('/getUserProfile', requireLogin, async (req, res) =>
  res.json(await MAGIC.getUserProfile(req.session.login)),
);

app.post('/saveLocation', requireLogin, async (req, res) =>
  res.end(await MAGIC.saveLocation(req.body.location, req.session.login)),
);

app.post('/signout', async (req, res) => {
  await MAGIC.saveLastLoginTime(req.session.login);

  req.session.reset();
  !host
    ? res.redirect(`http://${req.headers.host}`)
    : res.redirect(`http://${host}`);
});

app.post('/getChatData', requireLogin, async (req, res) =>
  res.json(await MAGIC.getChatDataFromDB(req.session.login)),
);

app.post('/getSuggestions', requireLogin, async (req, res) =>
  res.json(await MAGIC.getSuggestionsFromDB(req.session.login)),
);

app.post('/getVisited', requireLogin, async (req, res) =>
  res.json(await MAGIC.getMyVisitedLogins(req.session.login)),
);

app.post('/saveVisited', requireLogin, async (req, res) => {
  await MAGIC.saveVisited(req.body.visited, req.session.login);
  res.json(await MAGIC.getMyVisitedLogins(req.session.login));
});

app.post(
  '/saveUserProfile',
  requireLogin,
  [check('firstname').isEmpty(), check('lastname').isEmpty()],
  async (req, res) => {
    if (await MAGIC.isEmailBusy(req.body.email, req.session.login)) {
      return res.json({
        status: 'error',
        result: 'The email address is busy',
      });
    }
    await MAGIC.updateProfile(req.body, req.session.login);
    res.json({
      status: 'success',
      result: 'Your data has been changed',
      suggestions: await MAGIC.getSuggestionsFromDB(req.session.login),
    });
  },
);

app.post('/getLikedBy', requireLogin, async (req, res) =>
  res.json(await MAGIC.getLikedBy(req.session.login)),
);

app.post('/getCheckedBy', requireLogin, async (req, res) =>
  res.json(await MAGIC.getCheckedBy(req.session.login)),
);

app.post('/saveUserPhoto', requireLogin, async (req, res) => {
  res.json(
    await MAGIC.saveUserPhoto(
      req.body.photo,
      req.body.photoid,
      req.session.login,
    ),
  );
});

app.post('/setAvatar', requireLogin, async (req, res) =>
  res.end(await MAGIC.setAvatar(req.body.avatarid, req.session.login)),
);

app.post('/signinOrMain', async (req, res) =>
  req.session && req.session.login
    ? res.json(await MAGIC.signinOrMain(req.session.login))
    : res.json({ result: 'signin' }),
);

app.post('/signin', areLoginAndPasswordValid, async (req, res) =>
  res.json(await MAGIC.signin(req)),
);

app.post(
  '/signup',
  [
    check('email').isEmpty(),
    check('login').isEmpty(),
    check('password').isEmpty(),
    check('firstname').isEmpty(),
    check('lastname').isEmpty(),
    isSignupDataValid,
    areLoginAndEmailFree,
  ],
  async (req, res) => {
    const {
      email,
      login,
      password: rawPassword,
      firstname,
      lastname,
    } = req.body;
    const { host: hostFromHeaders } = req.headers;

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(rawPassword, salt, (err, password) => {
        const hash = gethash();
        const hostname = host ? host : hostFromHeaders;

        sendmail(
          {
            from: NO_REPLY_EMAIL,
            to: email,
            subject: 'Matcha Registration Confirmation',
            html: `Please active your Matcha account using the following link: http://${hostname}/confirm?email=${email}&hash=${hash}`,
          },
          async error => {
            if (error) {
              return res.json({
                status: 'error',
                result: 'Your email is invalid',
              });
            }
            await DB.createUser({
              email,
              login,
              password,
              firstname,
              lastname,
              hash,
            });
            res.json({
              status: 'success',
              result: 'Check your email',
            });
          },
        );
      });
    });
  },
);

app.post('/activateAccount', isAccountExisting, async (req, res) => {
  await DB.updateActiveClearHashByEmail(req.body.email);
  res.json({ result: 'Your account has been activated' });
});

app.post(
  '/getResetPasswordEmail',
  isAccountExistingAndValid,
  async (req, res) => {
    const { email } = req.body;
    const { host: hostFromHeaders } = req.headers;
    const hash = gethash();
    const hostname = host ? host : hostFromHeaders;

    await DB.updateHashByEmail(hash, req.body.email);
    sendmail(
      {
        from: NO_REPLY_EMAIL,
        to: email,
        subject: 'Reset Your Matcha Password',
        html: `Please use the following link to reset your Matcha password: http://${hostname}/reset-password?email=${email}&hash=${hash}`,
      },
      error =>
        error
          ? res.json({
              status: 'error',
              result: 'Something went wrong. Please try again',
            })
          : res.json({
              status: 'success',
              result: 'Check your email',
            }),
    );
  },
);

app.post('/resetPassword', (req, res) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(req.body.password, salt, async (err, hash) => {
      await DB.updatePasswordByEmail(hash, req.body.email);
      res.json({ result: 'Your password has been changed' });
    });
  });
});

app.post('/resetPasswordOrExpired', isHashExpired, async (req, res) => {
  await DB.clearHashByEmail(req.body.email);
  res.json({ result: 'reset-password' });
});

app.post('/reportFake', requireLogin, async (req, res) =>
  res.end(await DB.markAsFake(req.body.login)),
);

app.post('/getLikeStatus', requireLogin, async (req, res) => {
  const likes = await DB.getLikes(req.session.login, req.body.login);

  res.json({ canLike: likes.length === 0 });
});

// app.post('/changeLikeStatus', requireLogin, async (req, res) => {
//   req.body.canLike
//     ? res.json(await MAGIC.like(req.session.login, req.body.login))
//     : res.json(await MAGIC.dislike(req.session.login, req.body.login));
// });

app.post('/getBlockStatus', requireLogin, async (req, res) => {
  const blocks = await DB.getBlocks(req.session.login, req.body.login);

  res.json({ canBlock: blocks.length === 0 });
});

app.post('/changeBlockStatus', requireLogin, async (req, res) => {
  req.body.canBlock
    ? res.json(await MAGIC.block(req.session.login, req.body.login))
    : res.json(await MAGIC.unblock(req.session.login, req.body.login));
});

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

require('./webSocket')(app);
