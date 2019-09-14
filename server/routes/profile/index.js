const config = require('../../config/config');
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { isSignedIn } = require('../../middleware/auth');
const { gethash, transport, filterUsersData } = require('../../utils');
const { NO_REPLY_EMAIL, DEFAULT_AVATAR } = require('../../constants');
const DB = require('../../DB');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const fs = require('fs');
const {
  checkExpressCheckValidity,
  checkIfEmailIsFree,
  checkLoginValidity,
  checkEmailValidity,
  checkPasswordValidity,
  checkFirstNameValidity,
  checkLastNameValidity,
  checkLoginAvailability,
  checkEmailAvailability,
  checkUserExistanceByEmailAndHash,
  checkGenderValidity,
  checkPreferencesValidity,
  checkInterestsValidity,
  checkLocationValidity,
} = require('./middleware');

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
    login: login,
  });
  await saveNewInterests(reqBody);
};

router.get('/', isSignedIn, async (req, res) => {
  const [user] = filterUsersData(await DB.readUser(req.session.login));

  user.canLike = !(
    user.gallery.length === 1 && user.gallery[0] === DEFAULT_AVATAR
  );
  res.json(user);
});

router.patch(
  '/',
  [
    isSignedIn,
    check('firstname')
      .trim()
      .escape(),
    check('lastname')
      .trim()
      .escape(),
    check('email')
      .isEmail()
      .normalizeEmail(),
    check('age')
      .isNumeric()
      .trim()
      .escape(),
    check('gender')
      .trim()
      .escape(),
    check('preferences')
      .trim()
      .escape(),
    check('bio')
      .trim()
      .escape(),
    checkExpressCheckValidity,
    checkEmailValidity,
    checkFirstNameValidity,
    checkLastNameValidity,
    checkGenderValidity,
    checkPreferencesValidity,
    checkInterestsValidity,
    checkIfEmailIsFree,
  ],
  async (req, res) => {
    await updateProfile(req.body, req.session.login);

    const [user] = filterUsersData(await DB.readUser(req.session.login));

    res.json(user);
  },
);

router.get('/likedBy', isSignedIn, async (req, res) => {
  const likes = await DB.readLikesByReceiver(req.session.login);

  if (!likes.length) {
    return res.json([]);
  }

  const users = filterUsersData(
    await DB.readUsers(likes.map(({ liker }) => liker)),
  );

  res.json(users);
});

router.get('/checkedBy', isSignedIn, async (req, res) => {
  const users = await DB.readAllUsers();
  const checkedBy = filterUsersData(
    users.filter(({ visited }) => visited.includes(req.session.login)),
  );

  res.json(checkedBy);
});

router.patch(
  '/location',
  isSignedIn,
  checkLocationValidity,
  async (req, res) => {
    await DB.updateUserLocation(req.session.login, req.body.location);

    const [{ location }] = filterUsersData(
      await DB.readUser(req.session.login),
    );

    res.json(location);
  },
);

router.patch(
  '/photo',
  [
    isSignedIn,
    check('photoid')
      .isNumeric()
      .trim()
      .escape(),
    checkExpressCheckValidity,
  ],
  async (req, res, next) => {
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
        const oldFileName = gallery[photoid];

        if (oldFileName && oldFileName !== DEFAULT_AVATAR) {
          fs.unlink(
            `photos/${oldFileName}`,
            error => error && console.error(error),
          );
        }
        gallery[photoid] = `${fileName}.png`;
        await DB.updateUserGallery(login, gallery);
        res.json(`${fileName}.png`);
      },
    );
  },
);

router.patch(
  '/avatar',
  [
    isSignedIn,
    check('avatarid')
      .isNumeric()
      .trim()
      .escape(),
    checkExpressCheckValidity,
  ],
  async (req, res) => {
    await DB.updateUserAvatarId(req.session.login, req.body.avatarid);

    const [{ avatarid }] = await DB.readUser(req.session.login);

    res.json(avatarid);
  },
);

router.patch('/signout', async (req, res) => {
  await DB.updateUserTime(req.session.login, Date.now());

  req.session.reset();
  res.json({ result: 'OK' });
});

router.post(
  '/signup',
  [
    check('email')
      .isEmail()
      .normalizeEmail(),
    check('login')
      .trim()
      .escape(),
    check('firstname')
      .trim()
      .escape(),
    check('lastname')
      .trim()
      .escape(),
    checkExpressCheckValidity,
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

    bcrypt.genSalt(10, (err, salt) => {
      err && next(err);
      bcrypt.hash(rawPassword, salt, (err, password) => {
        err && next(err);

        const hash = gethash();
        const hostname = config.host ? config.host : req.headers.host;
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
