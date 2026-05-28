const express = require('express')
const router = express.Router()
const { getIncentive } = require('../controllers/incentive.controller')
const authenticate = require('../middleware/authenticate')
const requireRole = require('../middleware/requireRole')

router.get('/', authenticate, requireRole('officer'), getIncentive)

module.exports = router