'use strict';

//import routes
const dashboardRoutes = require('./dashboard.routes')



module.exports = function (app) {
  app.use('/dashboard' ,dashboardRoutes);
  app.get('/', (req, res) => {
    return res.render("sites/index");
  });
  
}