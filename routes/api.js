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

router.get('/', async function(req,res) {
    let html = "hello, this is the api root route until we have a frontend.<br><br>"
    html += "currently you can access teh following links:<br>"
    html += "<a href='/api/contacts'>/api/contacts</a><br>"
    html += "<a href='/api/contacts/create'>/api/contacts/create</a><br>"
    html += "<a href='/api/nests'>/api/nests</a><br>"
    html += "<a href='/api/nests/create'>/api/nests/create</a><br>"
    res.send(html)
})


router.get('/contacts', async function(req,res) {
    if(req.isAuthenticated()) {
        //let currentUser = await UserModel.findById(req.user.id)
        let userContacts = req.user.contacts;
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

router.get('/nests', async function(req,res) {
    if(req.isAuthenticated()) {
        //let currentUser = await UserModel.findById(req.user.id)
        let userNests = await NestModel.find({user: req.user.id})
        res.json(userNests)
    } else {
        res.send("cannot get nests. please <a href='/api/auth/google'>login</a>.")
    }
})
router.post('/nests', async function(req,res) { // create a contact.
    if (req.isAuthenticated()) {
        let result = await NestModel.create({
            name: req.body.name,
            frequency: req.body.frequency,
            user: req.user.id,
        });
        console.log("created:", result)
        res.redirect('/api/nests')
        // req.user.save(function(err) {
        // res.redirect('/api/contacts');
        // });
    } else {
        res.send("cannot create nest. please <a href='/api/auth/google'>login</a>.")
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
      successRedirect : '/',
      failureRedirect : '/'
    }
));
router.get('/logout', function(req, res){ // OAuth logout route
    req.logout();
    res.redirect('/api/contacts');
});

/**
 * 3. Routes for backend testing
 * 
 */
// ui for testing contacts
router.get('/contacts/create', async function(req,res) {
    if (req.user) {
        // fetch all this user's nests
        let myNests = await NestModel.find({user:req.user})


        let html = "<form action='/api/contacts' method='POST'>"
        html += "Add a contact to user " + req.user.name + ":<br />"
        html += "Name <input name='name' /><br />"
        html += "Phone <input name='phone' /><br />"
        html += "Email <input name='email' /><br />"
        html += "Last contacted <input name='lastContacted' type='date' /><br />"
        html += "Nest <select name='nest'>"
        for (let nest of myNests) {
            html += "<option value="+ nest.id +">"+nest.name+"</option>"
        }
        html += "</select> (... to add a Nest, click <a href='/api/nests/create'>here</a>)<br />"
        html += "Notes about this contact <textarea name='notes'></textarea><br />"
        html += "<button>Add</button>"
        html += "</form>"
        res.send(html)
    } else {
        res.send("cannot show you the add contact form. please <a href='/api/auth/google'>login</a>.")
    }
})

router.get('/nests/create', async function(req,res) {
    if (req.user) {
        // fetch all this user's nests
        let html = "<form action='/api/nests' method='POST'>"
        html += "Add a nest to user " + req.user.name + ":<br />"
        html += "Name <input name='name' /><br />"
        html += "Frequency (in days)<input name='frequency' /><br />"
        html += "<button>Add</button>"
        html += "</form>"
        res.send(html)
    } else {
        res.send("cannot show you the add contact form. please <a href='/api/auth/google'>login</a>.")
    }
})

module.exports = router;