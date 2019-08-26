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
    const { length } = await DB.getLikes({
      liker: receiver,
      likee: sender,
    });

    length === 0
      ? io.to(chatUsers[receiver]).emit('like', data)
      : MAGIC.getChatDataFromDB(receiver).then(chatData =>
          io.to(chatUsers[receiver]).emit('likeBack', { data, chatData }),
        );
  };

  const checkEventHandler = data =>
    io.to(chatUsers[data.receiver]).emit('check', data);

  const unlikeEventHandler = async data => {
    const { receiver, sender } = data;
    const { length } = await DB.getLikes({
      liker: receiver,
      likee: sender,
    });

    if (length !== 0) {
      const chatData = await MAGIC.getChatDataFromDB(receiver);

      io.to(chatUsers[receiver]).emit('unlike', { data, chatData });
    }
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
