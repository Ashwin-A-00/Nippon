const express = require('express')
const router = express.Router()
const { getSales, upsertSale } = require('../controllers/sales.controller')
const authenticate = require('../middleware/authenticate')
const requireRole = require('../middleware/requireRole')

router.get('/', authenticate, requireRole('officer'), getSales)
router.post('/', authenticate, requireRole('officer'), upsertSale)

module.exports = router