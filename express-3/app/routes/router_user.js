const router = require('express').Router()
const { findAllUsers, getUsersById, createNewUsers, updateUsers, deleteUsers } = require('../controller/user_controller')

router.get('/users', findAllUsers)
router.get('/users/:id', getUsersById)
router.post('/users', createNewUsers)
router.patch('/users/:id', updateUsers)
router.delete('/users/:id', deleteUsers)

module.exports = router