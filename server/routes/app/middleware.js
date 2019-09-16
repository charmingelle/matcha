const DB = require('../../DB');
const bcrypt = require('bcrypt');

const checkIfLoginIsEmpty = (req, res, next) =>
  req.body.login ? next() : res.status(400).json('Empty login');

const checkIfPasswordIsEmpty = (req, res, next) =>
  req.body.password ? next() : res.status(400).json('Empty password');

const checkUserExistance = async (req, res, next) => {
  const users = await DB.readUser(req.body.login);

  if (users.length === 1) {
    req.user = users[0];
    next();
  } else {
    res.status(404).json('Unregistered login');
  }
};

const checkIfAccountIsActive = (req, res, next) =>
  req.user.active
    ? next()
    : res.status(403).json('Activate your account first');

const checkIfPasswordIsValid = async (req, res, next) => {
  const { password: savedPassword } = req.user;
  const passwordCompareResult = await bcrypt.compare(
    req.body.password,
    savedPassword,
  );

  passwordCompareResult === true
    ? next()
    : res.status(400).json('Invalid password');
};

const checkUserExistanceByEmail = async (req, res, next) => {
  const users = await DB.readUsersByEmail(req.body.email);

  if (users.length === 1) {
    req.user = users[0];
    next();
  } else {
    res.status(400).json('Invalid email');
  }
};

exports.hasHashExpired = async (req, res, next) => {
  const users = await DB.readUsersByEmail(req.body.email);

  users.length !== 1 || users[0].hash !== req.body.hash
    ? res.status(410).json('Expired')
    : next();
};

exports.signinMiddlewareArray = [
  checkIfLoginIsEmpty,
  checkIfPasswordIsEmpty,
  checkUserExistance,
  checkIfAccountIsActive,
  checkIfPasswordIsValid,
];

exports.passwordResetEmailMiddlewareArray = [
  checkUserExistanceByEmail,
  checkIfAccountIsActive,
];
