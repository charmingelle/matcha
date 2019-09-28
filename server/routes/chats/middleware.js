const { isSignedIn } = require('../../middleware/common');
const DB = require('../../DB');

const getLikeReceivers = async (req, res, next) => {
  const likes = await DB.readLikesBySender(req.session.login);

  if (likes.length) {
    req.likeReceivers = likes.map(({ likee }) => likee);
    next();
  } else {
    res.json({});
  }
};

const getLikeSendersAndReceivers = async (req, res, next) => {
  const likers = await DB.readLikesBySendersAndReceiver(
    req.likeReceivers,
    req.session.login,
  );

  if (likers.length) {
    req.likeSendersArdReceivers = likers.map(({ liker }) => liker);
    next();
  } else {
    res.json({});
  }
};

exports.slashMiddlewareArray = [
  isSignedIn,
  getLikeReceivers,
  getLikeSendersAndReceivers,
];
