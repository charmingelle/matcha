const returnResOrError = (res, errorText) => {
  if (res.ok) {
    return res.json();
  }
  throw new Error(errorText);
};

export const getUserProfile = () =>
  fetch("/getUserProfile", {
    method: "POST"
  }).then(res => returnResOrError(res, "getUserProfile error"));

export const saveUserProfile = userInfo =>
  fetch("/saveUserProfile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userInfo)
  }).then(res => returnResOrError(res, "saveUserProfile error"));

export const saveUserPhoto = (photo, photoid) =>
  fetch("/saveUserPhoto", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ photo, photoid })
  });

export const setAvatar = avatarid =>
  fetch("/setAvatar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ avatarid })
  });

export const saveLocation = location =>
  fetch("/saveLocation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ location })
  });

export const signinOrMain = () =>
  fetch("/signinOrMain", {
    method: "POST"
  });

export const signin = (login, password) =>
  fetch("/signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ login, password })
  }).then(res => returnResOrError(res, "signin error"));

export const signout = () =>
  fetch("/signout", {
    method: "POST"
  });

export const signup = (email, login, password, firstname, lastname) =>
  fetch("/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, login, password, firstname, lastname })
  }).then(res => returnResOrError(res, "signup error"));

export const getResetPasswordEmail = email =>
  fetch("/getResetPasswordEmail", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  }).then(res => returnResOrError(res, "getResetPasswordEmail error"));

export const resetPassword = (password, email) =>
  fetch("/resetPassword", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password, email })
  });

export const resetPasswordOrExpired = (email, hash) =>
  fetch("/resetPasswordOrExpired", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, hash })
  });

export const getLikeStatus = login =>
  fetch("/getLikeStatus", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ login })
  });

export const changeLikeStatus = (login, canLike) =>
  fetch("/changeLikeStatus", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ login, canLike })
  });

export const getVisited = () =>
  fetch("/getVisited", {
    method: "POST"
  }).then(res => returnResOrError(res, "getVisited error"));

export const saveVisited = visited =>
  fetch("/saveVisited", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ visited })
  }).then(res => returnResOrError(res, "saveVisited error"));

export const getChatData = () =>
  fetch("/getChatData", {
    method: "POST"
  }).then(res => returnResOrError(res, "getChatData error"));

export const saveOnline = () =>
  fetch("/saveOnline", {
    method: "POST"
  });

export const reportFake = login =>
  fetch("/reportFake", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ login })
  });

export const getBlockStatus = login =>
  fetch("/getBlockStatus", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ login })
  });

export const changeBlockStatus = (login, canBlock) =>
  fetch("/changeBlockStatus", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ login, canBlock })
  });

export const getCheckedBy = () =>
  fetch("/getCheckedBy", {
    method: "POST"
  });

export const getLikedBy = () =>
  fetch("/getLikedBy", {
    method: "POST"
  });

export const getSuggestions = () =>
  fetch("/getSuggestions", {
    method: "POST"
  }).then(res => returnResOrError(res, "getSuggestions error"));

export const activateAccount = (email, hash) =>
  fetch("/activateAccount", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, hash })
  }).then(res => returnResOrError(res, "activateAccount error"));
