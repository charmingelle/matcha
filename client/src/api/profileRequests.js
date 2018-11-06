export const getUserProfile = id =>
  fetch('/getUserProfile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: id })
  }).then(res => {
    if (!res.ok) {
      throw Error(res.code);
    }

    return res.json();
  });

export const saveUserProfile = userInfo =>
  fetch('/saveUserProfile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userInfo: userInfo })
  });