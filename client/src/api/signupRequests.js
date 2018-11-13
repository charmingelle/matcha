export const signup = (email, login, password, firstname, lastname) =>
  fetch('/signun', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, login, password, firstname, lastname })
  });
