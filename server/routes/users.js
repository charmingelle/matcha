const express = require('express');
const router = express.Router();
const { isSignedIn } = require('../middleware/auth');
const { filterUsersData } = require('../utils');
const DB = require('../DB');

router.get('/suggestions', isSignedIn, async (req, res) =>
  res.json(filterUsersData(await DB.readSuggestions(req.session.login))),
);

router.get('/visited', isSignedIn, async (req, res) => {
  const [{ visited }] = await DB.readUser(req.session.login);

  return visited.length > 0
    ? res.json(filterUsersData(await DB.readUsers(visited)))
    : res.json([]);
});

router.patch('/visited', isSignedIn, async (req, res) => {
  const [{ visited }] = await DB.readUser(req.session.login);

  await DB.updateUserVisited(req.session.login, [...visited, req.body.visited]);

  const [{ visited: updatedVisited }] = await DB.readUser(req.session.login);

  res.json(await DB.readUsers(updatedVisited));
});

router.patch('/:login/fake', isSignedIn, async (req, res) => {
  await DB.updateUserFake(req.params.login);

  const [user] = filterUsersData(await DB.readUser(req.params.login));

  res.json(user);
});

router.get('/:login/likeStatus', isSignedIn, async (req, res) => {
  const likes = await DB.readLike(req.session.login, req.params.login);

  res.json(likes.length === 0);
});

router.patch('/:login/block', isSignedIn, async (req, res) =>
  res.json(await DB.createBlock(req.session.login, req.params.login)),
);

module.exports = router;
