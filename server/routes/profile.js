const express = require('express');
const router = express.Router();
const { isSignedIn } = require('../middleware');
const {
  isEmailValid,
  isLoginValid,
  isPasswordValid,
  isFirstLastNameValid,
  gethash,
  transport,
} = require('../utils');
const { NO_REPLY_EMAIL, HOST } = require('../constants');
const DB = require('../DB');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const fs = require('fs');

const checkIfEmailIsFree = async (req, res, next) => {
  const users = await DB.readUsersWithUserEmail(
    req.body.email,
    req.session.login,
  );

  users.length === 0
    ? next()
    : res.status(500).json('The email address is busy');
};

const checkLoginValidity = (req, res, next) =>
  req.body.login && isLoginValid(req.body.login)
    ? next()
    : res.status(500).json('Login is invalid');

const checkEmailValidity = (req, res, next) =>
  req.body.email && isEmailValid(req.body.email)
    ? next()
    : res.status(500).json('Email is invalid');

const checkPasswordValidity = (req, res, next) =>
  req.body.password && isPasswordValid(req.body.password)
    ? next()
    : res.status(500).json('Password is invalid');

const checkFirstNameValidity = (req, res, next) =>
  req.body.firstname && isFirstLastNameValid(req.body.firstname)
    ? next()
    : res.status(500).json('First name is invalid');

const checkLastNameValidity = (req, res, next) =>
  req.body.lastname && isFirstLastNameValid(req.body.lastname)
    ? next()
    : res.status(500).json('One of the fields is invalid');

const checkLoginAvailability = async (req, res, next) => {
  const users = await DB.readUser(req.body.email, req.body.login);

  users.length > 0 ? res.status(500).json('Your login is busy') : next();
};

const checkEmailAvailability = async (req, res, next) => {
  const users = await DB.readUsersByEmail(req.body.email, req.body.login);

  users.length > 0 ? res.status(500).json('Your login is busy') : next();
};

const checkUserExistanceByEmailAndHash = async (req, res, next) => {
  const users = await DB.readUsersByEmailAndHash(req.body.email, req.body.hash);

  users.length === 1
    ? next()
    : res.status(500).json('The account to be activated cannot be found');
};

const saveNewInterests = async reqBody => {
  const data = await DB.readInterests();
  const interests = data.map(record => record.interest);
  const toSave = reqBody.interests
    .filter(interest => interests.indexOf(interest) === -1)
    .map(interest => [interest]);

  if (toSave.length > 0) {
    await DB.createInterests(toSave);
  }
};

const updateProfile = async (reqBody, login) => {
  await DB.updateUser({
    firstname: reqBody.firstname,
    lastname: reqBody.lastname,
    email: reqBody.email,
    age: reqBody.age,
    gender: reqBody.gender,
    preferences: reqBody.preferences,
    bio: reqBody.bio,
    interests: reqBody.interests,
    gallery: reqBody.gallery,
    avatarid: reqBody.avatarid,
    login: login,
  });
  await saveNewInterests(reqBody);
};

router.get('/', isSignedIn, async (req, res) => {
  const { login } = req.session;
  const [[user], interests] = await Promise.all([
    DB.readUser(login),
    DB.readInterests(),
  ]);

  let likedBy = [];
  const likes = await DB.readLikesByReceiver(login);

  if (likes.length > 0) {
    likedBy = await DB.readUsers(likes.map(({ liker }) => liker));
  }

  const users = await DB.readAllUsers();
  const checkedBy = users.filter(({ visited }) => visited.includes(login));

  res.json({
    user: { ...user, likedBy, checkedBy },
    allInterests: interests.map(interest => interest.interest),
  });
});

router.patch('/location', isSignedIn, async (req, res) => {
  await DB.updateUserLocation(req.session.login, req.body.location);
  res.json({ result: 'OK' });
});

router.patch('/photo', isSignedIn, async (req, res, next) => {
  const { login } = req.session;
  const { photo, photoid } = req.body;
  const fileName = `${crypto.randomBytes(20).toString('hex')}${Date.now()}`;

  await fs.writeFile(
    `photos/${fileName}.png`,
    photo.replace(/^data:image\/png;base64,/, ''),
    'base64',
    async error => {
      error && next(error);

      const [{ gallery }] = await DB.readUser(login);

      fs.unlink(`photos/${gallery[photoid]}`, async () => {
        gallery[photoid] = `${fileName}.png`;
        await DB.updateUserGallery(login, gallery);
        res.json({ fileName: `${fileName}.png` });
      });
    },
  );
});

router.patch('/avatar', isSignedIn, async (req, res) => {
  await DB.updateUserAvatarId(req.session.login, req.body.avatarid);
  res.json({ result: 'OK' });
});

router.patch('/info', isSignedIn, checkIfEmailIsFree, async (req, res) => {
  await updateProfile(req.body, req.session.login);
  res.json({
    suggestions: await DB.readSuggestions(req.session.login),
  });
});

router.patch('/signout', async (req, res) => {
  await DB.updateUserTime(req.session.login, Date.now());

  req.session.reset();
  res.json({ result: 'OK' });
});

router.post(
  '/signup',
  [
    checkEmailValidity,
    checkLoginValidity,
    checkPasswordValidity,
    checkFirstNameValidity,
    checkLastNameValidity,
    checkLoginAvailability,
    checkEmailAvailability,
  ],
  async (req, res, next) => {
    const {
      email,
      login,
      password: rawPassword,
      firstname,
      lastname,
    } = req.body;
    const { host: hostFromHeaders } = req.headers;

    bcrypt.genSalt(10, (err, salt) => {
      err && next(err);
      bcrypt.hash(rawPassword, salt, (err, password) => {
        err && next(err);

        const hash = gethash();
        const hostname = HOST ? HOST : hostFromHeaders;
        const message = {
          from: NO_REPLY_EMAIL,
          to: email,
          subject: 'Matcha Registration Confirmation',
          html: `Please active your Matcha account using the following link: http://${hostname}/confirm?email=${email}&hash=${hash}`,
        };

        transport.sendMail(message, async error => {
          if (error) {
            return res.status(500).json('Your email is invalid');
          } else {
            await DB.createUser({
              email,
              login,
              password,
              firstname,
              lastname,
              hash,
            });
            return res.json({ result: 'OK' });
          }
        });
      });
    });
  },
);

router.patch(
  '/activate',
  checkUserExistanceByEmailAndHash,
  async (req, res) => {
    await DB.updateUserHashByEmail('', req.body.email);
    await DB.updateUserActiveByEmail(req.body.email);
    res.json({ result: 'Your account has been activated' });
  },
);

module.exports = router;