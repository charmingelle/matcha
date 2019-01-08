const { generateHash } = require('random-hash');
const sendmail = require('sendmail')();
const bcrypt = require('bcrypt');

module.exports = (app, db) => {
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
          }).then(() =>
            sendmail(
              {
                from: 'noreply@matcha.com',
                to: req.body.email,
                subject: 'Reset Your Matcha Password',
                // html: `Please use the following link to reset your Matcha password: http://localhost:3000/reset-password?email=${
                //   req.body.email
                // }&hash=${hash}`
                html: `Please use the following link to reset your Matcha password: http://localhost:5000/reset-password?email=${
                  req.body.email
                }&hash=${hash}`
              },
              error => {
                if (error) {
                  res.send(
                    JSON.stringify({
                      status: 'error',
                      result: 'Something went wrong. Please try again'
                    })
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
        db.any(
          'UPDATE users SET password = ${password} WHERE email = ${email}',
          {
            password: hash,
            email: req.body.email
          }
        ).then(() =>
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
        db.any("UPDATE users SET hash = '' WHERE email = ${email}", {
          email: req.body.email
        }).then(() => res.send(JSON.stringify({ result: 'reset-password' })));
      } else {
        res.send(JSON.stringify({ result: 'expired' }));
      }
    });
  });
};
