'use strict';

// import routes
const dashboardRoutes = require('./dashboard/index.routes');



module.exports = function (app) {

  // /dashboard
  app.use('/dashboard', dashboardRoutes);
  // home page
  app.get('/', (req, res, next) => {
    return res.render("sites/index");
  });
  // not found
  app.get('*', (req, res, next) => {
    return res.render("404");
  });
  
}