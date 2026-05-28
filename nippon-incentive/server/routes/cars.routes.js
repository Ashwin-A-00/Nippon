const express = require('express')
const router = express.Router()
const { getCars, addCar, updateCar, deleteCar } = require('../controllers/cars.controller')
const authenticate = require('../middleware/authenticate')
const requireRole = require('../middleware/requireRole')

router.get('/', authenticate, getCars)
router.post('/', authenticate, requireRole('admin'), addCar)
router.put('/:id', authenticate, requireRole('admin'), updateCar)
router.delete('/:id', authenticate, requireRole('admin'), deleteCar)

module.exports = router