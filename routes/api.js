const express = require('express');
const router = express.Router();

let NestModel = require('../models/nest')
let ContactModel = require('../models/contact')

router.get('/contacts', async function(req, res, next) {
    let contacts = await ContactModel.find().populate('nest');
    res.json(contacts);
});

router.get('/nests', async function(req, res, next) {
    let nests = await NestModel.find();
    res.json(nests);
});

// Seed with sample data
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

module.exports = router;