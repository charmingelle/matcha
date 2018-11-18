export const getUserProfile = id =>
  fetch('/getUserProfile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  });

export const saveUserProfile = userInfo =>
  fetch('/saveUserProfile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userInfo)
  });

export const saveUserPhoto = (userid, photo, photoid) =>
  fetch('/saveUserPhoto', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userid, photo, photoid })
  });

export const setAvatar = (userid, avatarid) =>
  fetch('/setAvatar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userid, avatarid })
  });

export const saveLocation = (userid, location) =>
  fetch('/saveLocation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userid, location })
  });

export const signinOrMain = () => {
  return fetch('/signinOrMain', {
    method: 'POST'
  })
};

export const signin = (login, password) =>
  fetch('/signin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login, password })
  });

export const signout = () =>
  fetch('/signout', {
    method: 'POST'
  });

export const signup = (email, login, password, firstname, lastname) =>
  fetch('/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, login, password, firstname, lastname })
  });

export const getUsers = () =>
  fetch('/getUsers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }).then(res => {
    if (!res.ok) {
      throw Error(res.code);
    }

    return res.json();
  });
