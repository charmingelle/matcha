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
const transport = nodemailer.createTransport(config.nodemailerOptions);

module.exports = {
  shouldSelectWomen(gender, preferences) {
    return (
      (gender === MALE && preferences === HETERO) ||
      (gender === FEMALE && preferences === HOMO)
    );
  },

  shouldSelectMen(gender, preferences) {
    return (
      (gender === FEMALE && preferences === HETERO) ||
      (gender === MALE && preferences === HOMO)
    );
  },

  isEmailValid(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return re.test(String(email).toLowerCase());
  },

  isLoginValid(value) {
    return value.length >= 6 && /^[a-zA-Z]+[a-zA-Z0-9]*$/.test(String(value));
  },

  isPasswordValid(password) {
    return password.length >= 6 && /[a-zA-Z0-9]+/.test(String(password));
  },

  isFirstLastNameValid(name) {
    return /^[a-zA-Z]+(-[a-zA-Z])?[a-zA-Z]*$/.test(String(name));
  },

  gethash() {
    return generateHash({
      length: HASH_LENGTH,
      charset: HASH_CHARSET,
    });
  },

  transport,

  filterUsersData(users) {
    return users.map(
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
  },
};
