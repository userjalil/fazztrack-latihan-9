const router = require('express').Router()
const routerUser = require('./router_user')

//books router endpoint
router.use("/api/v1", routerUser)

module.exports = router