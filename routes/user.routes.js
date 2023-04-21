const Router = require('express');
const router = new Router();
const userController = require('../controller/user.controller');

const { createUser, getUsers, getOneUser, updateUser, deleteUser } = userController;

router.post('/user', createUser)
router.get('/user', getUsers)
router.get('/user/:id', getOneUser)
router.put('/user/:id', updateUser)
router.delete('/user/:id', deleteUser)

module.exports = router;
