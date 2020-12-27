const express = require('express');
const path = require('path');
//const favicon = require('serve-favicon');
const logger = require('morgan');
require('./config/database');

const app = express();
app.use(logger('dev'));
app.use(express.json());

// routers
let apiRouter = require('./routes/api');
app.use('/api', apiRouter);

// The following "catch all" route (note the *)is necessary
// for a SPA's client-side routing to properly work 
app.get('/*', function(req, res) {
   res.send("hello, this is a catchall route.")
  //res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Configure to use port 3001 instead of 3000 during
// development to avoid collision with React's dev server
const port = process.env.PORT || 3001;

app.listen(port, function() {
  console.log(`Express app running on port ${port}`)
});