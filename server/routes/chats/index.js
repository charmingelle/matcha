const express = require('express');
const router = express.Router();
const { slashMiddlewareArray } = require('./middleware');
const DB = require('../../DB');

router.get('/', slashMiddlewareArray, async (req, res) => {
  const users = await DB.readUsers(req.likeSendersArdReceivers);
  const userLogins = users.map(({ login }) => login);
  const messages = await DB.readUserMessages(userLogins, req.session.login);
  let chats = {};

  users.forEach(
    ({ login, firstname, lastname, online, gallery, avatarid }) =>
      (chats[login] = {
        name: `${firstname} ${lastname}`,
        online,
        gallery,
        avatarid,
        log: [],
      }),
  );

  messages.forEach(message =>
    message.sender === req.session.login
      ? chats[message.receiver].log.unshift(message)
      : chats[message.sender].log.unshift(message),
  );
  res.json(chats);
});

module.exports = router;
