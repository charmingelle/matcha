const returnResOrError = async res => {
  if (res.ok && res.json) {
    return res.json();
  }
  throw new Error(await res.json());
};

export const getUserProfile = () =>
  fetch('/profile', {
    method: 'GET',
    credentials: 'include',
  }).then(res => returnResOrError(res));

export const saveUserProfile = userInfo =>
  fetch('/profile/info', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(userInfo),
  }).then(res => returnResOrError(res));

export const savePhoto = (photo, photoid) =>
  fetch('/profile/photo', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ photo, photoid }),
  }).then(res => returnResOrError(res));

export const setAvatar = avatarid =>
  fetch('/profile/avatar', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ avatarid }),
  });

export const saveLocation = location =>
  fetch('/profile/location', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ location }),
  });

export const signin = (login, password) =>
  fetch('/app/signin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ login, password }),
  }).then(res => returnResOrError(res));

export const signout = () =>
  fetch('/profile/signout', {
    method: 'PATCH',
    credentials: 'include',
  });

export const signup = (email, login, password, firstname, lastname) =>
  fetch('/profile/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, login, password, firstname, lastname }),
  }).then(res => returnResOrError(res));

export const getResetPasswordEmail = email =>
  fetch('app/password/reset/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email }),
  }).then(res => returnResOrError(res));

export const resetPasswordOrExpired = (email, hash) =>
  fetch('/app/password/reset/link', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, hash }),
  }).then(res => returnResOrError(res));

export const resetPassword = (password, email) =>
  fetch('/app/password/reset', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ password, email }),
  }).then(res => returnResOrError(res));

export const getLikeStatus = login =>
  fetch(`/users/${login}/likeStatus`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  }).then(res => returnResOrError(res));

export const getVisited = () =>
  fetch('/users/visited', {
    method: 'GET',
    credentials: 'include',
  }).then(res => returnResOrError(res));

export const saveVisited = visited =>
  fetch('/users/visited', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ visited }),
  }).then(res => returnResOrError(res));

export const getChatData = () =>
  fetch('/chats', {
    method: 'GET',
    credentials: 'include',
  }).then(res => returnResOrError(res));

export const reportFake = login =>
  fetch(`/users/${login}/fake`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

export const getBlockStatus = login =>
  fetch(`/users/${login}/blockStatus`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  }).then(res => returnResOrError(res));

export const changeBlockStatus = (login, canBlock) =>
  fetch(`/users/${login}/blockStatus/change`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ canBlock }),
  });

export const getSuggestions = () =>
  fetch('/users/suggestions', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  }).then(res => returnResOrError(res));

export const activateAccount = (email, hash) =>
  fetch('/profile/activate', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, hash }),
  }).then(res => returnResOrError(res));
