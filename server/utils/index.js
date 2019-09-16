const config = require('../config/config');
const { generateHash } = require('random-hash');
const {
  MALE,
  FEMALE,
  HETERO,
  HOMO,
  HASH_LENGTH,
  HASH_CHARSET,
} = require('../constants');
const nodemailer = require('nodemailer');

exports.shouldSelectWomen = (gender, preferences) =>
  (gender === MALE && preferences === HETERO) ||
  (gender === FEMALE && preferences === HOMO);

exports.shouldSelectMen = (gender, preferences) =>
  (gender === FEMALE && preferences === HETERO) ||
  (gender === MALE && preferences === HOMO);

exports.isEmailValid = email => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return re.test(String(email).toLowerCase());
};

exports.isLoginValid = value =>
  value.length >= 6 && /^[a-zA-Z]+[a-zA-Z0-9]*$/.test(String(value));

exports.isPasswordValid = password =>
  password.length >= 6 && /[a-zA-Z0-9]+/.test(String(password));

exports.isFirstLastNameValid = name =>
  /^[a-zA-Z]+(-[a-zA-Z])?[a-zA-Z]*$/.test(String(name));

exports.gethash = () =>
  generateHash({
    length: HASH_LENGTH,
    charset: HASH_CHARSET,
  });

exports.transport = nodemailer.createTransport(config.nodemailerOptions);

exports.filterUsersData = users =>
  users.map(
    ({
      firstname,
      lastname,
      email,
      age,
      gender,
      preferences,
      bio,
      interests,
      gallery,
      avatarid,
      login,
      time,
      online,
      location,
      fame,
      fake,
    }) => ({
      firstname,
      lastname,
      email,
      age,
      gender,
      preferences,
      bio,
      interests,
      gallery,
      avatarid,
      login,
      time,
      online,
      location,
      fame,
      fake,
    }),
  );

exports.isDomainOriginal = domain =>
  (process.env.NODE_ENV === config.dev && domain === config.host) ||
  (process.env.NODE_ENV === config.prod && domain === config.domain);
