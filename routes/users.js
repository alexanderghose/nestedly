const express = require('express');
const router = express.Router();
const usersCtrl = require('../controllers/users');

/*---------- Public Routes ----------*/

// full address: POST /api/users/signup  and POST /api/users/login
router.post('/signup', usersCtrl.signup);
router.post('/login', usersCtrl.login);


module.exports = router;

