const { check } = require("express-validator/check");
const format = require("pg-format");
const fs = require("fs");
const crypto = require("crypto");
const { getSuggestionsFromDB } = require("./common.js");

const saveNewInterests = (reqBody, db) => {
  db.any("SELECT interest FROM interests").then(data => {
    data = data.map(interest => interest.interest);

    let toSave = reqBody.interests.filter(
      interest => data.indexOf(interest) === -1
    );

    toSave = toSave.map(interest => [interest]);

    if (toSave.length >= 1) {
      const query = format("INSERT INTO interests(interest) VALUES %L", toSave);

      db.any(query);
    }
  });
};

const updateProfile = (reqBody, login, db) => {
  return db
    .any(
      "UPDATE users SET firstname = ${firstname}, lastname = ${lastname}, email = ${email}, age = ${age}, gender = ${gender}, preferences = ${preferences}, bio = ${bio}, interests = ${interests}, gallery = ${gallery}, avatarid = ${avatarid} WHERE login = ${login}",
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
    .then(() => saveNewInterests(reqBody, db));
};

const checkBusyEmail = (email, login, db) => {
  return new Promise((resolve, reject) => {
    db.any(
      "SELECT email FROM users WHERE email = ${email} AND login <> ${login}",
      {
        email,
        login
      }
    ).then(data => {
      data.length === 0 ? resolve() : reject();
    });
  });
};

module.exports = (app, requireLogin, db) => {
  app.post(
    "/saveUserProfile",
    requireLogin,
    [check("firstname").isEmpty(), check("lastname").isEmpty()],
    (req, res) => {
      checkBusyEmail(req.body.email, req.session.login, db)
        .then(
          () => updateProfile(req.body, req.session.login, db),
          () =>
            res.send(
              JSON.stringify({
                status: "error",
                result: "The email address is busy"
              })
            )
        )
        .then(() => {
          getSuggestionsFromDB(req.session.login, db).then(data =>
            res.send(
              JSON.stringify({
                status: "success",
                result: "Your data has been changed",
                suggestions: data
              })
            )
          );
        });
    }
  );

  app.post("/getLikedBy", requireLogin, (req, res) =>
    db
      .any("SELECT liker FROM likes WHERE likee = ${likee}", {
        likee: req.session.login
      })
      .then(data => {
        if (data.length !== 0) {
          data = data.map(record => record.liker);
          const query = format(
            "SELECT login, firstname, lastname, gallery, avatarid FROM users WHERE login IN (%L)",
            data
          );

          db.any(query).then(data => res.send(JSON.stringify(data)));
        } else {
          res.send(JSON.stringify([]));
        }
      })
  );

  app.post("/getCheckedBy", requireLogin, (req, res) =>
    db
      .any(
        "SELECT login, firstname, lastname, gallery, avatarid, visited from users"
      )
      .then(data => {
        data = data.filter(record =>
          record.visited.includes(req.session.login)
        );
        res.send(JSON.stringify(data));
      })
  );

  app.post("/saveUserPhoto", requireLogin, (req, res) => {
    const fileName = `${crypto.randomBytes(20).toString("hex")}${Date.now()}`;

    fs.writeFile(
      `photos/${fileName}.png`,
      req.body.photo.replace(/^data:image\/png;base64,/, ""),
      "base64",
      error => {
        if (error) {
          throw error;
        }
        db.one("SELECT gallery FROM users WHERE login = ${login}", {
          login: req.session.login
        }).then(data => {
          let gallery = data.gallery;

          fs.unlink(`photos/${gallery[req.body.photoid]}`, () => {
            gallery[req.body.photoid] = `${fileName}.png`;
            db.any(
              "UPDATE users SET gallery = ${gallery} WHERE login = ${login}",
              {
                gallery,
                login: req.session.login
              }
            ).then(() =>
              res.send(JSON.stringify({ fileName: `${fileName}.png` }))
            );
          });
        });
      }
    );
  });

  app.post("/setAvatar", requireLogin, (req, res) => {
    db.any("UPDATE users SET avatarid = ${avatarid} WHERE login = ${login}", {
      avatarid: req.body.avatarid,
      login: req.session.login
    }).then(() => res.send());
  });
};
