'use strict';

//import dependencies
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');


//import internal files
const route = require('./app/routes/index.routes');
const db = require('./db');
const customMiddlewares = require('./utility/middlewares/app/');



//init app
const app = express();


//set static
app.use(express.static(path.join(__dirname, 'public')));



//setting middleware
app.use(express.urlencoded({
  limit: '50mb',
  extended: true,
}));
app.use(express.json({limit: '50mb'}));
app.use(cookieParser());



// custom middlewares
app.use(customMiddlewares);



//configure view engine
app.engine('hbs', exphbs({
  extname      :'hbs',
  layoutsDir   : path.join(__dirname, 'resource/views/layouts'),
  defaultLayout: 'main',
  helpers      : require("./utility/helpers"),
  partialsDir  : [
    path.join(__dirname, 'resource/views/components'),
  ]
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resource/views'));



//connect database
db.conn();


//configure port
const port = process.env.PORT || 8080;



//route
route(app);




//listening
app.listen(port, () => console.log(`Listening on port ${port}!
App is running at http://127.0.0.1:${port}`));