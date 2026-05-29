const express = require('express')
const router = express.Router()
const {
  getSlabs,
  getActiveSlab,
  createSlab,
  addTier,
  activateSlab,
  updateSlab,
  updateTier,
  deleteTier
} = require('../controllers/slabs.controller')
const authenticate = require('../middleware/authenticate')
const requireRole = require('../middleware/requireRole')

// Specific tier routes FIRST (more specific)
router.put('/tiers/:tierId', authenticate, requireRole('admin'), updateTier)
router.delete('/tiers/:tierId', authenticate, requireRole('admin'), deleteTier)

// Then generic slab routes (less specific)
router.get('/', authenticate, getSlabs)
router.get('/active', authenticate, getActiveSlab)
router.post('/', authenticate, requireRole('admin'), createSlab)
router.put('/:id', authenticate, requireRole('admin'), updateSlab)
router.post('/:id/tiers', authenticate, requireRole('admin'), addTier)
router.post('/:id/activate', authenticate, requireRole('admin'), activateSlab)

module.exports = router