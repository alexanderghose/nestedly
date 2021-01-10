const express = require('express');
const router = express.Router();
const passport = require('passport');

let NestModel = require('../models/nest')
let ContactModel = require('../models/contact').ContactModel
let UserModel = require('../models/user')


// ROUTES:
// 1. CRUD Routes (for front-end AJAX to hit).
// 2. Routes for serverside OAuth
// 3. Routes for backend testing

/**
 * 1. CRUD Routes (for front-end AJAX to hit).
 */
router.get('/contacts', async function(req,res) {
    if(req.isAuthenticated()) {
        let currentUser = await UserModel.findById(req.user.id)
        let userContacts = currentUser.contacts;
        res.json(userContacts)
    } else {
        res.send("cannot get contacts. please <a href='/api/auth/google'>login</a>.")
    }
})
router.post('/contacts', function(req,res) { // create a contact.
    if (req.isAuthenticated()) {
        req.user.contacts.push(req.body);
        req.user.save(function(err) {
        res.redirect('/api/contacts');
        });
    } else {
        res.send("cannot create contact. please <a href='/api/auth/google'>login</a>.")
    }
})


/* 
 * 2. Google OAuth routes
 */
router.get('/auth/google', passport.authenticate( // oauth login route
    'google',
    { scope: ['profile', 'email'] }
));
router.get('/oauth2callback', passport.authenticate( // Google OAuth callback route
    'google',
    {
      successRedirect : '/api/contacts',
      failureRedirect : '/api/contacts'
    }
));
router.get('/logout', function(req, res){ // OAuth logout route
    req.logout();
    res.redirect('/api/contacts');
});

/**
 * 3. Routes for backend testing
 */
router.get('/testCreateForm', function(req,res) {
    let html = "<form action='/api/contacts' method='POST'>"
    html += "Add a contact:<br>Name <input name='name' />" // TODO: finish this.. setup a mock ui form for backend testing.
    html += "<button>Add</button>"
    html += "</form>"
    res.send(html)
})

module.exports = router;