const express = require('express')
const router = express.Router()
const {
  getSlabs,
  getActiveSlab,
  createSlab,
  addTier,
  activateSlab,
  updateSlab
} = require('../controllers/slabs.controller')
const authenticate = require('../middleware/authenticate')
const requireRole = require('../middleware/requireRole')

router.get('/', authenticate, getSlabs)
router.get('/active', authenticate, getActiveSlab)
router.post('/', authenticate, requireRole('admin'), createSlab)
router.put('/:id', authenticate, requireRole('admin'), updateSlab)
router.post('/:id/tiers', authenticate, requireRole('admin'), addTier)
router.post('/:id/activate', authenticate, requireRole('admin'), activateSlab)

module.exports = router