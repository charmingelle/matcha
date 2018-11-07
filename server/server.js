const express = require('express');
const app = express();
const port = 5000;
const pgp = require('pg-promise')(/*options*/);
const db = pgp('postgres://grevenko:postgres@localhost:5432/matcha');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Promise.all([db.any("SELECT * FROM users WHERE id = $1", [3]), db.any("SELECT interest FROM interests")])
//   .then(data => {
//     console.log({
//       data: data[0][0],
//       allInterests: data[1].map(interest => interest.interest)
//     });
//   })
//   .catch(error => console.log("ERROR:", error));

// db.any("SELECT * FROM users WHERE id = $1", [3])
//     .then(data => console.log("DATA:", data))
//     .catch(error => console.log("ERROR:", error));

// db.any("SELECT * FROM interests")
//     .then(data => console.log("DATA:", data))
//     .catch(error => console.log("ERROR:", error));

// db.one('INSERT INTO interests(interest) VALUES($1) RETURNING id', ['movies'])
//     .then(data => console.log(data.id))
//     .catch(error => console.log('ERROR:', error));

app.listen(port, () => console.log(`The server is running on port ${port}`));

app.post('/getUserProfile', (req, res) => {
  Promise.all([db.any("SELECT * FROM users WHERE id = $1", [req.body.id]), db.any("SELECT interest FROM interests")])
  .then(data => res.send(
    JSON.stringify({
      user: data[0][0],
      allInterests: data[1].map(interest => interest.interest)
    })))
  .catch(error => console.log("ERROR:", error));
});

app.post('/saveUserProfile', (req, res) => {
  console.log('RECEIVED');
  console.log(req.body.userInfo);
});
