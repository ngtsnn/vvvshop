'use strict';

//import dependencies
const express = require('express');
const path = require('path')
const exphbs = require('express-handlebars');



//init app
const app = express();


//set static
app.use(express.static("src/public"))


//configure view engine
app.engine('hbs', exphbs({
  extname      :'hbs',
  layoutsDir   : path.join(__dirname, 'resource/views/layouts'),
  defaultLayout: 'main',
  helpers      : path.join(__dirname, 'resource/views/helpers'),
  partialsDir  : [
    path.join(__dirname, 'resource/views/components')
  ]
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resource/views'));

//configure port
const port = 8080;

//run app
app.get('/', (req, res) => {
  return res.render("sites/index");
})
app.listen(port, () => console.log(`Listening on port ${port}!`));