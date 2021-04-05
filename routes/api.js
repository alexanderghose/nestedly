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

// full route: POST /api/assign_nest_to_contact    has the following prereqs:
// (1) logged in user
// (2) needs a req.body.contactID
// (3) needs a req.body.nestID
router.post('/assign_nest_to_contact', apiCtrl.assignNestToContact)

module.exports = router;