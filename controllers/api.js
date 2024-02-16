const express = require('express');
let NestModel = require('../models/nest').NestModel;
let ContactModel = require('../models/contact').ContactModel;
let UserModel = require('../models/user');
const User = require('../models/user');

module.exports = {
    getContacts,
    postContact,
    getNests,
    postNest,
    assignNestToContact,
    AddOneNest, 
    fetchUserData,
    getFollowUpList,
}

async function getFollowUpList(req, res) {
    // for every contact in every nest,
    // lastContactedDays: the lastContacted (required) attribute with today's date
    // cf. with nest.frequency
    try {
        let currentUser = await UserModel.findById(req.user._id)
        let followUpList = []
        for (let nest of currentUser.nests) {
            for (let contact of nest.contacts) {
                let today = new Date()
                let lastContactedDate = new Date(contact.lastContacted)
                let lastContactedDays = Math.trunc(Math.floor(today - lastContactedDate) / (1000 * 60 * 60 * 24))
                console.log("last contacted days", lastContactedDays)
                let freq = nest.frequency;
                console.log("freq", freq)
                if (lastContactedDays > freq) {
                    followUpList.push({
                        name: contact.name,
                        freq: nest.frequency,
                        lastContactedDays,
                    })
                }
            }
        }
        res.json(followUpList)
    } catch (err) {
        res.send(err)
    }
}

async function getContacts(req, res) {
    if (req.user) {
        let currentUser = await UserModel.findById(req.user._id)
        console.log("user",currentUser)
        console.log("contacts:",currentUser.contacts)
        res.json(currentUser.contacts ? currentUser.contacts : "no contacts yet.")
    } else {
        res.send("cannot get contacts. please <a href='/api/auth/google'>login</a>.")
    }
}

async function postContact(req, res) { // create a contact.
    try {
        console.log("formdata",req.body)
        let user = await UserModel.findById(req.user._id);
        console.log("user", user)
        let targetNest = null;
        if (req.body.nestID) {
            targetNest = user.nests.id(req.body.nestID);
        } else if (req.body.nestName) {
            //targetNest = user.nests.find({'name': req.body.nestName})
            for (let nest of user.nests) {
                if (nest.name == req.body.nestName) {
                    targetNest = nest;
                }
            }
        } else {
            throw new Error("nestID or nestName not specified")
        }
        if (!targetNest) {
            throw new Error("nestID or nestName not found")
        }
        let newContact = await ContactModel.create(req.body)
        targetNest.contacts.push(newContact);
        await user.save()
    
        res.send("done")
    }
    catch (err) {
        console.log("err adding contact to nest", err)
        res.send(err)
    }
}

//AddOneNest - Add a Nest Model to a User Model
async function AddOneNest(req, res) {
    try {
        let user = await UserModel.findById(req.body.userID)
        user.nests.push(req.body.nest)
        await user.save();
        res.send(user)
    }
    catch (err) {
        res.send(err)
    }
}

//April 10th - Refactored this to look inside the body of requests instead of at a user header
//Assert "user without assigned nests" - Expected "[]" -Got "[]"
async function getNests(req, res) {
    if (req.user) {
        //let currentUser = await UserModel.findById(req.user.id)
        //console.log(req.body.user)
        //let userNests = await NestModel.find({ user: req.user.id })
        console.log("nests",req.user.nests)
        res.json(req.user.nests ? req.user.nests : "no nests yet.")
    } else {
        res.send("cannot get nests. please <a href='/api/auth/google'>login</a>.")
    }
}

//April 10th - Refactored this to look inside the body of requests instead of at a user header
async function postNest(req, res) { // create a nest.
    console.log("formdata",req.body)
    try {
        let result = await NestModel.create({
            name: req.body.name,
            frequency: req.body.frequency,
            colour: req.body.colour,
        });
        let user = await UserModel.findById(req.user._id)
        user.nests.push(result)
        await user.save()
        res.json(
            {
                Status: "Nest Added",
                Nest: result
            }
        );
        // res.redirect('/api/nests')
        // req.user.save(function(err) {
        // res.redirect('/api/contacts');
        // });
    } catch (err) {
        console.log('nest creation failed', err)
        res.send(err)
    }
}

