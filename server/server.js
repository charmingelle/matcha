const express = require('express');
const app = express();
const port = 5000;
const pgp = require('pg-promise')(/*options*/);
const db = pgp('postgres://grevenko:postgres@localhost:5432/matcha');
// const db = pgp('postgres://postgres:123456@localhost:5432/matcha');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const fs = require('fs');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const session = require('client-sessions');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'annar703unit@gmail.com',
    pass: 'eiling357unit'
  }
});
const { check } = require('express-validator/check');
const { generateHash } = require('random-hash');

const requireLogin = (req, res, next) => {
  if (req.session && req.session.user) {
    db.any('SELECT user FROM users WHERE login = ${login}', {
      login: req.session.user
    }).then(data => {
      if (data.length === 1) {
        next();
      } else {
        res.status(500).send(JSON.stringify({ result: 'Not signed in' }));
      }
    });
  } else {
    res.status(500).send(JSON.stringify({ result: 'Not signed in' }));
  }
};

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.listen(port, () => console.log(`The server is running on port ${port}`));

app.use(
  session({
    cookieName: 'session',
    secret: 'eg[isfd-8yF9-7w2315df{}+Ijsli;;to8',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
    httpOnly: true,
    ephemeral: true
  })
);

app.post('/getUserProfile', requireLogin, (req, res) => {
  console.log('getUserProfile is received');
  Promise.all([
    db.any('SELECT * FROM users WHERE id = $1', [req.body.id]),
    db.any('SELECT interest FROM interests')
  ]).then(data =>
    res.status(200).send(
      JSON.stringify({
        user: data[0][0],
        allInterests: data[1].map(interest => interest.interest)
      })
    )
  );
});

const checkBusyEmail = (email, id) => {
  return new Promise((resolve, reject) => {
    db.any('SELECT email FROM users WHERE email = ${email} AND id <> ${id}', {
      email,
      id
    }).then(data => {
      data.length === 0 ? resolve() : reject();
    });
  });
};

const updateProfile = reqBody => {
  return db.any(
    'UPDATE users SET firstname = ${firstname}, lastname = ${lastname}, email = ${email}, age = ${age}, gender = ${gender}, preferences = ${preferences}, bio = ${bio}, interests = ${interests}, gallery = ${gallery}, avatarid = ${avatarid} WHERE id = ${id}',
    {
      firstname: reqBody.firstname,
      lastname: reqBody.lastname,
      email: reqBody.email,
      age: reqBody.age,
      gender: reqBody.gender,
      preferences: reqBody.preferences,
      bio: reqBody.bio,
      interests: reqBody.interests,
      gallery: reqBody.gallery,
      avatarid: reqBody.avatarid,
      id: reqBody.id
    }
  );
};

app.post(
  '/saveUserProfile',
  requireLogin,
  [check('firstname').isEmpty(), check('lastname').isEmpty()],
  (req, res) => {
    checkBusyEmail(req.body.email, req.body.id)
      .then(
        () => updateProfile(req.body),
        () =>
          res
            .status(500)
            .send(JSON.stringify({ result: 'The email address is busy' }))
      )
      .then(() =>
        res
          .status(200)
          .send(JSON.stringify({ result: 'Your data has been changed' }))
      );
  }
);

app.post('/saveUserPhoto', requireLogin, (req, res) => {
  const fileName = crypto.randomBytes(20).toString('hex');

  fs.writeFile(
    `client/public/photos/${fileName}.png`,
    req.body.photo.replace(/^data:image\/png;base64,/, ''),
    'base64',
    err => console.error(err)
  );
  db.one('SELECT gallery FROM users WHERE id = $1', [req.body.userid]).then(
    data => {
      let gallery = data.gallery;

      fs.unlink(`client/public/${gallery[req.body.photoid]}`, () => {
        gallery[req.body.photoid] = `photos/${fileName}.png`;
        db.any('UPDATE users SET gallery = $1 WHERE id = $2', [
          gallery,
          req.body.userid
        ]);
      });
    }
  );
});

app.post('/setAvatar', requireLogin, (req, res) => {
  db.any('UPDATE users SET avatarid = $1 WHERE id = $2', [
    req.body.avatarid,
    req.body.userid
  ]);
});

