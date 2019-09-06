const config = require('../config/config');
const format = require('pg-format');
const { shouldSelectWomen, shouldSelectMen } = require('../utils');

class DB {
  constructor() {
    this.db = require('pg-promise')()(config.db.url);
  }

  async createUser({ email, login, password, firstname, lastname, hash }) {
    return this.db.any(
      'INSERT INTO users(email, login, password, firstname, lastname, hash, gallery) VALUES(${email}, ${login}, ${password}, ${firstname}, ${lastname}, ${hash}, ${gallery})',
      {
        email,
        login,
        password,
        firstname,
        lastname,
        hash,
        gallery: ['avatar.png'],
      },
    );
  }

  async readUser(login) {
    return this.db.any('SELECT * FROM users WHERE login = ${login}', { login });
  }

  async readUsers(logins) {
    return this.db.any(
      format('SELECT * FROM users WHERE login IN (%L)', logins),
    );
  }

  async readAllUsers() {
    return this.db.any(
      'SELECT login, firstname, lastname, gallery, avatarid, visited from users',
    );
  }

  async readUsersByEmail(email) {
    return this.db.any('SELECT * FROM users WHERE email = ${email}', {
      email,
    });
  }

  async readUsersByEmailAndHash(email, hash) {
    return this.db.any(
      'SELECT * FROM users WHERE email = ${email} AND hash = ${hash}',
      { email, hash },
    );
  }

  async readUsersWithUserEmail(email, login) {
    return this.db.any(
      'SELECT email FROM users WHERE email = ${email} AND login <> ${login}',
      { email, login },
    );
  }

  async readBlockedUsers(blocker) {
    return this.db.any(
      'SELECT blockee FROM blocks WHERE blocker = ${blocker}',
      {
        blocker,
      },
    );
  }

  async readWomenWithMyPreferences(login, preferences, blockedUsers) {
    return blockedUsers.length
      ? this.db.any(
          format(
            "SELECT * FROM users WHERE login <> '%s' AND gender = 'female' AND preferences IN (%L) AND login NOT IN (%L)",
            login,
            [preferences, 'bisexual'],
            blockedUsers,
          ),
        )
      : this.db.any(
          format(
            "SELECT * FROM users WHERE login <> '%s' AND gender = 'female' AND preferences IN (%L)",
            login,
            [preferences, 'bisexual'],
          ),
        );
  }

  async readMenWithMyPreferences(login, preferences, blockedUsers) {
    return blockedUsers.length
      ? this.db.any(
          format(
            "SELECT * FROM users WHERE login <> '%s' AND gender = 'male' AND preferences IN (%L) AND login NOT IN (%L)",
            login,
            [preferences, 'bisexual'],
            blockedUsers,
          ),
        )
      : this.db.any(
          format(
            "SELECT * FROM users WHERE login <> '%s' AND gender = 'male' AND preferences IN (%L)",
            login,
            [preferences, 'bisexual'],
          ),
        );
  }

  async readPeopleForBiMan(login, blockedUsers) {
    return blockedUsers.length
      ? this.db.any(
          format(
            "SELECT * FROM users WHERE login <> '%s' AND login NOT IN (%L) AND ((gender = 'male' AND preferences IN (%L)) OR (gender = 'female' AND preferences in (%L)))",
            login,
            blockedUsers,
            ['bisexual', 'homosexual'],
            ['bisexual', 'heterosexual'],
          ),
        )
      : this.db.any(
          format(
            "SELECT * FROM users WHERE login <> '%s' AND ((gender = 'male' AND preferences IN (%L)) OR (gender = 'female' AND preferences in (%L)))",
            login,
            ['bisexual', 'homosexual'],
            ['bisexual', 'heterosexual'],
          ),
        );
  }

  async readPeopleForBiWoman(login, blockedUsers) {
    return blockedUsers.length
      ? this.db.any(
          format(
            "SELECT * FROM users WHERE login <> '%s' AND login NOT IN (%L) AND ((gender = 'male' AND preferences IN (%L)) OR (gender = 'female' AND preferences in (%L)))",
            login,
            blockedUsers,
            ['bisexual', 'heterosexual'],
            ['bisexual', 'homosexual'],
          ),
        )
      : this.db.any(
          format(
            "SELECT * FROM users WHERE login <> '%s' AND ((gender = 'male' AND preferences IN (%L)) OR (gender = 'female' AND preferences in (%L)))",
            login,
            ['bisexual', 'heterosexual'],
            ['bisexual', 'homosexual'],
          ),
        );
  }

  async readSuggestions(login) {
    const data = await this.readBlockedUsers(login);
    const blockedUsers = data.map(record => record.blockee);
    const [{ gender, preferences }] = await this.readUser(login);

    if (shouldSelectWomen(gender, preferences)) {
      return this.readWomenWithMyPreferences(login, preferences, blockedUsers);
    }
    if (shouldSelectMen(gender, preferences)) {
      return this.readMenWithMyPreferences(login, preferences, blockedUsers);
    }
    if (gender === 'male') {
      return this.readPeopleForBiMan(login, blockedUsers);
    }
    return this.readPeopleForBiWoman(login, blockedUsers);
  }

  async updateUser({
    firstname,
    lastname,
    email,
    age,
    gender,
    preferences,
    bio,
    interests,
    gallery,
    avatarid,
    login,
  }) {
    return this.db.any(
      'UPDATE users SET firstname = ${firstname}, lastname = ${lastname}, email = ${email}, age = ${age}, gender = ${gender}, preferences = ${preferences}, bio = ${bio}, interests = ${interests}, gallery = ${gallery}, avatarid = ${avatarid} WHERE login = ${login}',
      {
        firstname,
        lastname,
        email,
        age,
        gender,
        preferences,
        bio,
        interests,
        gallery,
        avatarid,
        login,
      },
    );
  }

