const { check } = require('express-validator/check');
const bcrypt = require('bcrypt');
const { generateHash } = require('random-hash');
const sendmail = require('sendmail')();

const isEmailValid = email => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return re.test(String(email).toLowerCase());
};

const isLoginValid = value => {
  return value.length >= 6 && /^[a-zA-Z]+[a-zA-Z0-9]*$/.test(String(value));
};

const isPasswordValid = password => {
  return password.length >= 6 && /[a-zA-Z0-9]+/.test(String(password));
};

const isFirstLastNameValid = name => {
  return /^[a-zA-Z]+(-[a-zA-Z])?[a-zA-Z]*$/.test(String(name));
};

module.exports = (app, db, host) => {
  app.post(
    '/signup',
    [
      check('email').isEmpty(),
      check('login').isEmpty(),
      check('password').isEmpty(),
      check('firstname').isEmpty(),
      check('lastname').isEmpty(),
    ],
    (req, res) => {
      if (
        !isEmailValid(req.body.email) ||
        !isLoginValid(req.body.login) ||
        !isPasswordValid(req.body.password) ||
        !isFirstLastNameValid(req.body.firstname) ||
        !isFirstLastNameValid(req.body.lastname)
      ) {
        res.send(
          JSON.stringify({
            status: 'error',
            result: 'One of the fields is invalid',
          }),
        );
        return;
      }
      db.any('SELECT * FROM users WHERE email = ${email} OR login = ${login}', {
        email: req.body.email,
        login: req.body.login,
      }).then(data => {
        if (data.length !== 0) {
          res.send(
            JSON.stringify({
              status: 'error',
              result: 'Your email or login is busy',
            }),
          );
          return;
        }
        bcrypt.genSalt(10, (err, salt) => {
          if (err) {
            return next(err);
          }
          bcrypt.hash(req.body.password, salt, (err, passwordHash) => {
            if (err) {
              return next(err);
            }
            const password = passwordHash;
            const hash = generateHash({
              length: 16,
              charset:
                'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_',
            });
            let hostname = host;

            if (!host) {
              hostname = req.headers.host;
            }
            sendmail(
              {
                from: 'noreply@matcha.com',
                to: req.body.email,
                subject: 'Matcha Registration Confirmation',
                html: `Please active your Matcha account using the following link: http://${hostname}/confirm?email=${
                  req.body.email
                }&hash=${hash}`,
              },
              error => {
                if (error) {
                  res.send(
                    JSON.stringify({
                      status: 'error',
                      result: 'Your email is invalid',
                    }),
                  );
                  return;
                }
                db.any(
                  'INSERT INTO users(email, login, password, firstname, lastname, hash) VALUES(${email}, ${login}, ${password}, ${firstname}, ${lastname}, ${hash})',
                  {
                    email: req.body.email,
                    login: req.body.login,
                    password: password,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    hash,
                  },
                ).then(() =>
                  res.send(
                    JSON.stringify({
                      status: 'success',
                      result: 'Check your email',
                    }),
                  ),
                );
              },
            );
          });
        });
      });
    },
  );

  app.post('/activateAccount', (req, res) => {
    db.any('SELECT * FROM users WHERE email = ${email} AND hash = ${hash}', {
      email: req.body.email,
      hash: req.body.hash,
    }).then(data => {
      if (data.length !== 1) {
        res.send(
          JSON.stringify({
            status: 'error',
            result: 'The account to be activated cannot be found',
          }),
        );
        return;
      }
      db.any(
        "UPDATE users SET active = true, hash = '' WHERE email = ${email}",
        {
          email: req.body.email,
        },
      ).then(() =>
        res.send(
          JSON.stringify({
            status: 'success',
            result: 'Your account has been activated',
          }),
        ),
      );
    });
  });
};