// given a req.body.contactID and req.body.nestID, assign contact to nest
async function assignNestToContact(req, res) {
    if (req.user) {
        // step 1. find the user
        let userModel = await NestModel.find({ user: req.user.id })
        for (let i = 0; i < userModel.contacts.length; i++) {
            // step 2. find the contact
            if (userModel.contacts[i].id == req.body.contactID) {
                // step 3. modify this contact's nestID to contact.
                contacts[i].nest = req.body.nestID;
                await userModel.save()
                return res.json("ok")
            }
        }
        return res.json("error - could not assign nest to contact")
    } else {
        res.send("cannot assign contact to nest. please login.")
    }
}

async function fetchUserData(req, res) { // create a contact.
    try {
        let user = await UserModel.findById(req.body.userID);
        
        res.send(user)
    }
    catch (err) {
        res.send(err)
    }
}


// function testGetContacts(req,res) {
//     let contacts = 
//     [{
//     "_id": "600c50e89ef02a0d033ca2de",
//     "name": "pedro lins",
//     "phone": "647-123-4567",
//     "email": "",
//     "lastContacted": "2021-01-23T00:00:00.000Z",
//     "nest": "6009b3e59ef02a0d033ca2dc",
//     "notes": "\r\ns, 2021-01-23 (whatsapp message)\r\n---------------------------------\r\nhey man :) just wanted to say happy new year. i miss hanging out with our woodgrove team. it was a really great team. how are dani and rob and phil? are you guys back in the office? anyway have a great saturday :D",
//     "createdAt": "2021-01-23T16:38:00.328Z",
//     "updatedAt": "2021-01-23T16:38:00.328Z"
//     },
//     {
//     "_id": "600e1c0f1916fa28db9a4670",
//     "name": "Noah",
//     "phone": "",
//     "email": "",
//     "lastContacted": null,
//     "nest": "600e1bf51916fa28db9a466f",
//     "notes": "\r\nAdopted daughter",
//     "createdAt": "2021-01-25T01:17:03.653Z",
//     "updatedAt": "2021-01-25T01:17:03.653Z"
//     },
//     {
//     "_id": "601410711916fa28db9a4674",
//     "name": "michelle karuna",
//     "phone": "",
//     "email": "1@gmail.com",
//     "lastContacted": "2021-01-29T00:00:00.000Z",
//     "nest": "601410261916fa28db9a4673",
//     "notes": "michelle has obviously got blackmail material on me lol, as evidenced by a pic of my crazy hair from aug 7, 2013.",
//     "createdAt": "2021-01-29T13:41:05.142Z",
//     "updatedAt": "2021-01-29T13:41:05.142Z"
//     }
//     ]
//     res.status(200).send(JSON.stringify(contacts))
// }

// function testGetNests(req,res) {
//     let nests = [
//         {
//           "_id": "6009b3e59ef02a0d033ca2dc",
//           "name": "coworkers",
//           "frequency": 90,
//           "user": "6009b3b89ef02a0d033ca2db",
//           "createdAt": "2021-01-21T17:03:33.439Z",
//           "updatedAt": "2021-01-21T17:03:33.439Z",
//           "__v": 0
//         },
//         {
//           "_id": "6009c54f9ef02a0d033ca2dd",
//           "name": "close friends and family",
//           "frequency": 7,
//           "user": "6009b3b89ef02a0d033ca2db",
//           "createdAt": "2021-01-21T18:17:51.429Z",
//           "updatedAt": "2021-01-21T18:17:51.429Z",
//           "__v": 0
//         },
//         {
//           "_id": "600e1bf51916fa28db9a466f",
//           "name": "Family",
//           "frequency": 10,
//           "user": "6009b3b89ef02a0d033ca2db",
//           "createdAt": "2021-01-25T01:16:37.637Z",
//           "updatedAt": "2021-01-25T01:16:37.637Z",
//           "__v": 0
//         },
//         {
//           "_id": "601410261916fa28db9a4673",
//           "name": "old but good friends",
//           "frequency": 90,
//           "user": "6009b3b89ef02a0d033ca2db",
//           "createdAt": "2021-01-29T13:39:50.030Z",
//           "updatedAt": "2021-01-29T13:39:50.030Z",
//           "__v": 0
//         }
//       ]
//     res.status(200).send(JSON.stringify(nests))
// }


