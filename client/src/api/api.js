export const getUserProfile = () =>
  fetch('/getUserProfile', {
    method: 'POST'
  });

export const getUserProfileByLogin = login =>
  fetch('/getUserProfileByLogin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login })
  });

export const saveUserProfile = userInfo =>
  fetch('/saveUserProfile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userInfo)
  });

export const saveUserPhoto = (photo, photoid) =>
  fetch('/saveUserPhoto', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ photo, photoid })
  });

export const setAvatar = avatarid =>
  fetch('/setAvatar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ avatarid })
  });

export const saveLocation = location =>
  fetch('/saveLocation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ location })
  });

export const signinOrMain = () =>
  fetch('/signinOrMain', {
    method: 'POST'
  });

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

export const getResetPasswordEmail = email =>
  fetch('/getResetPasswordEmail', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });

export const resetPassword = (password, email) =>
  fetch('/resetPassword', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password, email })
  });

export const resetPasswordOrExpired = (email, hash) =>
  fetch('/resetPasswordOrExpired', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, hash })
  });

export const getLikeStatus = login =>
  fetch('/getLikeStatus', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login })
  });

export const changeLikeStatus = (login, canLike) =>
  fetch('/changeLikeStatus', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login, canLike })
  });
