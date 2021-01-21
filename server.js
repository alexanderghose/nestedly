const express = require('express');
const path = require('path');
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');

//const favicon = require('serve-favicon');
const logger = require('morgan');

// load the env vars
require('dotenv').config();

require('./config/database'); // connect to mongoDB
require('./config/passport'); // conigure passportJS


const app = express();
app.use(bodyParser());
app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: 'c7a3bb86-13cd-4a02-87e9-c3b5baa41d7b',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// routers
let apiRouter = require('./routes/api');
app.use('/api', apiRouter);

// The following "catch all" route (note the *)is necessary
// for a SPA's client-side routing to properly work 
app.get('/*', function(req, res) {
    let html = "hello, this is a catchall route until we have a frontend.<br><br>"
    html += "currently you can access teh following links:<br>"
    html += "<a href='/api/contacts'>/api/contacts</a><br>"
    html += "<a href='/api/contacts/create'>/api/contacts/create</a><br>"
    html += "<a href='/api/nests'>/api/nests</a><br>"
    html += "<a href='/api/nests/create'>/api/nests/create</a><br>"
    res.send(html)
  //res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Configure to use port 3001 instead of 3000 during
// development to avoid collision with React's dev server
const port = process.env.PORT || 3001;

app.listen(port, function() {
  console.log(`Express app running on port ${port}`)
});