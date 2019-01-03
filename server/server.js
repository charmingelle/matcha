const express = require('express');
const app = express();
const port = 5000;
const pgp = require('pg-promise')(/*options*/);
const db = pgp("postgres://grevenko:postgres@localhost:5432/matcha");
// const db = pgp('postgres://postgres:123456@localhost:5432/matcha');
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

// SET statement_timeout = 0;
// SET lock_timeout = 0;
// SET idle_in_transaction_session_timeout = 0;
// SET client_encoding = 'UTF8';
// SET standard_conforming_strings = on;
// SELECT pg_catalog.set_config('search_path', '', false);
// SET check_function_bodies = false;
// SET client_min_messages = warning;
// SET row_security = off;

// CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;

// COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';

// SET default_tablespace = '';

// SET default_with_oids = false;

// CREATE TABLE public.blocks (
//     id integer NOT NULL,
//     blocker text,
//     blockee text
// );

// ALTER TABLE public.blocks OWNER TO postgres;

// CREATE SEQUENCE public.blocks_id_seq
//     AS integer
//     START WITH 1
//     INCREMENT BY 1
//     NO MINVALUE
//     NO MAXVALUE
//     CACHE 1;

// ALTER TABLE public.blocks_id_seq OWNER TO postgres;

// ALTER SEQUENCE public.blocks_id_seq OWNED BY public.blocks.id;

// CREATE TABLE public.interests (
//     interest text NOT NULL,
//     id integer NOT NULL
// );

// ALTER TABLE public.interests OWNER TO postgres;

// CREATE SEQUENCE public.interests_id_seq
//     AS integer
//     START WITH 1
//     INCREMENT BY 1
//     NO MINVALUE
//     NO MAXVALUE
//     CACHE 1;

// ALTER TABLE public.interests_id_seq OWNER TO postgres;

// ALTER SEQUENCE public.interests_id_seq OWNED BY public.interests.id;

// CREATE TABLE public.likes (
//     id integer NOT NULL,
//     liker text,
//     likee text
// );

// ALTER TABLE public.likes OWNER TO postgres;

// CREATE SEQUENCE public.likes_id_seq
//     AS integer
//     START WITH 1
//     INCREMENT BY 1
//     NO MINVALUE
//     NO MAXVALUE
//     CACHE 1;

// ALTER TABLE public.likes_id_seq OWNER TO postgres;

// ALTER SEQUENCE public.likes_id_seq OWNED BY public.likes.id;

// CREATE TABLE public.messages (
//     id integer NOT NULL,
//     sender text,
//     receiver text,
//     "time" bigint,
//     message text
// );

// ALTER TABLE public.messages OWNER TO postgres;

// CREATE SEQUENCE public.messages_id_seq
//     AS integer
//     START WITH 1
//     INCREMENT BY 1
//     NO MINVALUE
//     NO MAXVALUE
//     CACHE 1;

// ALTER TABLE public.messages_id_seq OWNER TO postgres;

// ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;

// CREATE TABLE public.users (
//     login text NOT NULL,
//     password text NOT NULL,
//     email text NOT NULL,
//     hash character(16),
//     active boolean DEFAULT false NOT NULL,
//     gender character varying(6) DEFAULT 'male'::text NOT NULL,
//     preferences character varying(12) DEFAULT 'heterosexual'::text NOT NULL,
//     bio text DEFAULT ''::text,
//     interests text[] DEFAULT ARRAY[]::text[],
//     gallery text[] DEFAULT ARRAY[]::text[] NOT NULL,
//     id integer NOT NULL,
//     avatarid integer DEFAULT 0 NOT NULL,
//     firstname text DEFAULT 'John'::text NOT NULL,
//     lastname text DEFAULT 'Doe'::text NOT NULL,
//     fame integer DEFAULT 0,
//     location numeric[],
//     age integer DEFAULT 18 NOT NULL,
//     visited text[] DEFAULT ARRAY[]::text[],
//     "time" bigint DEFAULT 0,
//     online boolean DEFAULT false NOT NULL,
//     fake boolean DEFAULT false,
//     CONSTRAINT check_gender CHECK ((((gender)::text = 'male'::text) OR ((gender)::text = 'female'::text))),
//     CONSTRAINT check_preferences CHECK ((((preferences)::text = 'heterosexual'::text) OR ((preferences)::text = 'homosexual'::text) OR ((preferences)::text = 'bisexual'::text)))
// );

// ALTER TABLE public.users OWNER TO postgres;

// CREATE SEQUENCE public.users_id_seq
//     AS integer
//     START WITH 1
//     INCREMENT BY 1
//     NO MINVALUE
//     NO MAXVALUE
//     CACHE 1;

// ALTER TABLE public.users_id_seq OWNER TO postgres;

// ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;

// ALTER TABLE ONLY public.blocks ALTER COLUMN id SET DEFAULT nextval('public.blocks_id_seq'::regclass);

// ALTER TABLE ONLY public.interests ALTER COLUMN id SET DEFAULT nextval('public.interests_id_seq'::regclass);

// ALTER TABLE ONLY public.likes ALTER COLUMN id SET DEFAULT nextval('public.likes_id_seq'::regclass);

// ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);

// ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);

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

const server = app.listen(port, () =>
  console.log(`The server is running on port ${port}`)
);

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
    res.send(
      JSON.stringify({
        user: data[0][0],
        allInterests: data[1].map(interest => interest.interest)
      })
    )
  );
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
          res.send(
            JSON.stringify({
              status: 'error',
              result: 'The email address is busy'
            })
          )
      )
      .then(() => {
        getSuggestionsFromDB(req.session.login).then(data =>
          res.send(
            JSON.stringify({
              status: 'success',
              result: 'Your data has been changed',
              suggestions: data
            })
          )
        );
      });
  }
);

app.post('/saveUserPhoto', requireLogin, (req, res) => {
  const fileName = `${crypto.randomBytes(20).toString('hex')}${Date.now()}`;

  fs.writeFile(
    `client/public/users/photos/${fileName}.png`,
    req.body.photo.replace(/^data:image\/png;base64,/, ''),
    'base64',
    error => {
      if (error) {
        throw error;
      }
      db.one('SELECT gallery FROM users WHERE login = ${login}', {
        login: req.session.login
      }).then(data => {
        let gallery = data.gallery;

        fs.unlink(
          `client/public/users/photos/${gallery[req.body.photoid]}`,
          () => {
            gallery[req.body.photoid] = `${fileName}.png`;
            db.any(
              'UPDATE users SET gallery = ${gallery} WHERE login = ${login}',
              {
                gallery,
                login: req.session.login
              }
            ).then(() =>
              res.send(JSON.stringify({ fileName: `${fileName}.png` }))
            );
          }
        );
      });
    }
  );
});

app.post('/setAvatar', requireLogin, (req, res) => {
  db.any('UPDATE users SET avatarid = ${avatarid} WHERE login = ${login}', {
    avatarid: req.body.avatarid,
    login: req.session.login
  }).then(() => res.send());
});

app.post('/saveLocation', requireLogin, (req, res) => {
  db.any('UPDATE users SET location = ${location} WHERE login = ${login}', {
    location: req.body.location,
    login: req.session.login
  }).then(() => res.send());
});

app.post('/getUsers', requireLogin, (req, res) => {
  db.any('SELECT blockee FROM blocks WHERE blocker = ${blocker}', {
    blocker: req.session.login
  }).then(data => {
    if (data.length === 0) {
      db.any('SELECT * FROM users').then(data =>
        res.send(JSON.stringify(data))
      );
    } else {
      data = data.map(record => record.blockee);

      const query = format('SELECT * FROM users WHERE login NOT IN (%L)', data);

      db.any(query).then(data => res.send(JSON.stringify(data)));
    }
  });
});

