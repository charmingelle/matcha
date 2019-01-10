const { getChatDataFromDB } = require("./common.js");

module.exports = (app, db) => {
  // const chatUsers = {};

  // const sticky = require('socketio-sticky-session');

  // const options = {
  //   proxy: true, //activate layer 4 patching
  //   header: 'x-forwarded-for', //provide here your header containing the users ip
  //   num: 2, //count of processes to create, defaults to maximum if omitted
  //   sync: {
  //     isSynced: true, //activate synchronization
  //     event: 'mySyncEventCall' //name of the event you're going to call
  //   }
  // };

  // const io = sticky(options, () => {
  //   return require('socket.io')(app.listen(5000));
  // });

  // io.on('connection', socket => {
  //   chatUsers[socket.request._query.login] = socket.id;

  //   socket.on('chat', data => {
  //     db.one(
  //       'INSERT INTO messages (sender, receiver, message, time) VALUES(${sender}, ${receiver}, ${message}, ${time}) RETURNING id, time',
  //       {
  //         sender: data.sender,
  //         receiver: data.receiver,
  //         message: data.message,
  //         time: Date.now()
  //       }
  //     ).then(result => {
  //       io.to(chatUsers[data.sender]).emit('chat', {
  //         id: result.id,
  //         sender: data.sender,
  //         receiver: data.receiver,
  //         message: data.message,
  //         time: result.time
  //       });
  //       io.to(chatUsers[data.receiver]).emit('chat', {
  //         id: result.id,
  //         sender: data.sender,
  //         receiver: data.receiver,
  //         message: data.message,
  //         time: result.time
  //       });
  //     });
  //   });

  //   socket.on('typing', data =>
  //     io.to(chatUsers[data.receiver]).emit('typing', data)
  //   );

  //   socket.on('stoppedTyping', data =>
  //     io.to(chatUsers[data.receiver]).emit('stoppedTyping', data)
  //   );

  //   socket.on('like', data => {
  //     db.any(
  //       'SELECT * FROM likes WHERE liker = ${liker} AND likee = ${likee}',
  //       {
  //         liker: data.receiver,
  //         likee: data.sender
  //       }
  //     ).then(result => {
  //       if (result.length === 0) {
  //         io.to(chatUsers[data.receiver]).emit('like', data);
  //       } else {
  //         io.to(chatUsers[data.receiver]).emit('likeBack', data);
  //       }
  //     });
  //   });

  //   socket.on('check', data =>
  //     io.to(chatUsers[data.receiver]).emit('check', data)
  //   );

  //   socket.on('unlike', data => {
  //     db.any(
  //       'SELECT * FROM likes WHERE liker = ${liker} AND likee = ${likee}',
  //       {
  //         liker: data.receiver,
  //         likee: data.sender
  //       }
  //     ).then(result => {
  //       if (result.length !== 0) {
  //         io.to(chatUsers[data.receiver]).emit('unlike', data);
  //       }
  //     });
  //   });
  // });

  // Without sticky session

  const io = require("socket.io")(app.listen(5000));
  const chatUsers = {};

  io.use((socket, next) => {
    chatUsers[socket.request._query.login] = socket.id;
    next();
  });

  io.on("connection", socket => {
    socket.on("chat", data => {
      db.one(
        "INSERT INTO messages (sender, receiver, message, time) VALUES(${sender}, ${receiver}, ${message}, ${time}) RETURNING id, time",
        {
          sender: data.sender,
          receiver: data.receiver,
          message: data.message,
          time: Date.now()
        }
      ).then(result => {
        io.to(chatUsers[data.sender]).emit("chat", {
          id: result.id,
          sender: data.sender,
          receiver: data.receiver,
          message: data.message,
          time: result.time
        });
        io.to(chatUsers[data.receiver]).emit("chat", {
          id: result.id,
          sender: data.sender,
          receiver: data.receiver,
          message: data.message,
          time: result.time
        });
      });
    });

    socket.on("typing", data =>
      io.to(chatUsers[data.receiver]).emit("typing", data)
    );

    socket.on("stoppedTyping", data =>
      io.to(chatUsers[data.receiver]).emit("stoppedTyping", data)
    );

    socket.on("like", data => {
      db.any(
        "SELECT * FROM likes WHERE liker = ${liker} AND likee = ${likee}",
        {
          liker: data.receiver,
          likee: data.sender
        }
      ).then(result => {
        if (result.length === 0) {
          io.to(chatUsers[data.receiver]).emit("like", data);
        } else {
          getChatDataFromDB(data.receiver, db).then(chatData =>
            io.to(chatUsers[data.receiver]).emit("likeBack", { data, chatData })
          );
        }
      });
    });

    socket.on("check", data =>
      io.to(chatUsers[data.receiver]).emit("check", data)
    );

    socket.on("unlike", data => {
      db.any(
        "SELECT * FROM likes WHERE liker = ${liker} AND likee = ${likee}",
        {
          liker: data.receiver,
          likee: data.sender
        }
      ).then(result => {
        if (result.length !== 0) {
          getChatDataFromDB(data.receiver, db).then(chatData =>
            io.to(chatUsers[data.receiver]).emit("unlike", { data, chatData })
          );
        }
      });
    });
  });
};
