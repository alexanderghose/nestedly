const User = require('../models/user');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;
module.exports = {
  signup,
  login,
};

async function signup(req, res) {
  const user = new User(req.body);
  try {
    await user.save();
    res.json({ token: createJWT(user) });
  } catch (err) {
    // Probably a duplicate email
    res.status(400).json(err);
  }
}

async function login(req, res) {
  try {
    const user = await User.findOne({ email: req.body.email });
    //Temporarily altered the error message from 
    //({err: `No account associated with the current email})
    // to 
    //({err: req.body})
    if (!user) return res.status(401).json({ err: req.body });
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (isMatch) {
        const token = createJWT(user);
        res.json({ token });
      } else {
        return res.status(401).json({ err: 'Incorrect password' });
      }
    });
  } catch (err) {
    return res.status(401).json(err);
  }
}

/*----- Helper Functions -----*/

function createJWT(user) {
  let token_contents = {
    _id: user._id,
    email: user.email,
  }
  return jwt.sign(
    { user: token_contents }, // data payload
    SECRET,
    { expiresIn: '24h' }
  );
}
