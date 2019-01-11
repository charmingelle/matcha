const express = require("express");
const app = express();
// const port = 3000;
const port = 5000;
const db = require("pg-promise")()(
  "postgres://grevenko:postgres@localhost:5432/matcha"
);
// const db = require('pg-promise')()(
//   'postgres://postgres:123456@localhost:5432/matcha'
// );
const bodyParser = require("body-parser");
const session = require("client-sessions");
const path = require("path");

app.use(bodyParser.json({ limit: "50mb" }));

app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

app.use(
  session({
    cookieName: "session",
    secret: "eg[isfd-8yF9-7w2315df{}+Ijsli;;to8",
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
    httpOnly: true,
    ephemeral: true
  })
);

// Built React version

app.use(express.static(path.join(__dirname, "./../client/build")));

app.use(express.static(path.join(__dirname, "./../photos")));

const requireLogin = (req, res, next) => {
  if (req.session && req.session.login) {
    db.any("SELECT * FROM users WHERE login = ${login}", {
      login: req.session.login
    }).then(data => {
      if (data.length === 1) {
        next();
      } else {
        res.status(500).send(JSON.stringify({ result: "Not signed in" }));
      }
    });
  } else {
    res.status(500).send(JSON.stringify({ result: "Not signed in" }));
  }
};

require("./main.js")(app, requireLogin, db, port);

require("./profile.js")(app, requireLogin, db);

require("./signin.js")(app, requireLogin, db);

require("./signup.js")(app, db, port);

require("./resetPassword.js")(app, db, port);

require("./user.js")(app, requireLogin, db);

require("./chat.js")(app, db);

// Built React version

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "./../client/build/index.html"));
});
