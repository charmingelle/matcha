const {
  isEmailValid,
  isLoginValid,
  isPasswordValid,
  isFirstLastNameValid,
} = require('../../utils');
const { MALE, FEMALE, HETERO, HOMO, BI } = require('../../constants');
const DB = require('../../DB');

exports.checkExpressCheckValidity = (req, res, next) =>
  validationResult(req).isEmpty()
    ? next()
    : res.status(500).json('Please check that all the fields are valid');

exports.checkIfEmailIsFree = async (req, res, next) => {
  const users = await DB.readUsersWithUserEmail(
    req.body.email,
    req.session.login,
  );

  users.length === 0
    ? next()
    : res.status(500).json('The email address is busy');
};

exports.checkLoginValidity = (req, res, next) =>
  req.body.login && isLoginValid(req.body.login)
    ? next()
    : res.status(500).json('Login is invalid');

exports.checkEmailValidity = (req, res, next) =>
  req.body.email && isEmailValid(req.body.email)
    ? next()
    : res.status(500).json('Email is invalid');

exports.checkPasswordValidity = (req, res, next) =>
  req.body.password && isPasswordValid(req.body.password)
    ? next()
    : res.status(500).json('Password is invalid');

exports.checkFirstNameValidity = (req, res, next) =>
  req.body.firstname && isFirstLastNameValid(req.body.firstname)
    ? next()
    : res.status(500).json('First name is invalid');

exports.checkLastNameValidity = (req, res, next) =>
  req.body.lastname && isFirstLastNameValid(req.body.lastname)
    ? next()
    : res.status(500).json('One of the fields is invalid');

exports.checkLoginAvailability = async (req, res, next) => {
  const users = await DB.readUser(req.body.email, req.body.login);

  users.length > 0 ? res.status(500).json('Your login is busy') : next();
};

exports.checkEmailAvailability = async (req, res, next) => {
  const users = await DB.readUsersByEmail(req.body.email, req.body.login);

  users.length > 0 ? res.status(500).json('Your login is busy') : next();
};

exports.checkUserExistanceByEmailAndHash = async (req, res, next) => {
  const users = await DB.readUsersByEmailAndHash(req.body.email, req.body.hash);

  users.length === 1
    ? next()
    : res.status(500).json('The account to be activated cannot be found');
};

exports.checkGenderValidity = async (req, res, next) =>
  req.body.gender === MALE || req.body.gender === FEMALE
    ? next()
    : res.status(500).json('Invalid gender');

exports.checkPreferencesValidity = async (req, res, next) =>
  req.body.preferences === HETERO ||
  req.body.preferences === HOMO ||
  req.body.preferences === BI
    ? next()
    : res.status(500).json('Invalid preferences');

exports.checkInterestsValidity = async (req, res, next) =>
  Array.isArray(req.body.interests) &&
  req.body.interests.every(interest => interest === interest.toString())
    ? next()
    : res.status(500).json('Invalid interest');

exports.checkLocationValidity = async (req, res, next) =>
  Array.isArray(req.body.location) &&
  req.body.location.length === 2 &&
  req.body.location.every(coord => coord === parseFloat(coord))
    ? next()
    : res.status(500).json('Invalid location');
