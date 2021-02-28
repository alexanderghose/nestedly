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
 * 1. CRUD Routes (for front-end AJAX to hit). Return JSON
 */

router.get('/test/nests', function(req,res) {
    let nests = [
        {
          "_id": "6009b3e59ef02a0d033ca2dc",
          "name": "coworkers",
          "frequency": 90,
          "user": "6009b3b89ef02a0d033ca2db",
          "createdAt": "2021-01-21T17:03:33.439Z",
          "updatedAt": "2021-01-21T17:03:33.439Z",
          "__v": 0
        },
        {
          "_id": "6009c54f9ef02a0d033ca2dd",
          "name": "close friends and family",
          "frequency": 7,
          "user": "6009b3b89ef02a0d033ca2db",
          "createdAt": "2021-01-21T18:17:51.429Z",
          "updatedAt": "2021-01-21T18:17:51.429Z",
          "__v": 0
        },
        {
          "_id": "600e1bf51916fa28db9a466f",
          "name": "Family",
          "frequency": 10,
          "user": "6009b3b89ef02a0d033ca2db",
          "createdAt": "2021-01-25T01:16:37.637Z",
          "updatedAt": "2021-01-25T01:16:37.637Z",
          "__v": 0
        },
        {
          "_id": "601410261916fa28db9a4673",
          "name": "old but good friends",
          "frequency": 90,
          "user": "6009b3b89ef02a0d033ca2db",
          "createdAt": "2021-01-29T13:39:50.030Z",
          "updatedAt": "2021-01-29T13:39:50.030Z",
          "__v": 0
        }
      ]
    res.status(200).send(JSON.stringify(nests))
}) 
router.get('/test/contacts', function(req,res) {
    let contacts = 
    [{
    "_id": "600c50e89ef02a0d033ca2de",
    "name": "pedro lins",
    "phone": "647-123-4567",
    "email": "",
    "lastContacted": "2021-01-23T00:00:00.000Z",
    "nest": "6009b3e59ef02a0d033ca2dc",
    "notes": "\r\ns, 2021-01-23 (whatsapp message)\r\n---------------------------------\r\nhey man :) just wanted to say happy new year. i miss hanging out with our woodgrove team. it was a really great team. how are dani and rob and phil? are you guys back in the office? anyway have a great saturday :D",
    "createdAt": "2021-01-23T16:38:00.328Z",
    "updatedAt": "2021-01-23T16:38:00.328Z"
    },
    {
    "_id": "600e1c0f1916fa28db9a4670",
    "name": "Noah",
    "phone": "",
    "email": "",
    "lastContacted": null,
    "nest": "600e1bf51916fa28db9a466f",
    "notes": "\r\nAdopted daughter",
    "createdAt": "2021-01-25T01:17:03.653Z",
    "updatedAt": "2021-01-25T01:17:03.653Z"
    },
    {
    "_id": "601410711916fa28db9a4674",
    "name": "michelle karuna",
    "phone": "",
    "email": "1@gmail.com",
    "lastContacted": "2021-01-29T00:00:00.000Z",
    "nest": "601410261916fa28db9a4673",
    "notes": "michelle has obviously got blackmail material on me lol, as evidenced by a pic of my crazy hair from aug 7, 2013.",
    "createdAt": "2021-01-29T13:41:05.142Z",
    "updatedAt": "2021-01-29T13:41:05.142Z"
    }
    ]
    res.status(200).send(JSON.stringify(contacts))
})

router.get('/', async function(req,res) {
    console.log(req.user)
    res.render('home.ejs', {user: req.user})
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

// /* 
//  * 2. Google OAuth routes
//  */
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

router.get('/contacts/:id/edit', async function(req,res) {
    if (req.user) {
        // fetch all this user's nests
        let myNests = await NestModel.find({user:req.user})
        let contact = req.user.contacts.find(contact => contact.id == req.params.id)
        console.log(req.params.id)
        console.log(contact)
        let html = "<form action='/api/contacts/"+contact.id+"/edit' method='POST'>"
        html += "Edit contact belonging to user " + req.user.name + ":<br />"
        html += "Name <input name='name' placeholder='"+ contact.name +"'/><br />"
        html += "Phone <input name='phone' placeholder='"+ contact.phone +"' /><br />"
        html += "Email <input name='email' placeholder='"+ contact.email +"' /><br />"
        html += "Last contacted <input name='lastContacted' type='date' value='"+ contact.lastContacted.toISOString().substr(0,10) +"' /><br />"
        html += "Nest <select name='nest'>"
        for (let nest of myNests) {
            html += "<option value="+ nest.id +">"+nest.name+"</option>"
        }
        html += "</select> (... to add a Nest, click <a href='/api/nests/create'>here</a>)<br />"
        html += "Notes about this contact <textarea name='notes'  placeholder='"+ contact.notes +"'></textarea><br />"
        html += "<button>Edit</button>"
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

router.get('/contacts/HTML', async function(req,res) {
    if(req.isAuthenticated()) {
        //let currentUser = await UserModel.findById(req.user.id)
        res.render('contacts.ejs', { 
            user: req.user, 
            contacts: req.user.contacts })
    } else {
        res.send("cannot get contacts. please <a href='/api/auth/google'>login</a>.")
    }
})

router.get('/contacts/:id', async function(req,res) {
    if(req.isAuthenticated()) {
        let contact = req.user.contacts.find(ele => req.params.id == ele.id)
        console.log(req.params.id)
        console.log(contact)
        let nest = await NestModel.findById(contact.nest)
        console.log(nest)
        res.render('contactshow.ejs', {user:req.user, 
            contact, 
            nest})
    } else {
        res.send("cannot get contacts. please <a href='/api/auth/google'>login</a>.")
    }
})

module.exports = router;