  async updateUserGallery(login, gallery) {
    return this.db.any(
      'UPDATE users SET gallery = ${gallery} WHERE login = ${login}',
      { gallery, login },
    );
  }

  async updateUserAvatarId(login, avatarid) {
    return this.db.any(
      'UPDATE users SET avatarid = ${avatarid} WHERE login = ${login}',
      { avatarid, login },
    );
  }

  async updateUserLocation(login, location) {
    return this.db.any(
      'UPDATE users SET location = ${location} WHERE login = ${login}',
      { location, login },
    );
  }

  async updateUserTime(login, now) {
    return this.db.any(
      'UPDATE users SET time = ${now}, online = false WHERE login = ${login}',
      { now, login },
    );
  }

  async updateUserOnline(login) {
    return this.db.any(
      'UPDATE users SET online = true WHERE login = ${login}',
      { login },
    );
  }

  async updateUserVisited(login, visited) {
    return this.db.any(
      'UPDATE users SET visited = ${visited} WHERE login = ${login}',
      { visited, login },
    );
  }

  async updateUserFake(login) {
    return this.db.any('UPDATE users SET fake = true WHERE login = ${login}', {
      login,
    });
  }

  async updateUserHashByEmail(hash, email) {
    return this.db.any(
      'UPDATE users SET hash = ${hash} WHERE email = ${email}',
      { hash, email },
    );
  }

  async updateUserActiveByEmail(email) {
    return this.db.any(
      'UPDATE users SET active = true WHERE email = ${email}',
      { email },
    );
  }

  async updateUserPasswordByEmail(password, email) {
    return this.db.any(
      'UPDATE users SET password = ${password} WHERE email = ${email}',
      { password, email },
    );
  }

  async increaseUserFame(login) {
    return this.db.any(
      'UPDATE users SET fame = fame + 1 WHERE login = ${login}',
      { login },
    );
  }

  async decreaseUserFame(login) {
    return this.db.any(
      'UPDATE users SET fame = fame - 1 WHERE login = ${login}',
      { login },
    );
  }

  async createInterests(interests) {
    return this.db.any(
      format('INSERT INTO interests(interest) VALUES %L', interests),
    );
  }

  async readInterests() {
    return this.db.any('SELECT * FROM interests');
  }

  async createLike(liker, likee) {
    return this.db.any(
      'INSERT INTO likes(liker, likee) VALUES (${liker}, ${likee})',
      { liker, likee },
    );
  }

  async readLike(liker, likee) {
    return this.db.any(
      'SELECT * FROM likes WHERE liker = ${liker} AND likee = ${likee}',
      { liker, likee },
    );
  }

  async readLikesBySender(login) {
    return this.db.any('SELECT * FROM likes WHERE liker = ${login}', {
      login,
    });
  }

  async readLikesByReceiver(login) {
    return this.db.any('SELECT * FROM likes WHERE likee = ${login}', {
      login,
    });
  }

  async readLikesBySendersAndReceiver(senders, login) {
    return this.db.any(
      format(
        'SELECT * FROM likes WHERE liker IN (%L) AND likee = %L',
        senders,
        login,
      ),
    );
  }

  async deleteLike(liker, likee) {
    return this.db.any(
      'DELETE FROM likes WHERE liker = ${liker} AND likee = ${likee}',
      { liker, likee },
    );
  }

  async createBlock(blocker, blockee) {
    return this.db.any(
      'INSERT INTO blocks(blocker, blockee) VALUES (${blocker}, ${blockee})',
      { blocker, blockee },
    );
  }

  async readBlock(blocker, blockee) {
    return this.db.any(
      'SELECT * FROM blocks WHERE blocker = ${blocker} AND blockee = ${blockee}',
      { blocker, blockee },
    );
  }

  async deleteBlock(blocker, blockee) {
    return this.db.any(
      'DELETE FROM blocks WHERE blocker = ${blocker} AND blockee = ${blockee}',
      { blocker, blockee },
    );
  }

  async createMessage({ sender, receiver, message, time }) {
    return this.db.one(
      'INSERT INTO messages (sender, receiver, message, time) VALUES(${sender}, ${receiver}, ${message}, ${time}) RETURNING id, time',
      {
        sender,
        receiver,
        message,
        time,
      },
    );
  }

  async readUserMessages(likersLogins, login) {
    return this.db.any(
      format(
        "SELECT * FROM messages WHERE (sender IN (%L) AND receiver = '%s') OR (sender = '%s' AND receiver IN (%L)) ORDER BY id DESC",
        likersLogins,
        login,
        login,
        likersLogins,
      ),
    );
  }

  async readUserChats(login) {
    let likes = await this.readLikesBySender(login);

    if (!likes.length) {
      return {};
    }

    const likeReceivers = likes.map(({ likee }) => likee);

    likes = await this.readLikesBySendersAndReceiver(likeReceivers, login);

    if (!likes.length) {
      return {};
    }

    const likeSendersAndReceivers = likes.map(({ liker }) => liker);
    const users = await this.readUsers(likeSendersAndReceivers);
    const userLogins = users.map(({ login }) => login);
    const messages = await this.readUserMessages(userLogins, login);
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
      message.sender === login
        ? chats[message.receiver].log.push(message)
        : chats[message.sender].log.push(message),
    );
    return chats;
  }
}

module.exports = new DB();
