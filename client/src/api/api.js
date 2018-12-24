export const getUserProfile = () =>
  fetch("/getUserProfile", {
    method: "POST"
  }).then(res => {
    if (res.ok) {
      return res.json();
    }
    throw new Error("Error");
  });

export const getUserProfileByLogin = login =>
  fetch("/getUserProfileByLogin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ login })
  });

export const saveUserProfile = userInfo =>
  fetch("/saveUserProfile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userInfo)
  });

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
  });

export const signout = () =>
  fetch("/signout", {
    method: "POST"
  });

export const signup = (email, login, password, firstname, lastname) =>
  fetch("/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, login, password, firstname, lastname })
  });

export const getUsers = () =>
  fetch("/getUsers", {
    method: "POST",
    headers: { "Content-Type": "application/json" }
  }).then(res => {
    if (!res.ok) {
      throw Error(res.code);
    }

    return res.json();
  });

export const getResetPasswordEmail = email =>
  fetch("/getResetPasswordEmail", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });

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
  }).then(res => {
    if (!res.ok) {
      throw Error(res.code);
    }

    return res.json();
  });

export const saveVisited = visited =>
  fetch("/saveVisited", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ visited })
  }).then(res => {
    if (!res.ok) {
      throw Error(res.code);
    }

    return res.json();
  });

// export const getChatUsers = () =>
//   fetch("/getChatUsers", {
//     method: "POST"
//   }).then(res => {
//     if (res.ok) {
//       return res.json();
//     }
//     throw new Error("Error");
//   });

// export const getChatMessages = () =>
//   fetch("/getChatMessages", {
//     method: "POST"
//   }).then(res => {
//     if (res.ok) {
//       return res.json();
//     }
//     throw new Error("Error");
//   });

export const getChatData = () =>
  fetch("/getChatData", {
    method: "POST"
  }).then(res => {
    if (res.ok) {
      return res.json();
    }
    throw new Error("Error");
  });

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

export const getMessages = (sender, receiver, lastloadedid) =>
  fetch("/getMessages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sender, receiver, lastloadedid })
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
  }).then(res => {
    if (res.ok) {
      return res.json();
    }
    throw new Error("Error");
  });
