const express = require('express');
const authRoutes = require('./auth.routes');
const carsRoutes = require('./cars.routes');
const slabsRoutes = require('./slabs.routes');
const salesRoutes = require('./sales.routes');
const incentiveRoutes = require('./incentive.routes');
const { fail } = require('../utils/apiResponse');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/cars', carsRoutes);
router.use('/slabs', slabsRoutes);
router.use('/sales', salesRoutes);
router.use('/incentive', incentiveRoutes);

router.use((req, res) => fail(res, 'The requested endpoint was not found.', 404));

module.exports = router;