app.post('/saveLocation', requireLogin, (req, res) => {
  db.any('UPDATE users SET location = ${location} WHERE id = ${userid}', {
    location: req.body.location,
    userid: req.body.userid
  });
});

app.post('/getUsers', requireLogin, (req, res) => {
  console.log('getUsers is received');
  db.any('SELECT * FROM users').then(data => res.send(JSON.stringify(data)));
});

app.post('/signin', (req, res) => {
  db.any('SELECT id, password FROM users WHERE login = ${login}', {
    login: req.body.login
  }).then(data => {
    if (data.length === 1) {
      bcrypt.compare(req.body.password, data[0].password).then(result => {
        if (result === true) {
          req.session.user = req.body.login;
          res.status(200).send(JSON.stringify({ id: data[0].id }));
        } else {
          res
            .status(500)
            .send(JSON.stringify({ result: 'Invalid login or password' }));
        }
      });
    }
  });
});

app.post('/signup', (req, res) => {
  db.any('SELECT * FROM users WHERE email = ${email} OR login = ${login}', {
    email: req.body.email,
    login: req.body.login
  }).then(data => {
    if (data.length === 0) {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          return next(err);
        }
        bcrypt.hash(req.body.password, salt, function(err, hash) {
          if (err) {
            return next(err);
          }
          let password = hash;

          db.any(
            'INSERT INTO users(email, login, password, firstname, lastname) VALUES(${email}, ${login}, ${password}, ${firstname}, ${lastname})',
            {
              email: req.body.email,
              login: req.body.login,
              password: password,
              firstname: req.body.firstname,
              lastname: req.body.lastname
            }
          ).then(() =>
            db
              .one('SELECT id FROM users WHERE login = ${login}', {
                login: req.body.login
              })
              .then(data => {
                const hash = generateHash({
                  length: 16,
                  charset:
                    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_'
                });

                db.any('UPDATE users SET hash = ${hash} WHERE id = ${id}', {
                  hash,
                  id: data.id
                }).then(() =>
                  transporter.sendMail(
                    {
                      from: 'annar703unit@gmail.com',
                      to: req.body.email,
                      subject: 'Matcha Registration Confirmation',
                      text: `Please active your Matcha account using the following link: http://localhost:5000/confirm?email=${
                        req.body.email
                      }&hash=${hash}`
                    },
                    error => {
                      if (error) {
                        console.log('ERROR', error);
                        db.any('DELETE FROM users WHERE id = ${id}', {
                          id: data.id
                        }).then(() =>
                          res.status(500).send(
                            JSON.stringify({
                              result: 'Your email is invalid'
                            })
                          )
                        );
                      } else {
                        res
                          .status(200)
                          .send(JSON.stringify({ result: 'Check your email' }));
                      }
                    }
                  )
                );
              })
          );
        });
      });
    } else {
      res
        .status(500)
        .send(JSON.stringify({ result: 'Your email or login is busy' }));
    }
  });
});

app.post('/signout', (req, res) => {
  req.session.reset();
  res.redirect('http://localhost:3000/');
});

app.post('/signinOrMain', (req, res) => {
  if (req.session && req.session.user) {
    console.log('req.session.user', req.session.user);
    db.any('SELECT user FROM users WHERE login = ${login}', {
      login: req.session.user
    }).then(data => {
      console.log('data', data);
      if (data.length === 1) {
        console.log('MAIN');
        res.send(JSON.stringify({ result: 'main' }));
      } else {
        console.log('SIGN IN 1');
        res.send(JSON.stringify({ result: 'signin' }));
      }
    });
  } else {
    console.log('SIGN IN 2');
    res.send(JSON.stringify({ result: 'signin' }));
  }
});

app.get('/confirm', (req, res) => {
  db.any('SELECT * FROM users WHERE email = ${email} AND hash = ${hash}', {
    email: req.query.email,
    hash: req.query.hash
  }).then(data => {
    if (data.length === 1) {
      db.any(
        'UPDATE users SET active = true, hash = null WHERE email = ${email}',
        {
          email: req.query.email
        }
      ).then(() => {
        res.redirect('http://localhost:3000/');
      });
    } else {
      res.end();
    }
  });
});

app.get('*', (req, res) => {
  res.sendFile('/Users/grevenko/projects/matcha/client/public/index.html');
});
