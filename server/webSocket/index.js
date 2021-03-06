const config = require('../config/config');
const { isDomainOriginal } = require('../utils/index');
const DB = require('../DB');

module.exports = app => {
  const io = require('socket.io')(app.listen(config.port));
  const chatUsers = {};

  const updateSenderReceiverChatData = (sender, receiver) => {
    DB.readUserChats(sender).then(chatData =>
      io.to(chatUsers[sender]).emit('chatDataUpdate', chatData),
    );
    DB.readUserChats(receiver).then(chatData =>
      io.to(chatUsers[receiver]).emit('chatDataUpdate', chatData),
    );
  };

  const chatEventHandler = async ({
    sender,
    senderName,
    receiver,
    message,
  }) => {
    const { time } = await DB.createMessage({
      sender,
      receiver,
      message,
      time: Date.now(),
    });

    io.to(chatUsers[sender]).emit('chat', {
      sender,
      senderName,
      receiver,
      message,
      time,
    });
    io.to(chatUsers[receiver]).emit('chat', {
      sender,
      senderName,
      receiver,
      message,
      time,
    });
  };

  const typingEventHandler = data =>
    io.to(chatUsers[data.receiver]).emit('typing', data);

  const stoppedTypingEventHamdler = data =>
    io.to(chatUsers[data.receiver]).emit('stoppedTyping', data);

  const likeEventHandler = async data => {
    const { sender, receiver } = data;
    const { length } = await DB.readLike(receiver, sender);
    const isLikeBack = length > 0;
    const blockedUsersLogins = await DB.getBlockedUsersLogins(data.receiver);
    const notifyReceiver = !blockedUsersLogins.includes(data.sender);

    await DB.createLike(sender, receiver);
    await DB.increaseUserFame(receiver);

    if (isLikeBack) {
      updateSenderReceiverChatData(sender, receiver);
      if (notifyReceiver) {
        io.to(chatUsers[receiver]).emit('likeBack', data);
      }
    } else {
      DB.readUserChats(sender).then(chatData =>
        io.to(chatUsers[sender]).emit('chatDataUpdate', chatData),
      );
      if (notifyReceiver) {
        io.to(chatUsers[receiver]).emit('like', data);
      }
    }
    const [{ fame }] = await DB.readUser(receiver);

    io.to(chatUsers[sender]).emit('fameUpdate', { login: receiver, fame });
  };

  const checkEventHandler = async data => {
    const blockedUsersLogins = await DB.getBlockedUsersLogins(data.receiver);

    if (!blockedUsersLogins.includes(data.sender)) {
      io.to(chatUsers[data.receiver]).emit('check', data);
    }
  };

  const unlikeEventHandler = async data => {
    const { sender, receiver } = data;
    const { length } = await DB.readLike(receiver, sender);
    const wasConnected = length > 0;

    await DB.deleteLike(sender, receiver);
    await DB.decreaseUserFame(receiver);

    updateSenderReceiverChatData(sender, receiver);
    wasConnected && io.to(chatUsers[receiver]).emit('unlike', data);
    const [{ fame }] = await DB.readUser(receiver);

    io.to(chatUsers[sender]).emit('fameUpdate', { login: receiver, fame });
  };

  io.set('authorization', (handshakeData, accept) => {
    var domain = handshakeData.headers.referer
      .replace('http://', '')
      .replace('https://', '')
      .split(/[/?#]/)[0];

    isDomainOriginal(domain) ? accept(null, true) : accept(null, false);
  });

  io.use((socket, next) => {
    chatUsers[socket.request._query.login] = socket.id;
    next();
  });

  io.on('connection', socket => {
    socket.on('chat', chatEventHandler);

    socket.on('typing', typingEventHandler);

    socket.on('stoppedTyping', stoppedTypingEventHamdler);

    socket.on('like', likeEventHandler);

    socket.on('check', checkEventHandler);

    socket.on('unlike', unlikeEventHandler);
  });
};