// async function getHTMLEditContactForm(req,res) {
//     if (req.user) {
//         // fetch all this user's nests
//         let myNests = await NestModel.find({user:req.user})
//         let contact = req.user.contacts.find(contact => contact.id == req.params.id)
//         console.log(req.params.id)
//         console.log(contact)
//         let html = "<form action='/api/contacts/"+contact.id+"/edit' method='POST'>"
//         html += "Edit contact belonging to user " + req.user.name + ":<br />"
//         html += "Name <input name='name' placeholder='"+ contact.name +"'/><br />"
//         html += "Phone <input name='phone' placeholder='"+ contact.phone +"' /><br />"
//         html += "Email <input name='email' placeholder='"+ contact.email +"' /><br />"
//         html += "Last contacted <input name='lastContacted' type='date' value='"+ contact.lastContacted.toISOString().substr(0,10) +"' /><br />"
//         html += "Nest <select name='nest'>"
//         for (let nest of myNests) {
//             html += "<option value="+ nest.id +">"+nest.name+"</option>"
//         }
//         html += "</select> (... to add a Nest, click <a href='/api/nests/create'>here</a>)<br />"
//         html += "Notes about this contact <textarea name='notes'  placeholder='"+ contact.notes +"'></textarea><br />"
//         html += "<button>Edit</button>"
//         html += "</form>"
//         res.send(html)
//     } else {
//         res.send("cannot show you the add contact form. please <a href='/api/auth/google'>login</a>.")
//     }
// }

// async function getHTMLCreateNestForm(req,res) {
//     if (req.user) {
//         // fetch all this user's nests
//         let html = "<form action='/api/nests' method='POST'>"
//         html += "Add a nest to user " + req.user.name + ":<br />"
//         html += "Name <input name='name' /><br />"
//         html += "Frequency (in days)<input name='frequency' /><br />"
//         html += "<button>Add</button>"
//         html += "</form>"
//         res.send(html)
//     } else {
//         res.send("cannot show you the add contact form. please <a href='/api/auth/google'>login</a>.")
//     }
// }

// async function getHTMLCreateContactForm(req,res) {
//     if (req.user) {
//         // fetch all this user's nests
//         let myNests = await NestModel.find({user:req.user})


//         let html = "<form action='/api/contacts' method='POST'>"
//         html += "Add a contact to user " + req.user.name + ":<br />"
//         html += "Name <input name='name' /><br />"
//         html += "Phone <input name='phone' /><br />"
//         html += "Email <input name='email' /><br />"
//         html += "Last contacted <input name='lastContacted' type='date' /><br />"
//         html += "Nest <select name='nest'>"
//         for (let nest of myNests) {
//             html += "<option value="+ nest.id +">"+nest.name+"</option>"
//         }
//         html += "</select> (... to add a Nest, click <a href='/api/nests/create'>here</a>)<br />"
//         html += "Notes about this contact <textarea name='notes'></textarea><br />"
//         html += "<button>Add</button>"
//         html += "</form>"
//         res.send(html)
//     } else {
//         res.send("cannot show you the add contact form. please <a href='/api/auth/google'>login</a>.")
//     }
// }

// async function getContactsAsHTML(req,res) {
//     if(req.user) {
//         //let currentUser = await UserModel.findById(req.user.id)
//         res.render('contacts.ejs', { 
//             user: req.user, 
//             contacts: req.user.contacts })
//     } else {
//         res.send("cannot get contacts. please <a href='/api/auth/google'>login</a>.")
//     }
// }

// async function getOneContactAsHTML(req,res) {
//     if(req.user) {
//         let contact = req.user.contacts.find(ele => req.params.id == ele.id)
//         console.log(req.params.id)
//         console.log(contact)
//         let nest = await NestModel.findById(contact.nest)
//         console.log(nest)
//         res.render('contactshow.ejs', {user:req.user, 
//             contact, 
//             nest})
//     } else {
//         res.send("cannot get contacts. please <a href='/api/auth/google'>login</a>.")
//     }
// }

