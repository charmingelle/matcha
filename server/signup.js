const bcrypt = require('bcrypt');
const { generateHash } = require('random-hash');
const sendmail = require('sendmail')();

module.exports = (app, db) => {
  app.post('/signup', (req, res) => {
    db.any('SELECT * FROM users WHERE email = ${email} OR login = ${login}', {
      email: req.body.email,
      login: req.body.login
    }).then(data => {
      if (data.length === 0) {
        console.log('NEW USER');
        bcrypt.genSalt(10, (err, salt) => {
          if (err) {
            return next(err);
          }
          bcrypt.hash(req.body.password, salt, (err, hash) => {
            if (err) {
              return next(err);
            }
            const password = hash;
            const tempHash = generateHash({
              length: 16,
              charset:
                'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_'
            });

            console.log('BEFORE DB INSERT');
            db.any(
              'INSERT INTO users(email, login, password, firstname, lastname, hash) VALUES(${email}, ${login}, ${password}, ${firstname}, ${lastname}, ${hash})',
              {
                email: req.body.email,
                login: req.body.login,
                password: password,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                hash: tempHash
              }
            ).then(() =>
              sendmail(
                {
                  from: 'noreply@matcha.com',
                  to: req.body.email,
                  subject: 'Matcha Registration Confirmation',
                  // html: `Please active your Matcha account using the following link: http://localhost:3000/confirm?email=${
                  //   req.body.email
                  // }&hash=${hash}`
                  html: `Please active your Matcha account using the following link: http://localhost:5000/confirm?email=${
                    req.body.email
                  }&hash=${hash}`
                },
                error => {
                  if (error) {
                    db.any('DELETE FROM users WHERE id = ${id}', {
                      id: data.id
                    }).then(() =>
                      res.send(
                        JSON.stringify({
                          status: 'error',
                          result: 'Your email is invalid'
                        })
                      )
                    );
                  } else {
                    res.send(
                      JSON.stringify({
                        status: 'success',
                        result: 'Check your email'
                      })
                    );
                  }
                }
              )
            );
          });
        });
      } else {
        res.send(
          JSON.stringify({
            status: 'error',
            result: 'Your email or login is busy'
          })
        );
      }
    });
  });

  app.get('/confirm', (req, res) => {
    db.any('SELECT * FROM users WHERE email = ${email} AND hash = ${hash}', {
      email: req.query.email,
      hash: req.query.hash
    }).then(data => {
      if (data.length === 1) {
        db.any(
          "UPDATE users SET active = true, hash = '' WHERE email = ${email}",
          {
            email: req.query.email
          }
        ).then(() => {
          // res.redirect("http://localhost:3000/");
          res.redirect('http://localhost:5000/');
        });
      } else {
        res.end();
      }
    });
  });
};

const isNotEmpty = param => param !== '';

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

const isFirstLastNameValid = password => {
  return /^[a-zA-Z]+(-[a-zA-Z])?[a-zA-Z]*$/.test(String(password));
};
