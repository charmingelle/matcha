const express = require("express");
const app = express();
const host = process.env.MATCHA_MOD == 'dev' ? 'localhost:3000' : null;
// const db = require("pg-promise")()(
//   "postgres://grevenko:postgres@localhost:5432/matcha"
// );
const db = require("pg-promise")()(
  "postgres://gannar:postgres@localhost:5432/matcha"
);
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

require("./main.js")(app, requireLogin, db, host);

require("./profile.js")(app, requireLogin, db);

require("./signin.js")(app, db);

require("./signup.js")(app, db, host);

require("./resetPassword.js")(app, db, host);

require("./user.js")(app, requireLogin, db);

require("./chat.js")(app, db);

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "./../client/build/index.html"));
});
