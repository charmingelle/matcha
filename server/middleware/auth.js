const DB = require('../DB');

module.exports = {
  async isSignedIn(req, res, next) {
    if (!req.session || !req.session.login) {
      return res.status(401).json('Unauthorized');
    }
    const data = await DB.readUser(req.session.login);

    data.length === 1 ? next() : res.status(401).json('Unauthorized');
  },
};
