const express = require('express');
const app = express();
const port = 5000;
const pgp = require("pg-promise")(/*options*/);
const db = pgp("postgres://grevenko:postgres@localhost:5432/matcha");
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



db.any("SELECT * FROM interests")
    .then(data => console.log("DATA:", data))
    .catch(error => console.log("ERROR:", error));

// db.one('INSERT INTO interests(interest) VALUES($1) RETURNING id', ['movies'])
//     .then(data => console.log(data.id))
//     .catch(error => console.log('ERROR:', error));



// app.listen(port, () => console.log(`The server is running on port ${port}`));

// app.get('/customers', (req, res) => {
//   const customers = [
//     { id: 1, firstName: 'John', lastName: 'Doe' },
//     { id: 2, firstName: 'Mary', lastName: 'Adams' },
//     { id: 3, firstName: 'Richard', lastName: 'Smith' }
//   ];

//   res.json(customers);
// });

// app.post('/interests', (req, res) => {
//   const interests = ['reading', 'yoga', 'dancing', 'video games', 'diving'];

//   res.json(interests);
// });

// const users = [
//   {
//     gender: 'male',
//     sexPreferences: 'heterosexual',
//     bio: 'I\'m John',
//     interests: ['books'],
//     allInterests: ['books', 'music', 'movies', 'sport'],
//     gallery: [
//       'https://i.ytimg.com/vi/3VWGMXR9dx0/maxresdefault.jpg',
//       'http://creativeanchor.com/wp-content/uploads/2018/03/marvelous-female-portrait-photography-by-kai-bottcher.jpg',
//       'https://i.pinimg.com/originals/39/e9/b3/39e9b39628e745a39f900dc14ee4d9a7.jpg'
//     ],
//   },
//   {
//     gender: 'female',
//     sexPreferences: 'homosexual',
//     bio: 'I\'m Mary',
//     interests: ['music'],
//     allInterests: ['books', 'music', 'movies', 'sport'],
//     gallery: [
//       'https://i.ytimg.com/vi/3VWGMXR9dx0/maxresdefault.jpg',
//       'http://creativeanchor.com/wp-content/uploads/2018/03/marvelous-female-portrait-photography-by-kai-bottcher.jpg',
//       'https://i.pinimg.com/originals/39/e9/b3/39e9b39628e745a39f900dc14ee4d9a7.jpg'
//     ],
//   },
//   {
//     gender: 'male',
//     sexPreferences: 'bisexual',
//     bio: 'I\'m Oscar',
//     interests: ['sport'],
//     allInterests: ['books', 'music', 'movies', 'sport'],
//     gallery: [
//       'https://i.ytimg.com/vi/3VWGMXR9dx0/maxresdefault.jpg',
//       'http://creativeanchor.com/wp-content/uploads/2018/03/marvelous-female-portrait-photography-by-kai-bottcher.jpg',
//       'https://i.pinimg.com/originals/39/e9/b3/39e9b39628e745a39f900dc14ee4d9a7.jpg'
//     ],
//   }
// ];

// app.post('/user', (req, res) => {
//   res.send(JSON.stringify(users[req.body.id]));
// });
