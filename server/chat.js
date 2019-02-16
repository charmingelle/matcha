const { getChatDataFromDB } = require("./common.js");

module.exports = (app, db) => {
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
          sender: data.sender,
          receiver: data.receiver,
          message: data.message,
          time: result.time
        });
        io.to(chatUsers[data.receiver]).emit("chat", {
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
