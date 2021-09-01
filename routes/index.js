const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home_controller')


router.get('/',homeController.home);
router.use('/',require('./posts'));
router.use('/users',require('./users'));



module.exports = router;