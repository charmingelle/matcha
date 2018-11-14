export const isEmailValid = email => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

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
