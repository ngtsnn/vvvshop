'use strict';

//import routes
// const dashboardRoutes = require('./dashboard.routes');



module.exports = function (app) {

  app.get('/', (req, res) => {
    return res.render("sites/index");
  });
  app.get('*', (req, res) => {
    return res.render("404");
  });
  
}