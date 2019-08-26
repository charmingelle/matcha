const DB = require('./DB');
const { shouldSelectWomen, shouldSelectMen } = require('./utils');
const crypto = require('crypto');
const fs = require('fs');

class Magic {
  async getUserProfile(login) {
    const [[user], interests] = await Promise.all([
      DB.getUserDetails(login),
      DB.getInterests(),
    ]);

    return {
      user,
      allInterests: interests.map(interest => interest.interest),
    };
  }

  async saveLocation(location, login) {
    DB.saveLocation(location, login);
  }

  async saveLastLoginTime(login) {
    DB.saveLastLoginTime(Date.now(), login);
  }

  async getSuggestionsFromDB(login) {
    const data = await DB.getBlockedUsers(login);
    const blockedUsers = data.map(record => record.blockee);
    const [{ gender, preferences }] = await DB.getGenderAndPreferences(login);

    if (shouldSelectWomen(gender, preferences)) {
      return DB.getWomenWithMyPreferences(login, preferences, blockedUsers);
    }
    if (shouldSelectMen(gender, preferences)) {
      return DB.getMenWithMyPreferences(login, preferences, blockedUsers);
    }
    if (gender === 'male') {
      return DB.getPeopleForBiMan(login, blockedUsers);
    }
    return DB.getPeopleForBiWoman(login, blockedUsers);
  }

  async getChatDataFromDB(login) {
    let likees = await DB.getMyLikees(login);

    if (!likees.length) {
      return {};
    }

    likees = likees.map(record => record.likee);

    let likers = await DB.getMyLikers(likees, login);

    if (!likers.length) {
      return {};
    }

    likers = likers.map(record => record.liker);

    const likersData = await DB.getLikersData(likers);
    let chatData = {};

    likersData.forEach(
      record =>
        (chatData[record.login] = {
          online: record.online,
          gallery: record.gallery,
          avatarid: record.avatarid,
          log: [],
        }),
    );

    const likersLogins = likersData.map(record => record.login);
    const chatUserData = await DB.getChatUserData(likersLogins, login);

    chatUserData.forEach(record =>
      record.sender === login
        ? chatData[record.receiver].log.push(record)
        : chatData[record.sender].log.push(record),
    );
    return chatData;
  }

  async getMyVisitedLogins(login) {
    const [{ visited }] = await DB.getMyVisited(login);

    return visited.length > 0 ? await DB.getMyVisitedLogins(visited) : [];
  }

  async saveVisited(newVisited, login) {
    const [{ visited }] = await DB.getMyVisited(login);

    await DB.updateVisited([...visited, newVisited], login);
  }

  async isEmailBusy(email, login) {
    const emails = await DB.getBusyEmail(email, login);

    return emails.length > 0;
  }

  async saveNewInterests(reqBody) {
    const data = await DB.getInterests();
    const interests = data.map(record => record.interest);
    const toSave = reqBody.interests
      .filter(interest => interests.indexOf(interest) === -1)
      .map(interest => [interest]);

    if (toSave.length > 0) {
      await DB.updateInterests(toSave);
    }
  }

  async updateProfile(reqBody, login) {
    await DB.updateProfile({
      firstname: reqBody.firstname,
      lastname: reqBody.lastname,
      email: reqBody.email,
      age: reqBody.age,
      gender: reqBody.gender,
      preferences: reqBody.preferences,
      bio: reqBody.bio,
      interests: reqBody.interests,
      gallery: reqBody.gallery,
      avatarid: reqBody.avatarid,
      login: login,
    });
    await this.saveNewInterests(reqBody);
  }

  async getLikedBy(login) {
    const data = await DB.getLikers(login);

    return data.length === 0
      ? []
      : await DB.getLikersDetails(data.map(record => record.liker));
  }

  async getCheckedBy(login) {
    const users = await DB.getUsersDetails();

    return users.filter(({ visited }) => visited.includes(login));
  }

  async saveUserPhoto(photo, photoid, login) {
    const fileName = `${crypto.randomBytes(20).toString('hex')}${Date.now()}`;

    await fs.writeFile(
      `photos/${fileName}.png`,
      photo.replace(/^data:image\/png;base64,/, ''),
      'base64',
      async error => {
        if (error) {
          throw error;
        }
        const { gallery } = await DB.getMyGallery(login);

        fs.unlink(`photos/${gallery[photoid]}`, async () => {
          gallery[photoid] = `${fileName}.png`;
          await DB.updateMyGallery(gallery, login);
        });
      },
    );
    return { fileName: `${fileName}.png` };
  }

  async setAvatar(avatarid, login) {
    DB.updateMyAvatar(avatarid, login);
  }

  async signinOrMain(login) {
    const data = await DB.getLoginByLogin(login);

    return data.length === 1 ? { result: 'main' } : { result: 'signin' };
  }

  async signin(req) {
    req.session.login = req.body.login;
    await DB.updateOnlineByLogin(req.body.login);
    return { status: 'success' };
  }

  async like(liker, likee) {
    await DB.addLike(liker, likee);
    await DB.increaseFameByLogin(likee);
    return {
      chatData: await this.getChatDataFromDB(liker),
      step: 1,
    };
  }

  async dislike(liker, likee) {
    await DB.deleteLike(liker, likee);
    await DB.decreaseFameByLogin(likee);
    return {
      chatData: await this.getChatDataFromDB(liker),
      step: -1,
    };
  }

  async block(blocker, blockee) {
    return DB.block(blocker, blockee);
  }

  async unblock(blocker, blockee) {
    return DB.unblock(blocker, blockee);
  }
}

module.exports = new Magic();
