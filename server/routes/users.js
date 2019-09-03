const express = require('express');
const router = express.Router();
const { isSignedIn } = require('../middleware');
const DB = require('../DB');

router.get('/suggestions', isSignedIn, async (req, res) =>
  res.json(await DB.readSuggestions(req.session.login)),
);

router.get('/visited', isSignedIn, async (req, res) => {
  const [{ visited }] = await DB.readUser(req.session.login);

  return visited.length > 0
    ? res.json(await DB.readUsers(visited))
    : res.json([]);
});

router.patch('/visited', isSignedIn, async (req, res) => {
  const [{ visited }] = await DB.readUser(req.session.login);

  await DB.updateUserVisited(req.session.login, [...visited, req.body.visited]);

  res.json(await DB.readUsers([...visited, req.body.visited]));
});

router.patch('/:login/fake', isSignedIn, async (req, res) => {
  await DB.updateUserFake(req.params.login);

  res.json({ result: 'OK' });
});

router.get('/:login/likeStatus', isSignedIn, async (req, res) => {
  const likes = await DB.readLike(req.session.login, req.params.login);

  res.json({ canLike: likes.length === 0 });
});

router.get('/:login/blockStatus', isSignedIn, async (req, res) => {
  const blocks = await DB.readBlock(req.session.login, req.params.login);

  res.json({ canBlock: blocks.length === 0 });
});

router.patch('/:login/blockStatus/change', isSignedIn, async (req, res) => {
  req.body.canBlock
    ? res.json(await DB.createBlock(req.session.login, req.params.login))
    : res.json(await DB.deleteBlock(req.session.login, req.params.login));
});

module.exports = router;
