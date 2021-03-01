const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;


// this is an amazing middleware module that grabs the
// jwt if it exists in the header, or body, or
// as a query parameter. it is pretty nuts.

// if the token exists and if it's valid, we add a "req.user" property
// to the req
module.exports = function(req, res, next) {
  // Check for the token being sent in three different ways
  let token = req.get('Authorization') || req.query.token || req.body.token;
  if (token) {
    // Remove the 'Bearer ' if it was included in the token header
    token = token.replace('Bearer ', '');
    // Check if token is valid and not expired
    jwt.verify(token, SECRET, function(err, decoded) {
      if (err) {
        next(err);
      } else {
        // It's a valid token, so add user to req
        req.user = decoded.user;    
        next();
      }
    });
  } else {
    next();
  }
};