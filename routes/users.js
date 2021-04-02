const express = require('express');
const router = express.Router();
const User = require('../models/user');
const usersCtrl = require('../controllers/users');

/*---------- Public Routes ----------*/

// full address be like POST /api/users/signup or /api/users/login
router.post('/signup', usersCtrl.signup);
router.post('/login', usersCtrl.login);

module.exports = router;

// // jwt browser-based route testing (delete asap)
// router.get('/loginFormHTML', function(req,res) {
//     let html = "<form action='/api/users/login' method='POST'>"
//     html += "</form>"
//     res.send(html)
// })

// router.get('/signupFormHTML', function(req,res) {
//         // fetch all this user's nests
//         let html = "<form action='/api/users/signup' method='POST'>"
//         html += "Add a nest to user " + req.user.name + ":<br />"
//         html += "Name <input name='name' /><br />"
//         html += "Frequency (in days)<input name='frequency' /><br />"
//         html += "<button>Add</button>"
//         html += "</form>"
//         res.send(html)
// })


