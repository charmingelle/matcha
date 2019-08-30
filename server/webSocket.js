const DB = require('./DB');
const MAGIC = require('./magic');

module.exports = app => {
  const io = require('socket.io')(app.listen(5000));
  const chatUsers = {};

  const chatEventHandler = async ({ sender, receiver, message }) => {
    const { time } = await DB.createChatMessage({
      sender,
      receiver,
      message,
      time: Date.now(),
    });

    io.to(chatUsers[sender]).emit('chat', {
      sender,
      receiver,
      message,
      time,
    });
    io.to(chatUsers[receiver]).emit('chat', {
      sender,
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
    const { receiver, sender } = data;
    const { length } = await DB.getLikes(receiver, sender);
    const isLikeBack = length > 0;

    await DB.addLike(sender, receiver);
    await DB.increaseFameByLogin(receiver);

    if (isLikeBack) {
      MAGIC.getChatDataFromDB(sender).then(chatData =>
        io.to(chatUsers[sender]).emit('chatDataUpdate', chatData),
      );
      MAGIC.getChatDataFromDB(receiver).then(chatData =>
        io.to(chatUsers[receiver]).emit('chatDataUpdate', chatData),
      );
      io.to(chatUsers[receiver]).emit('likeBack', data);
    } else {
      MAGIC.getChatDataFromDB(sender).then(chatData =>
        io.to(chatUsers[sender]).emit('chatDataUpdate', chatData),
      );
      io.to(chatUsers[receiver]).emit('like', data);
    }
    const fame = await MAGIC.getFame(receiver);

    io.to(chatUsers[sender]).emit('fameUpdate', { login: receiver, fame });
  };

  const checkEventHandler = data =>
    io.to(chatUsers[data.receiver]).emit('check', data);

  const unlikeEventHandler = async data => {
    const { receiver, sender } = data;
    const { length } = await DB.getLikes(receiver, sender);
    const wasConnected = length > 0;

    await DB.deleteLike(sender, receiver);
    await DB.decreaseFameByLogin(receiver);

    MAGIC.getChatDataFromDB(sender).then(chatData =>
      io.to(chatUsers[sender]).emit('chatDataUpdate', chatData),
    );
    MAGIC.getChatDataFromDB(receiver).then(chatData =>
      io.to(chatUsers[receiver]).emit('chatDataUpdate', chatData),
    );
    wasConnected && io.to(chatUsers[receiver]).emit('unlike', data);
    const fame = await MAGIC.getFame(receiver);

    io.to(chatUsers[sender]).emit('fameUpdate', { login: receiver, fame });
  };

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
