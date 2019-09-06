const express = require('express');
const app = express();
const path = require('path');
const appRouter = require('./routes/app');
const profileRouter = require('./routes/profile');
const usersRouter = require('./routes/users');
const chatsRouter = require('./routes/chats');

require('./middleware/global')(app);

app.use(express.static(path.join(__dirname, '../client/build')));
app.use(express.static(path.join(__dirname, '../photos')));

app.use('/profile', profileRouter);
app.use('/users', usersRouter);
app.use('/app', appRouter);
app.use('/chats', chatsRouter);

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.use((err, req, res) => res.status(500).json(err.message));

require('./webSocket')(app);
