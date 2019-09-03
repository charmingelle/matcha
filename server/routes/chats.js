const express = require('express');
const router = express.Router();
const { isSignedIn } = require('../middleware');
const DB = require('../DB');

const getLikees = async (req, res, next) => {
  const likees = await DB.readLikesBySender(req.session.login);

  if (likees.length) {
    req.likees = likees.map(({ likee }) => likee);
    next();
  } else {
    res.json({});
  }
};

const getLikers = async (req, res, next) => {
  const likers = await DB.readLikesBySendersAndReceiver(
    req.likees,
    req.session.login,
  );

  if (likers.length) {
    req.likers = likers.map(({ liker }) => liker);
    next();
  } else {
    res.json({});
  }
};

router.get('/', [isSignedIn, getLikees, getLikers], async (req, res) => {
  const users = await DB.readUsers(req.likers);
  const userLogins = users.map(({ login }) => login);
  const messages = await DB.readUserMessages(userLogins, req.session.login);
  let chats = {};

  users.forEach(
    ({ login, online, gallery, avatarid }) =>
      (chats[login] = {
        online,
        gallery,
        avatarid,
        log: [],
      }),
  );

  messages.forEach(message =>
    message.sender === req.session.login
      ? chats[message.receiver].log.push(message)
      : chats[message.sender].log.push(message),
  );
  res.json(chats);
});

module.exports = router;
