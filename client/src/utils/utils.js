import React from 'react';

export const MIN_AGE = 18;
export const MAX_AGE = 100;
export const MAX_BIO_SYMBOLS = 300;
export const LATITUDE_LIMIT = 90;
export const LONGITUDE_LIMIT = 180;

export const Context = React.createContext();

export const withContext = Component => props => (
  <Context.Consumer>
    {context => <Component {...props} context={context} />}
  </Context.Consumer>
);

export const isEmailValid = email => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return re.test(String(email).toLowerCase());
};

export const isLoginValid = value => {
  return value.length >= 6 && /^[a-zA-Z]+[a-zA-Z0-9]*$/.test(String(value));
};

export const isPasswordValid = password => {
  return password.length >= 6 && /[a-zA-Z0-9]+/.test(String(password));
};

export const isFirstLastNameValid = password => {
  return /^[a-zA-Z]+(-[a-zA-Z])?[a-zA-Z]*$/.test(String(password));
};

export const isAgeValid = ageString => {
  const intAge = parseInt(ageString);
  const floatAge = parseFloat(ageString);

  return intAge === floatAge && floatAge >= MIN_AGE && floatAge <= MAX_AGE;
};

export const isLatitudeValid = latitudeString => {
  const floatLatidute = parseFloat(latitudeString);

  return floatLatidute >= -LATITUDE_LIMIT && floatLatidute <= LATITUDE_LIMIT;
};

export const isLongitudeValid = longitudeString => {
  const floatLongitude = parseFloat(longitudeString);

  return (
    floatLongitude >= -LONGITUDE_LIMIT && floatLongitude <= LONGITUDE_LIMIT
  );
};
