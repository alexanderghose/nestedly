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
router.get('/test', async function(req,res) {
    console.log(req.user)
    let currentUser = await UserModel.findById(req.user.id)
    let userContacts = currentUser.contacts;
    res.json(userContacts)
})
router.get('/contacts', async function(req, res, next) {
    let contacts = await ContactModel.find().populate('nest');
    res.json(contacts);
});
router.get('/contacts/:id', async function(req,res) {
    let contact = await ContactModel.findById(req.params.id);
    res.json(contact);
})
router.post('/contacts', function(req,res) { // create a contact.
    if (req.isAuthenticated) {
        req.user.contacts.push(req.body);
        req.user.save(function(err) {
        res.redirect('/users');
        });
    } else {
        res.redirect('/auth/google')
    }
})

router.get('/nests', async function(req, res, next) {
    let nests = await NestModel.find();
    res.json(nests);
});
router.get('/nests/:id', async function(req,res) {
    let nest = await NestModel.findById(req.params.id);
    res.json(nest);
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
      successRedirect : '/users',
      failureRedirect : '/users'
    }
));
router.get('/logout', function(req, res){ // OAuth logout route
    req.logout();
    res.redirect('/users');
});

/**
 * 3. Routes for backend testing
 */
// Seed DB with sample data
router.get('/seedSampleData', async function(req, res, next) {
    let myNest = await NestModel.create({
        name:"close friends",
        contactFrequencyInDays:30
    })
    let myContact = await ContactModel.create({
        name:"Philip Nicklisch",
        goesBy: "Phil",
        nest: myNest,
        emails: ["pnicklisch13@gmail.com"],
        phoneNumbers: ["647-262-5591"],
        otherMethods: [{
            method:"whatsapp",
            contactDetails:"647-262-5591"
        }],
    })

    res.json({...myNest,...myContact});
});

router.get('/getForms', function(req,res) {
    let html = "<form>"
    html += "<input name='' />" // TODO: finish this.. setup a mock ui form for backend testing.
    html += "</form>"
    res.send(html)
})

module.exports = router;