app.post('/signin', (req, res) => {
  db.any('SELECT active, password FROM users WHERE login = ${login}', {
    login: req.body.login
  }).then(data => {
    if (data.length === 1) {
      if (!data[0].active) {
        res.send(
          JSON.stringify({
            status: 'error',
            result: 'Activate your account first'
          })
        );
      } else {
        bcrypt.compare(req.body.password, data[0].password).then(result => {
          if (result === true) {
            req.session.login = req.body.login;
            res.send(JSON.stringify({ status: 'success' }));
          } else {
            res.send(
              JSON.stringify({
                status: 'error',
                result: 'Invalid login or password'
              })
            );
          }
        });
      }
    } else {
      res.send(
        JSON.stringify({ status: 'error', result: 'Invalid login or password' })
      );
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
        bcrypt.hash(req.body.password, salt, (err, hash) => {
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
                        console.error('Error while email sending', error);
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
              })
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
      data.length === 1
        ? res.send(JSON.stringify({ result: 'main' }))
        : res.send(JSON.stringify({ result: 'signin' }));
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
        res.send(
          JSON.stringify({
            status: 'error',
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
              res.send(
                JSON.stringify({
                  status: 'success',
                  result: 'Check your email'
                })
              );
            }
          );
        });
      }
    } else {
      res.send(JSON.stringify({ status: 'error', result: 'Invalid email' }));
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

app.post('/getLikeStatus', requireLogin, (req, res) =>
  db
    .any('SELECT * FROM likes WHERE liker = ${liker} AND likee = ${likee}', {
      liker: req.session.login,
      likee: req.body.login
    })
    .then(data => res.send(JSON.stringify({ canLike: !(data.length === 1) })))
);

app.post('/changeLikeStatus', requireLogin, (req, res) => {
  if (req.body.canLike) {
    db.any('INSERT INTO likes(liker, likee) VALUES (${liker}, ${likee})', {
      liker: req.session.login,
      likee: req.body.login
    }).then(() =>
      db
        .any('UPDATE users SET fame = fame + 1 WHERE login = ${login}', {
          login: req.body.login
        })
        .then(() =>
          getChatDataFromDB(req.session.login).then(data =>
            res.send(JSON.stringify({ chatData: data, step: 1 }))
          )
        )
    );
  } else {
    db.any('DELETE FROM likes WHERE liker = ${liker} AND likee = ${likee}', {
      liker: req.session.login,
      likee: req.body.login
    }).then(() =>
      db
        .any('UPDATE users SET fame = fame - 1 WHERE login = ${login}', {
          login: req.body.login
        })
        .then(() =>
          getChatDataFromDB(req.session.login).then(data =>
            res.send(JSON.stringify({ chatData: data, step: -1 }))
          )
        )
    );
  }
});

const sendVisitedToClient = (req, res) => {
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
};

app.post('/getVisited', requireLogin, (req, res) =>
  sendVisitedToClient(req, res)
);

app.post('/saveVisited', requireLogin, (req, res) =>
  db
    .any('SELECT visited FROM users WHERE login = ${login}', {
      login: req.session.login
    })
    .then(data => {
      data[0].visited.push(req.body.visited);
      db.any('UPDATE users SET visited = ${visited} WHERE login = ${login}', {
        visited: data[0].visited,
        login: req.session.login
      }).then(() => sendVisitedToClient(req, res));
    })
);

const getChatDataFromDB = login => {
  return db
    .any('SELECT likee FROM likes WHERE liker = ${login}', {
      login
    })
    .then(data => {
      if (data.length > 0) {
        data = data.map(record => record.likee);

        const query = format(
          'SELECT liker FROM likes WHERE liker IN (%L) AND likee = %L',
          data,
          login
        );

        return db.any(query).then(data => {
          if (data.length > 0) {
            data = data.map(record => record.liker);

            const query = format(
              'SELECT login, online, gallery, avatarid FROM users WHERE login IN (%L)',
              data
            );
            return db.any(query).then(data => {
              let chatData = {};

              data.forEach(
                record =>
                  (chatData[record.login] = {
                    online: record.online,
                    gallery: record.gallery,
                    avatarid: record.avatarid,
                    log: []
                  })
              );
              data = data.map(record => record.login);

              const query = format(
                "SELECT * FROM messages WHERE (sender IN (%L) AND receiver = '%s') OR (sender = '%s' AND receiver IN (%L)) ORDER BY id DESC",
                data,
                login,
                login,
                data
              );

              return db.any(query).then(data => {
                data.forEach(record => {
                  if (record.sender === login) {
                    chatData[record.receiver].log.push(record);
                  } else {
                    chatData[record.sender].log.push(record);
                  }
                });
                return chatData;
              });
            });
          }
          return [];
        });
      }
      return [];
    });
};

app.post('/getChatData', requireLogin, (req, res) =>
  getChatDataFromDB(req.session.login).then(data =>
    res.send(JSON.stringify(data))
  )
);

app.post('/saveOnline', requireLogin, (req, res) =>
  db.any('UPDATE users SET online = true WHERE login = ${login}', {
    login: req.session.login
  })
);

app.post('/reportFake', requireLogin, (req, res) =>
  db
    .any('UPDATE users SET fake = true WHERE login = ${login}', {
      login: req.body.login
    })
    .then(() => res.end())
);

app.post('/getBlockStatus', requireLogin, (req, res) =>
  db
    .any(
      'SELECT * FROM blocks WHERE blocker = ${blocker} AND blockee = ${blockee}',
      {
        blocker: req.session.login,
        blockee: req.body.login
      }
    )
    .then(data => res.send(JSON.stringify({ canBlock: !(data.length === 1) })))
);

app.post('/changeBlockStatus', requireLogin, (req, res) => {
  if (req.body.canBlock) {
    db.any(
      'INSERT INTO blocks(blocker, blockee) VALUES (${blocker}, ${blockee})',
      {
        blocker: req.session.login,
        blockee: req.body.login
      }
    ).then(() => res.end());
  } else {
    db.any(
      'DELETE FROM blocks WHERE blocker = ${blocker} AND blockee = ${blockee}',
      {
        blocker: req.session.login,
        blockee: req.body.login
      }
    ).then(() => res.end());
  }
});

app.post('/getMessages', requireLogin, (req, res) => {
  let query =
    'SELECT * FROM messages WHERE (sender = ${sender} AND receiver = ${receiver}) OR (sender = ${receiver} AND receiver = ${sender}) ORDER BY time DESC LIMIT 30';

  if (req.body.lastloadedid !== null) {
    query =
      'SELECT * FROM messages WHERE id < ${lastloadedid} AND ((sender = ${sender} AND receiver = ${receiver}) OR (sender = ${receiver} AND receiver = ${sender})) ORDER BY time DESC LIMIT 30';
  }
  db.any(query, {
    sender: req.body.sender,
    receiver: req.body.receiver,
    lastloadedid: req.body.lastloadedid
  }).then(data => {
    if (data.length > 0) {
      res.send(JSON.stringify(data));
    } else {
      res.send(JSON.stringify([]));
    }
  });
});

app.post('/getCheckedBy', requireLogin, (req, res) =>
  db
    .any(
      'SELECT login, firstname, lastname, gallery, avatarid, visited from users'
    )
    .then(data => {
      data = data.filter(record => record.visited.includes(req.session.login));
      res.send(JSON.stringify(data));
    })
);

app.post('/getLikedBy', requireLogin, (req, res) =>
  db
    .any('SELECT liker FROM likes WHERE likee = ${likee}', {
      likee: req.session.login
    })
    .then(data => {
      if (data.length !== 0) {
        data = data.map(record => record.liker);
        const query = format(
          'SELECT login, firstname, lastname, gallery, avatarid FROM users WHERE login IN (%L)',
          data
        );

        db.any(query).then(data => res.send(JSON.stringify(data)));
      } else {
        res.send(JSON.stringify([]));
      }
    })
);

const getSuggestionsFromDB = login => {
  return db
    .any('SELECT gender, preferences FROM users WHERE login = ${login}', {
      login
    })
    .then(data => {
      let request,
        params = {
          login
        };

      if (
        (data[0].gender === 'male' && data[0].preferences === 'heterosexual') ||
        (data[0].gender === 'female' && data[0].preferences === 'homosexual')
      ) {
        request =
          'SELECT * FROM users WHERE login <> ${login} AND gender = ${gender}';
        params.gender = 'female';
      } else if (
        (data[0].gender === 'female' &&
          data[0].preferences === 'heterosexual') ||
        (data[0].gender === 'male' && data[0].preferences === 'homosexual')
      ) {
        request =
          'SELECT * FROM users WHERE login <> ${login} AND gender = ${gender}';
        params.gender = 'male';
      } else {
        request = 'SELECT * FROM users WHERE login <> ${login}';
      }
      return db.any(request, params);
    });
};

app.post('/getSuggestions', requireLogin, (req, res) =>
  getSuggestionsFromDB(req.session.login).then(data =>
    res.send(JSON.stringify(data))
  )
);

// Chat

const io = require('socket.io')(server);
const chatUsers = {};

io.use((socket, next) => {
  chatUsers[socket.request._query.login] = socket.id;
  next();
});

io.on('connection', socket => {
  socket.on('chat', data => {
    db.one(
      'INSERT INTO messages (sender, receiver, message, time) VALUES(${sender}, ${receiver}, ${message}, ${time}) RETURNING id, time',
      {
        sender: data.sender,
        receiver: data.receiver,
        message: data.message,
        time: Date.now()
      }
    ).then(result => {
      io.to(chatUsers[data.sender]).emit('chat', {
        id: result.id,
        sender: data.sender,
        receiver: data.receiver,
        message: data.message,
        time: result.time
      });
      io.to(chatUsers[data.receiver]).emit('chat', {
        id: result.id,
        sender: data.sender,
        receiver: data.receiver,
        message: data.message,
        time: result.time
      });
    });
  });

  socket.on('typing', data =>
    io.to(chatUsers[data.receiver]).emit('typing', data)
  );

  socket.on('stoppedTyping', data =>
    io.to(chatUsers[data.receiver]).emit('stoppedTyping', data)
  );

  socket.on('like', data => {
    db.any('SELECT * FROM likes WHERE liker = ${liker} AND likee = ${likee}', {
      liker: data.receiver,
      likee: data.sender
    }).then(result => {
      if (result.length === 0) {
        io.to(chatUsers[data.receiver]).emit('like', data);
      } else {
        io.to(chatUsers[data.receiver]).emit('likeBack', data);
      }
    });
  });

  socket.on('check', data =>
    io.to(chatUsers[data.receiver]).emit('check', data)
  );

  socket.on('unlike', data => {
    db.any('SELECT * FROM likes WHERE liker = ${liker} AND likee = ${likee}', {
      liker: data.receiver,
      likee: data.sender
    }).then(result => {
      if (result.length !== 0) {
        io.to(chatUsers[data.receiver]).emit('unlike', data);
      }
    });
  });
});
