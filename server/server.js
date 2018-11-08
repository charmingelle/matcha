const express = require('express');
const app = express();
const port = 5000;
const pgp = require('pg-promise')(/*options*/);
const db = pgp('postgres://grevenko:postgres@localhost:5432/matcha');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const fs = require('fs');

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

app.post('/saveUserProfile', (req, res) => {
  console.log('RECEIVED');
  console.log(req.body.userInfo);

  db.one(
    'UPDATE users SET firstname = ${firstname}, lastname = ${lastname}, email = ${email}, gender = ${gender}, preferences = ${preferences}, bio = ${bio}, interests = ${interests}, gallery = ${gallery}, avatarid = ${avatarid} WHERE id = ${id}',
    {
      firstname: req.body.userInfo.firstname,
      lastname: req.body.userInfo.lastname,
      email: req.body.userInfo.email,
      gender: req.body.userInfo.gender,
      preferences: req.body.userInfo.preferences,
      bio: req.body.userInfo.bio,
      interests: req.body.userInfo.interests,
      gallery: req.body.userInfo.gallery,
      avatarid: req.body.userInfo.avatarid,
      id: req.body.userInfo.id
    }
  );
});

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
        db.one('UPDATE users SET gallery = $1 WHERE id = $2', [
          gallery,
          req.body.userid
        ]);
      });
    }
  );
});

app.post('/setAvatar', (req, res) => {
  db.one('UPDATE users SET avatarid = $1 WHERE id = $2', [
    req.body.avatarid,
    req.body.userid
  ]);
});
