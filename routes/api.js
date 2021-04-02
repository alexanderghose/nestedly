const express = require('express');
const router = express.Router();
let apiCtrl = require('../controllers/api')

router.get('/', apiCtrl.home)

/*---------- Protected Routes ----------*/
router.use(require('../config/auth')); // <------- auth middleware: grabs the JWT
                                          // <------- from the req.body and creates "req.user"

// full route: POST /api/contacts
router.get('/contacts', apiCtrl.getContacts)
router.post('/contacts', apiCtrl.postContact)

router.get('/nests', apiCtrl.getNests)
router.post('/nests', apiCtrl.postNest)

module.exports = router;

// // test routes for testing AJAX (before we'd setup jwts)
// router.get('/test/nests', apiCtrl.testGetNests) 
// router.get('/test/contacts', apiCtrl.testGetContacts)

// // for testing posting via home.ejs (in a browser -- old)
// router.get('/contacts/create', apiCtrl.getHTMLCreateContactForm)
// router.get('/contacts/:id/edit', apiCtrl.getHTMLEditContactForm)
// router.get('/nests/create', apiCtrl.getHTMLCreateNestForm)
// router.get('/contacts/HTML', apiCtrl.getContactsAsHTML)
// router.get('/contacts/:id', apiCtrl.getOneContactAsHTML)

// Google OAuth routes (old. delete asap.)
//const passport = require('passport');
// router.get('/auth/google', passport.authenticate( // oauth login route
//     'google',
//     { scope: ['profile', 'email'] }
// ));
// router.get('/oauth2callback', passport.authenticate( // Google OAuth callback route
//     'google',
//     {
//       successRedirect : '/api/contacts',
//       failureRedirect : '/api/contacts'
//     }
// ));
// router.get('/logout', function(req, res){ // OAuth logout route
//     req.logout();
//     res.redirect('/api/contacts');
// });
