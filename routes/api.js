const express = require('express');
const router = express.Router();
let apiCtrl = require('../controllers/api')

/*---------- Protected Routes ----------*/
router.use(require('../config/auth')); // <------- auth middleware: grabs the JWT
                                          // <------- from the req.body and creates "req.user"

router.get('/contacts', apiCtrl.getContacts)
router.post('/contacts', apiCtrl.postContact) // full route example: POST /api/contacts
router.get('/nests', apiCtrl.getNests)
router.post('/nests', apiCtrl.postNest)
router.get('/followups', apiCtrl.getFollowUpList)

//Refactored User/Nest data model routes
// router.post('/nests', apiCtrl.AddOneNest)

// full route: POST /api/assign_nest_to_contact    has the following prereqs:
// (1) logged in user
// (2) needs a req.body.contactID
// (3) needs a req.body.nestID
router.post('/assign_nest_to_contact', apiCtrl.assignNestToContact)

router.post('/fetchUserData',  apiCtrl.fetchUserData)

// test stuff: ignore
let SkillModel = require('../models/skill');
router.post('/skills', async function(req,res) {
    console.log("req.body", req.body)
    await SkillModel.create({
        skills: req.body.skills
    })
    res.json('ok')
})

module.exports = router;