const express = require('express');
const app = express();
const port = 5000;
const pgp = require('pg-promise')(/*options*/);
// const db = pgp('postgres://grevenko:postgres@localhost:5432/matcha');
const db = pgp('postgres://postgres:123456@localhost:5432/matcha');
const format = require('pg-format');
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
  if (req.session && req.session.login) {
    db.any('SELECT * FROM users WHERE login = ${login}', {
      login: req.session.login
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

app.get('*', (req, res) => {
  // res.sendFile('/Users/grevenko/projects/matcha/client/public/index.html');
  res.sendFile('C:/Users/Anna/Documents/unit/matcha/client/public/index.html');
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

app.post('/getUserProfile', requireLogin, (req, res) => {
  Promise.all([
    db.any('SELECT * FROM users WHERE login = ${login}', {
      login: req.session.login
    }),
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

app.post('/getUserProfileByLogin', requireLogin, (req, res) => {
  db.any('SELECT * FROM users WHERE login = ${login}', {
    login: req.body.login
  }).then(data => {
    if (data.length === 1) {
      res.status(200).send(JSON.stringify(data[0]));
    } else {
      res.status(500).send(
        JSON.stringify({
          result: 'User not found'
        })
      );
    }
  });
});

const saveNewInterests = reqBody => {
  db.any('SELECT interest FROM interests').then(data => {
    data = data.map(interest => interest.interest);

    let toSave = reqBody.interests.filter(
      interest => data.indexOf(interest) === -1
    );

    toSave = toSave.map(interest => [interest]);

    if (toSave.length >= 1) {
      const query = format('INSERT INTO interests(interest) VALUES %L', toSave);

      db.any(query);
    }
  });
};

const updateProfile = (reqBody, login) => {
  return db
    .any(
      'UPDATE users SET firstname = ${firstname}, lastname = ${lastname}, email = ${email}, age = ${age}, gender = ${gender}, preferences = ${preferences}, bio = ${bio}, interests = ${interests}, gallery = ${gallery}, avatarid = ${avatarid} WHERE login = ${login}',
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
        login: login
      }
    )
    .then(() => saveNewInterests(reqBody));
};

const checkBusyEmail = (email, login) => {
  return new Promise((resolve, reject) => {
    db.any(
      'SELECT email FROM users WHERE email = ${email} AND login <> ${login}',
      {
        email,
        login
      }
    ).then(data => {
      data.length === 0 ? resolve() : reject();
    });
  });
};

app.post(
  '/saveUserProfile',
  requireLogin,
  [check('firstname').isEmpty(), check('lastname').isEmpty()],
  (req, res) => {
    checkBusyEmail(req.body.email, req.session.login)
      .then(
        () => updateProfile(req.body, req.session.login),
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
  db.one('SELECT gallery FROM users WHERE login = ${login}', {
    login: req.session.login
  }).then(data => {
    let gallery = data.gallery;

    fs.unlink(`client/public/${gallery[req.body.photoid]}`, () => {
      gallery[req.body.photoid] = `${fileName}.png`;
      db.any('UPDATE users SET gallery = ${gallery} WHERE login = ${login}', {
        gallery,
        login: req.session.login
      });
    });
  });
});

app.post('/setAvatar', requireLogin, (req, res) => {
  db.any('UPDATE users SET avatarid = ${avatarid} WHERE login = ${login}', {
    avatarid: req.body.avatarid,
    login: req.session.login
  });
});

app.post('/saveLocation', requireLogin, (req, res) => {
  db.any('UPDATE users SET location = ${location} WHERE login = ${login}', {
    location: req.body.location,
    login: req.session.login
  });
});

app.post('/getUsers', requireLogin, (req, res) => {
  db.any('SELECT * FROM users').then(data => res.send(JSON.stringify(data)));
});

app.post('/signin', (req, res) => {
  db.any('SELECT active, password FROM users WHERE login = ${login}', {
    login: req.body.login
  }).then(data => {
    if (data.length === 1) {
      if (!data[0].active) {
        res
          .status(500)
          .send(JSON.stringify({ result: 'Activate your account first' }));
      } else {
        bcrypt.compare(req.body.password, data[0].password).then(result => {
          if (result === true) {
            req.session.login = req.body.login;
            res.status(200).send();
          } else {
            res
              .status(500)
              .send(JSON.stringify({ result: 'Invalid login or password' }));
          }
        });
      }
    } else {
      res
        .status(500)
        .send(JSON.stringify({ result: 'Invalid login or password' }));
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
                        console.error('ERROR', error);
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
  db.any(
    'UPDATE users SET time = ${now}, online = false WHERE login = ${login}',
    {
      now: Date.now(),
      login: req.session.login
    }
  ).then(() => {
    req.session.reset();
    res.redirect('http://localhost:3000/');
  });
});

app.post('/signinOrMain', (req, res) => {
  if (req.session && req.session.login) {
    db.any('SELECT login FROM users WHERE login = ${login}', {
      login: req.session.login
    }).then(data => {
      if (data.length === 1) {
        res.send(JSON.stringify({ result: 'main' }));
      } else {
        res.send(JSON.stringify({ result: 'signin' }));
      }
    });
  } else {
    res.send(JSON.stringify({ result: 'signin' }));
  }
});

app.post('/getResetPasswordEmail', (req, res) => {
  db.any('SELECT * FROM users WHERE email = ${email}', {
    email: req.body.email
  }).then(data => {
    if (data.length === 1) {
      if (!data[0].active) {
        res.status(500).send(
          JSON.stringify({
            result:
              'Please activate your account using the link received in Matcha Registration Confirmation email first'
          })
        );
      } else {
        const hash = generateHash({
          length: 16,
          charset:
            'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_'
        });

        db.any('UPDATE users SET hash = ${hash} WHERE email = ${email}', {
          hash: hash,
          email: req.body.email
        }).then(() => {
          transporter.sendMail(
            {
              from: 'annar703unit@gmail.com',
              to: req.body.email,
              subject: 'Reset Your Matcha Password',
              text: `Please use the following link to reset your Matcha password: http://localhost:3000/reset-password?email=${
                req.body.email
              }&hash=${hash}`
            },
            () => {
              res
                .status(200)
                .send(JSON.stringify({ result: 'Check your email' }));
            }
          );
        });
      }
    } else {
      res.status(500).send(JSON.stringify({ result: 'Invalid email' }));
    }
  });
});

app.post('/resetPassword', (req, res) => {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(req.body.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      db.any('UPDATE users SET password = ${password} WHERE email = ${email}', {
        password: hash,
        email: req.body.email
      }).then(() =>
        res.send(JSON.stringify({ result: 'Your password has been changed' }))
      );
    });
  });
});

app.post('/resetPasswordOrExpired', (req, res) => {
  db.any('SELECT hash FROM users WHERE email = ${email}', {
    email: req.body.email
  }).then(data => {
    if (data.length !== 1) {
      res.send(JSON.stringify({ result: 'expired' }));
    }
    if (data[0].hash === req.body.hash) {
      db.any('UPDATE users SET hash = null WHERE email = ${email}', {
        email: req.body.email
      }).then(() => res.send(JSON.stringify({ result: 'reset-password' })));
    } else {
      res.send(JSON.stringify({ result: 'expired' }));
    }
  });
});

app.post('/getLikeStatus', requireLogin, (req, res) => {
  db.any('SELECT * FROM likes WHERE liker = ${liker} AND likee = ${likee}', {
    liker: req.session.login,
    likee: req.body.login
  }).then(data => res.send(JSON.stringify({ canLike: !(data.length === 1) })));
});

app.post('/changeLikeStatus', requireLogin, (req, res) => {
  if (req.body.canLike) {
    db.any('INSERT INTO likes(liker, likee) VALUES (${liker}, ${likee})', {
      liker: req.session.login,
      likee: req.body.login
    })
      .then(() =>
        db.any('UPDATE users SET fame = fame + 1 WHERE login = ${login}', {
          login: req.body.login
        })
      )
      .then(() => res.send(JSON.stringify({ step: 1 })));
  } else {
    db.any('DELETE FROM likes WHERE liker = ${liker} AND likee = ${likee}', {
      liker: req.session.login,
      likee: req.body.login
    })
      .then(() =>
        db.any('UPDATE users SET fame = fame - 1 WHERE login = ${login}', {
          login: req.body.login
        })
      )
      .then(() => res.send(JSON.stringify({ step: -1 })));
  }
});

app.post('/getVisited', requireLogin, (req, res) => {
  db.any('SELECT visited FROM users WHERE login = ${login}', {
    login: req.session.login
  }).then(data => {
    if (data[0].visited.length > 0) {
      db.any('SELECT * FROM users WHERE login IN ($1:csv)', [
        data[0].visited
      ]).then(data => res.send(JSON.stringify(data)));
    } else {
      res.send(JSON.stringify([]));
    }
  });
});

app.post('/saveVisited', requireLogin, (req, res) => {
  db.any('UPDATE users SET visited = ${visited} WHERE login = ${login}', {
    visited: req.body.visited,
    login: req.session.login
  });
});

app.post('/getChatLogins', requireLogin, (req, res) => {
  db.any('SELECT likee FROM likes WHERE liker = ${login}', {
    login: req.session.login
  }).then(data => {
    if (data.length > 0) {
      data = data.map(record => record.likee);

      const query = format(
        'SELECT liker FROM likes WHERE liker IN (%L) AND likee = %L',
        data,
        req.session.login
      );

      db.any(query).then(data => {
        if (data.length > 0) {
          res.send(JSON.stringify(data.map(record => record.liker)));
        } else {
          res.send(JSON.stringify([]));
        }
      });
    } else {
      res.send(JSON.stringify([]));
    }
  });
});

app.post('/saveOnline', requireLogin, (req, res) => {
  db.any('UPDATE users SET online = true WHERE login = ${login}', {
    login: req.session.login
  });
});

app.post('/reportFake', requireLogin, (req, res) => {
  db.any('UPDATE users SET fake = true WHERE login = ${login}', {
    login: req.body.login
  });
});
