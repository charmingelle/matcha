const express = require('express');
const app = express();
const port = 5000;
const pgp = require('pg-promise')(/*options*/);
// const db = pgp('postgres://grevenko:postgres@localhost:5432/matcha');
const db = pgp('postgres://postgres:123456@localhost:5432/matcha');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const fs = require('fs');
const bcrypt = require('bcrypt');
const { check } = require('express-validator/check');

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.listen(port, () => console.log(`The server is running on port ${port}`));

app.post('/getUserProfile', (req, res) => {
  Promise.all([
    db.any('SELECT * FROM users WHERE id = $1', [req.body.id]),
    db.any('SELECT interest FROM interests')
  ])
    .then(data =>
      res.send(
        JSON.stringify({
          user: data[0][0],
          allInterests: data[1].map(interest => interest.interest)
        })
      )
    )
    .catch(error => console.error('ERROR:', error));
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

app.post('/saveUserPhoto', (req, res) => {
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

app.post('/setAvatar', (req, res) => {
  db.any('UPDATE users SET avatarid = $1 WHERE id = $2', [
    req.body.avatarid,
    req.body.userid
  ]);
});

app.post('/saveLocation', (req, res) => {
  db.any('UPDATE users SET location = ${location} WHERE id = ${userid}', {
    location: req.body.location,
    userid: req.body.userid
  });
});

app.post('/getUsers', (req, res) => {
  db.any('SELECT * FROM users').then(data => res.send(JSON.stringify(data)));
});

app.post('/signin', (req, res) => {
  db.any(
    'SELECT * FROM users WHERE login = ${login} AND password = ${password}',
    {
      login: req.body.login,
      password: req.body.password
    }
  ).then(data => {
    if (data.length === 1) {
      res.status(200).send();
    } else {
      res
        .status(500)
        .send(JSON.stringify({ result: 'Invalid email or password' }));
    }
  });
});

app.post('/signun', (req, res) => {
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
              .then(data => res.status(200).send(JSON.stringify(data)))
          );
        });
      });
    } else {
      res
        .status(500)
        .send(
          JSON.stringify({ result: 'Your email or login is busy' })
        );
    }
  });
});
