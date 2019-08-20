const bcrypt = require('bcrypt');

module.exports = (app, db) => {
  app.post('/signinOrMain', (req, res) => {
    if (req.session && req.session.login) {
      db.any('SELECT login FROM users WHERE login = ${login}', {
        login: req.session.login,
      }).then(data => {
        data.length === 1
          ? res.send(JSON.stringify({ result: 'main' }))
          : res.send(JSON.stringify({ result: 'signin' }));
      });
    } else {
      res.send(JSON.stringify({ result: 'signin' }));
    }
  });

  app.post('/signin', (req, res) => {
    db.any('SELECT active, password FROM users WHERE login = ${login}', {
      login: req.body.login,
    }).then(data => {
      if (data.length === 1) {
        if (!data[0].active) {
          res.send(
            JSON.stringify({
              status: 'error',
              result: 'Activate your account first',
            }),
          );
        } else {
          bcrypt.compare(req.body.password, data[0].password).then(result => {
            if (result === true) {
              req.session.login = req.body.login;
              db.any('UPDATE users SET online = true WHERE login = ${login}', {
                login: req.body.login,
              }).then(() => res.send(JSON.stringify({ status: 'success' })));
            } else {
              res.send(
                JSON.stringify({
                  status: 'error',
                  result: 'Invalid login or password',
                }),
              );
            }
          });
        }
      } else {
        res.send(
          JSON.stringify({
            status: 'error',
            result: 'Invalid login or password',
          }),
        );
      }
    });
  });
};
