export const signout = () =>
  fetch('/signout', {
    method: 'POST'
  });
