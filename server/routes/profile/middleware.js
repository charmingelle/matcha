const { isSignedIn } = require('../../middleware/common');
const { check, validationResult } = require('express-validator');
const {
  isEmailValid,
  isLoginValid,
  isPasswordValid,
  isFirstLastNameValid,
  isAgeValid,
  isGenderValid,
  arePreferencesValid,
  isLatitudeValid,
  isLongitudeValid,
} = require('../../utils');
const DB = require('../../DB');

const checkExpressCheckValidity = (req, res, next) =>
  validationResult(req).isEmpty()
    ? next()
    : res.status(400).json('Please check that all the fields are valid');

const checkIfEmailIsFree = async (req, res, next) => {
  const users = await DB.readUsersWithUserEmail(
    req.body.email,
    req.session.login,
  );

  users.length === 0
    ? next()
    : res.status(403).json('The email address is busy');
};

const checkLoginValidity = (req, res, next) =>
  req.body.login && isLoginValid(req.body.login)
    ? next()
    : res.status(400).json('Login is invalid');

const checkEmailValidity = (req, res, next) =>
  req.body.email && isEmailValid(req.body.email)
    ? next()
    : res.status(400).json('Email is invalid');

const checkPasswordValidity = (req, res, next) =>
  req.body.password && isPasswordValid(req.body.password)
    ? next()
    : res.status(400).json('Password is invalid');

const checkFirstNameValidity = (req, res, next) =>
  req.body.firstname && isFirstLastNameValid(req.body.firstname)
    ? next()
    : res.status(400).json('First name is invalid');

const checkLastNameValidity = (req, res, next) =>
  req.body.lastname && isFirstLastNameValid(req.body.lastname)
    ? next()
    : res.status(400).json('Last name is invalid');

const checkAgeValidity = (req, res, next) =>
  isAgeValid(req.body.age) ? next() : res.status(400).json('Age is invalid');

const checkLoginAvailability = async (req, res, next) => {
  const users = await DB.readUser(req.body.login);

  users.length > 0 ? res.status(403).json('Your login is busy') : next();
};

const checkEmailAvailability = async (req, res, next) => {
  const users = await DB.readUsersByEmail(req.body.email);

  users.length > 0 ? res.status(403).json('Your email is busy') : next();
};

const checkGenderValidity = async (req, res, next) =>
  isGenderValid(req.body.gender)
    ? next()
    : res.status(400).json('Invalid gender');

const checkPreferencesValidity = async (req, res, next) =>
  arePreferencesValid(req.body.preferences)
    ? next()
    : res.status(400).json('Invalid preferences');

const checkInterestsValidity = async (req, res, next) =>
  Array.isArray(req.body.interests) &&
  req.body.interests.every(
    interest => interest === interest.toString() && interest.length <= 30,
  )
    ? next()
    : res
        .status(400)
        .json(
          'Please make sure that each interest is a string taking no longer than 30 symbols',
        );

const checkLocationValidity = async (req, res, next) =>
  Array.isArray(req.body.location) &&
  req.body.location.length === 2 &&
  isLatitudeValid(req.body.location[0]) &&
  isLongitudeValid(req.body.location[1])
    ? next()
    : res.status(400).json('Invalid location');

exports.checkUserExistanceByEmailAndHash = async (req, res, next) => {
  const users = await DB.readUsersByEmailAndHash(req.body.email, req.body.hash);

  users.length === 1
    ? next()
    : res.status(404).json('The account to be activated cannot be found');
};

exports.slashMiddlewareArray = [
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
  checkAgeValidity,
  checkGenderValidity,
  checkPreferencesValidity,
  checkInterestsValidity,
  checkIfEmailIsFree,
  checkLocationValidity,
];

exports.locationMiddlewareArray = [isSignedIn, checkLocationValidity];

exports.phoroMiddlewareArray = [
  isSignedIn,
  check('photoid')
    .isNumeric()
    .trim()
    .escape(),
  checkExpressCheckValidity,
];

exports.avatarMiddlewareArray = [
  isSignedIn,
  check('avatarid')
    .isNumeric()
    .trim()
    .escape(),
  checkExpressCheckValidity,
];

exports.signupMiddlewareArray = [
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
];
