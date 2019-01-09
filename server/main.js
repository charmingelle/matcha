const { getChatDataFromDB, getSuggestionsFromDB } = require("./common.js");

const sendVisitedToClient = (req, res, db) => {
  db.any("SELECT visited FROM users WHERE login = ${login}", {
    login: req.session.login
  }).then(data => {
    if (data[0].visited.length > 0) {
      db.any("SELECT * FROM users WHERE login IN ($1:csv)", [
        data[0].visited
      ]).then(data => res.send(JSON.stringify(data)));
    } else {
      res.send(JSON.stringify([]));
    }
  });
};

module.exports = (app, requireLogin, db, port) => {
  app.post("/getUserProfile", requireLogin, (req, res) => {
    Promise.all([
      db.any("SELECT * FROM users WHERE login = ${login}", {
        login: req.session.login
      }),
      db.any("SELECT interest FROM interests")
    ]).then(data =>
      res.send(
        JSON.stringify({
          user: data[0][0],
          allInterests: data[1].map(interest => interest.interest)
        })
      )
    );
  });

  app.post("/saveLocation", requireLogin, (req, res) => {
    db.any("UPDATE users SET location = ${location} WHERE login = ${login}", {
      location: req.body.location,
      login: req.session.login
    }).then(() => res.send());
  });

  app.post("/signout", (req, res) => {
    db.any(
      "UPDATE users SET time = ${now}, online = false WHERE login = ${login}",
      {
        now: Date.now(),
        login: req.session.login
      }
    ).then(() => {
      req.session.reset();
      res.redirect(`http://localhost:${port}/`);
    });
  });

  app.post("/getChatData", requireLogin, (req, res) =>
    getChatDataFromDB(req.session.login, db).then(data =>
      res.send(JSON.stringify(data))
    )
  );

  app.post("/getSuggestions", requireLogin, (req, res) =>
    getSuggestionsFromDB(req.session.login, db).then(data =>
      res.send(JSON.stringify(data))
    )
  );

  app.post("/getVisited", requireLogin, (req, res) =>
    sendVisitedToClient(req, res, db)
  );

  app.post("/saveVisited", requireLogin, (req, res) =>
    db
      .any("SELECT visited FROM users WHERE login = ${login}", {
        login: req.session.login
      })
      .then(data => {
        data[0].visited.push(req.body.visited);
        db.any("UPDATE users SET visited = ${visited} WHERE login = ${login}", {
          visited: data[0].visited,
          login: req.session.login
        }).then(() => sendVisitedToClient(req, res, db));
      })
  );
};
