const { getChatDataFromDB } = require("./common.js");

module.exports = (app, requireLogin, db) => {
  app.post("/reportFake", requireLogin, (req, res) =>
    db
      .any("UPDATE users SET fake = true WHERE login = ${login}", {
        login: req.body.login
      })
      .then(() => res.end())
  );

  app.post("/getLikeStatus", requireLogin, (req, res) =>
    db
      .any("SELECT * FROM likes WHERE liker = ${liker} AND likee = ${likee}", {
        liker: req.session.login,
        likee: req.body.login
      })
      .then(data => res.send(JSON.stringify({ canLike: !(data.length === 1) })))
  );

  app.post("/changeLikeStatus", requireLogin, (req, res) => {
    if (req.body.canLike) {
      db.any("INSERT INTO likes(liker, likee) VALUES (${liker}, ${likee})", {
        liker: req.session.login,
        likee: req.body.login
      }).then(() =>
        db
          .any("UPDATE users SET fame = fame + 1 WHERE login = ${login}", {
            login: req.body.login
          })
          .then(() =>
            getChatDataFromDB(req.session.login, db).then(data =>
              res.send(JSON.stringify({ chatData: data, step: 1 }))
            )
          )
      );
    } else {
      db.any("DELETE FROM likes WHERE liker = ${liker} AND likee = ${likee}", {
        liker: req.session.login,
        likee: req.body.login
      }).then(() =>
        db
          .any("UPDATE users SET fame = fame - 1 WHERE login = ${login}", {
            login: req.body.login
          })
          .then(() =>
            getChatDataFromDB(req.session.login, db).then(data =>
              res.send(JSON.stringify({ chatData: data, step: -1 }))
            )
          )
      );
    }
  });

  app.post("/getBlockStatus", requireLogin, (req, res) =>
    db
      .any(
        "SELECT * FROM blocks WHERE blocker = ${blocker} AND blockee = ${blockee}",
        {
          blocker: req.session.login,
          blockee: req.body.login
        }
      )
      .then(data =>
        res.send(JSON.stringify({ canBlock: !(data.length === 1) }))
      )
  );

  app.post("/changeBlockStatus", requireLogin, (req, res) => {
    if (req.body.canBlock) {
      db.any(
        "INSERT INTO blocks(blocker, blockee) VALUES (${blocker}, ${blockee})",
        {
          blocker: req.session.login,
          blockee: req.body.login
        }
      ).then(() => res.end());
    } else {
      db.any(
        "DELETE FROM blocks WHERE blocker = ${blocker} AND blockee = ${blockee}",
        {
          blocker: req.session.login,
          blockee: req.body.login
        }
      ).then(() => res.end());
    }
  });
};
