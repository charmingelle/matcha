const express = require('express');
const router = express.Router();
const { isSignedIn } = require('../middleware/auth');
const DB = require('../DB');

const getLikeReceivers = async (req, res, next) => {
  const likes = await DB.readLikesBySender(req.session.login);

  if (likes.length) {
    req.likeReceivers = likes.map(({ likee }) => likee);
    next();
  } else {
    res.json({});
  }
};

const getLikeSendersAndReceivers = async (req, res, next) => {
  const likers = await DB.readLikesBySendersAndReceiver(
    req.likeReceivers,
    req.session.login,
  );

  if (likers.length) {
    req.likeSendersArdReceivers = likers.map(({ liker }) => liker);
    next();
  } else {
    res.json({});
  }
};

router.get(
  '/',
  [isSignedIn, getLikeReceivers, getLikeSendersAndReceivers],
  async (req, res) => {
    const users = await DB.readUsers(req.likeSendersArdReceivers);
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
  },
);

module.exports = router;
