const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('client-sessions');
const path = require('path');
const appRouter = require('./routes/app');
const profileRouter = require('./routes/profile');
const usersRouter = require('./routes/users');
const chatsRouter = require('./routes/chats');

app.use(bodyParser.json({ limit: '50mb' }));

app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

app.use(
  session({
    cookieName: 'session',
    secret: 'eg[isfd-8yF9-7w2315df{}+Ijsli;;to8',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
    httpOnly: true,
    ephemeral: true,
  }),
);

app.use(express.static(path.join(__dirname, '../client/build')));

app.use(express.static(path.join(__dirname, '../photos')));

app.use('/profile', profileRouter);

app.use('/users', usersRouter);

app.use('/app', appRouter);

app.use('/chats', chatsRouter);

app.use((err, req, res) => err && res.status(500).json(err));

require('./webSocket')(app);
