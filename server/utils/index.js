const config = require('../config/config');
const { generateHash } = require('random-hash');
const {
  MALE,
  FEMALE,
  HETERO,
  HOMO,
  BI,
  HASH_LENGTH,
  HASH_CHARSET,
  MIN_AGE,
  MAX_AGE,
  LATITUDE_LIMIT,
  LONGITUDE_LIMIT,
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

exports.isAgeValid = age =>
  parseFloat(age) === parseInt(age) && age >= MIN_AGE && age <= MAX_AGE;

exports.isGenderValid = gender => gender === MALE || gender === FEMALE;

exports.arePreferencesValid = preferences =>
  preferences === HETERO || preferences === HOMO || preferences === BI;

exports.isLatitudeValid = latitude =>
  latitude === parseFloat(latitude) &&
  latitude >= -LATITUDE_LIMIT &&
  latitude <= LATITUDE_LIMIT;

exports.isLongitudeValid = longitude =>
  longitude === parseFloat(longitude) &&
  longitude >= -LONGITUDE_LIMIT &&
  longitude <= LONGITUDE_LIMIT;

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
      locatable,
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
      locatable,
      location,
      fame,
      fake,
    }),
  );

exports.isDomainOriginal = domain =>
  (process.env.NODE_ENV === config.dev && domain === config.host) ||
  (process.env.NODE_ENV === config.prod && domain === config.domain);
