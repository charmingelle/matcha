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
