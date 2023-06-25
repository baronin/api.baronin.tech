const Router = require('express');
const router = new Router();
const userController = require('../controller/user.controller');

const {
  createUser,
  getUsers,
  getOneUser,
  updateUser,
  deleteUser,
  createFakeUsers,
} = userController;

router.post('/user', createUser);
router.post('/create-users', createFakeUsers);
router.get('/user', getUsers);
router.get('/user/:id', getOneUser);
router.put('/user', updateUser);
router.delete('/user', deleteUser);

module.exports = router;
