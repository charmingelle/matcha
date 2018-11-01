export const getUser = () =>
  fetch('https://randomuser.me/api/')
    .then(res => {
      if (!res.ok) {
        throw Error(res.code);
      }

      return res.json();
    })
    .then(({ results }) => results);
