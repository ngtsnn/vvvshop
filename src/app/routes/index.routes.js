'use strict';

// import routes
const dashboardRoutes = require('./dashboard/index.routes');
const apiRoutes = require('./api/index.routes');



module.exports = function (app) {

  // /dashboard
  app.use('/dashboard', dashboardRoutes);
  app.use('/api', apiRoutes);
  // home page
  app.get('/', (req, res, next) => {
    return res.render("sites/index");
  });
  // not found
  app.get('*', (req, res, next) => {
    return res.render("404");
  });
  
}