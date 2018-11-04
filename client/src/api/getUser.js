export const getUserProfile = id =>
  fetch('/user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: id })
  })
    .then(res => {
      if (!res.ok) {
        throw Error(res.code);
      }

      return res.json();
    })
