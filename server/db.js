const format = require('pg-format');

class DB {
  constructor() {
    this.db = require('pg-promise')()(
      'postgres://gannar:postgres@localhost:5432/matcha',
    );
  }

  async createChatMessage({ sender, receiver, message, time }) {
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

  async getLikes(liker, likee) {
    return this.db.any(
      'SELECT * FROM likes WHERE liker = ${liker} AND likee = ${likee}',
      {
        liker,
        likee,
      },
    );
  }

  async getBlockedUsers(blocker) {
    return this.db.any(
      'SELECT blockee FROM blocks WHERE blocker = ${blocker}',
      {
        blocker,
      },
    );
  }

  async getGenderAndPreferences(login) {
    return this.db.any(
      'SELECT gender, preferences FROM users WHERE login = ${login}',
      {
        login,
      },
    );
  }

  async getWomenWithMyPreferences(login, preferences, blockedUsers) {
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

  async getMenWithMyPreferences(login, preferences, blockedUsers) {
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

  async getPeopleForBiMan(login, blockedUsers) {
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

  async getPeopleForBiWoman(login, blockedUsers) {
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

  async getMyLikees(login) {
    return this.db.any('SELECT likee FROM likes WHERE liker = ${login}', {
      login,
    });
  }

  async getMyLikers(likes, login) {
    return this.db.any(
      format(
        'SELECT liker FROM likes WHERE liker IN (%L) AND likee = %L',
        likes,
        login,
      ),
    );
  }

  async getLikersData(likers) {
    return this.db.any(
      format(
        'SELECT login, online, gallery, avatarid FROM users WHERE login IN (%L)',
        likers,
      ),
    );
  }

  async getChatUserData(likersLogins, login) {
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

  async getMyVisited(login) {
    return this.db.any('SELECT visited FROM users WHERE login = ${login}', {
      login,
    });
  }

  async getMyVisitedLogins(visited) {
    return this.db.any('SELECT * FROM users WHERE login IN ($1:csv)', [
      visited,
    ]);
  }

  async getUserDetails(login) {
    return this.db.any('SELECT * FROM users WHERE login = ${login}', {
      login,
    });
  }

  async getInterests() {
    return this.db.any('SELECT interest FROM interests');
  }

  async saveLocation(location, login) {
    return this.db.any(
      'UPDATE users SET location = ${location} WHERE login = ${login}',
      { location, login },
    );
  }

  async saveLastLoginTime(now, login) {
    return this.db.any(
      'UPDATE users SET time = ${now}, online = false WHERE login = ${login}',
      { now, login },
    );
  }

  async updateVisited(visited, login) {
    return this.db.any(
      'UPDATE users SET visited = ${visited} WHERE login = ${login}',
      { visited, login },
    );
  }

  async updateInterests(interests) {
    return this.db.any(
      format('INSERT INTO interests(interest) VALUES %L', interests),
    );
  }

  async updateProfile({
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

  async getBusyEmail(email, login) {
    return this.db.any(
      'SELECT email FROM users WHERE email = ${email} AND login <> ${login}',
      {
        email,
        login,
      },
    );
  }

  async getLikers(likee) {
    return this.db.any('SELECT liker FROM likes WHERE likee = ${likee}', {
      likee,
    });
  }

  async getLikersDetails(likers) {
    return this.db.any(
      format(
        'SELECT login, firstname, lastname, gallery, avatarid FROM users WHERE login IN (%L)',
        likers,
      ),
    );
  }

  async getUsersDetails() {
    return this.db.any(
      'SELECT login, firstname, lastname, gallery, avatarid, visited from users',
    );
  }

  async getMyGallery(login) {
    return this.db.one('SELECT gallery FROM users WHERE login = ${login}', {
      login,
    });
  }

  async updateMyGallery(gallery, login) {
    return this.db.any(
      'UPDATE users SET gallery = ${gallery} WHERE login = ${login}',
      { gallery, login },
    );
  }

  async updateMyAvatar(avatarid, login) {
    return this.db.any(
      'UPDATE users SET avatarid = ${avatarid} WHERE login = ${login}',
      { avatarid, login },
    );
  }

  async getUsersByEmail(email) {
    return this.db.any('SELECT * FROM users WHERE email = ${email}', {
      email,
    });
  }

  async updateHashByEmail(hash, email) {
    return this.db.any(
      'UPDATE users SET hash = ${hash} WHERE email = ${email}',
      { hash, email },
    );
  }

  async updatePasswordByEmail(password, email) {
    return this.db.any(
      'UPDATE users SET password = ${password} WHERE email = ${email}',
      { password, email },
    );
  }

  async getHashByEmail(email) {
    return this.db.any('SELECT hash FROM users WHERE email = ${email}', {
      email,
    });
  }

  async clearHashByEmail(email) {
    return this.db.any("UPDATE users SET hash = '' WHERE email = ${email}", {
      email,
    });
  }

  async getLoginByLogin(login) {
    return this.db.any('SELECT login FROM users WHERE login = ${login}', {
      login,
    });
  }

  async getActiveAndPasswordByLogin(login) {
    return this.db.any(
      'SELECT active, password FROM users WHERE login = ${login}',
      { login },
    );
  }

  async updateOnlineByLogin(login) {
    return this.db.any(
      'UPDATE users SET online = true WHERE login = ${login}',
      {
        login,
      },
    );
  }

  async getUsersByEmailOrLogin(email, login) {
    return this.db.any(
      'SELECT * FROM users WHERE email = ${email} OR login = ${login}',
      { email, login },
    );
  }

  async createUser({ email, login, password, firstname, lastname, hash }) {
    return this.db.any(
      'INSERT INTO users(email, login, password, firstname, lastname, hash) VALUES(${email}, ${login}, ${password}, ${firstname}, ${lastname}, ${hash})',
      { email, login, password, firstname, lastname, hash },
    );
  }

  async getUsersByEmailAndHash(email, hash) {
    return this.db.any(
      'SELECT * FROM users WHERE email = ${email} AND hash = ${hash}',
      { email, hash },
    );
  }

  async updateActiveClearHashByEmail(email) {
    return this.db.any(
      "UPDATE users SET active = true, hash = '' WHERE email = ${email}",
      { email },
    );
  }

  async addLike(liker, likee) {
    return this.db.any(
      'INSERT INTO likes(liker, likee) VALUES (${liker}, ${likee})',
      { liker, likee },
    );
  }

  async increaseFameByLogin(login) {
    return this.db.any(
      'UPDATE users SET fame = fame + 1 WHERE login = ${login}',
      { login },
    );
  }

  async deleteLike(liker, likee) {
    return this.db.any(
      'DELETE FROM likes WHERE liker = ${liker} AND likee = ${likee}',
      { liker, likee },
    );
  }

  async decreaseFameByLogin(login) {
    return this.db.any(
      'UPDATE users SET fame = fame - 1 WHERE login = ${login}',
      { login },
    );
  }

  async block(blocker, blockee) {
    return this.db.any(
      'INSERT INTO blocks(blocker, blockee) VALUES (${blocker}, ${blockee})',
      { blocker, blockee },
    );
  }

  async unblock(blocker, blockee) {
    return this.db.any(
      'DELETE FROM blocks WHERE blocker = ${blocker} AND blockee = ${blockee}',
      { blocker, blockee },
    );
  }

  async markAsFake(login) {
    return this.db.any('UPDATE users SET fake = true WHERE login = ${login}', {
      login,
    });
  }

  async getBlocks(blocker, blockee) {
    return this.db.any(
      'SELECT * FROM blocks WHERE blocker = ${blocker} AND blockee = ${blockee}',
      { blocker, blockee },
    );
  }

  async getUserByLogin(login) {
    return this.db.any('SELECT * FROM users WHERE login = ${login}', { login });
  }
}

module.exports = new DB();
