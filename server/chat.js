const DB = require('./DB');

module.exports = app => {
  const io = require('socket.io')(app.listen(5000));
  const chatUsers = {};

  io.use((socket, next) => {
    chatUsers[socket.request._query.login] = socket.id;
    next();
  });

  io.on('connection', socket => {
    socket.on('chat', async ({ sender, receiver, message }) => {
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
    });

    socket.on('typing', data =>
      io.to(chatUsers[data.receiver]).emit('typing', data),
    );

    socket.on('stoppedTyping', data =>
      io.to(chatUsers[data.receiver]).emit('stoppedTyping', data),
    );

    socket.on('like', async data => {
      const { receiver, sender } = data;
      const { length } = await DB.getLikes({
        liker: receiver,
        likee: sender,
      });

      length === 0
        ? io.to(chatUsers[receiver]).emit('like', data)
        : getChatDataFromDB(receiver).then(chatData =>
            io.to(chatUsers[receiver]).emit('likeBack', { data, chatData }),
          );
    });

    socket.on('check', data =>
      io.to(chatUsers[data.receiver]).emit('check', data),
    );

    socket.on('unlike', async data => {
      const { receiver, sender } = data;
      const { length } = await DB.getLikes({
        liker: receiver,
        likee: sender,
      });

      if (length !== 0) {
        getChatDataFromDB(receiver).then(chatData =>
          io.to(chatUsers[receiver]).emit('unlike', { data, chatData }),
        );
      }
    });
  });
};
