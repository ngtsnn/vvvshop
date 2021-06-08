'use strict';

// import routes
const dashboardRoutes = require('./dashboard/index.routes');
const apiRoutes = require('./api/index.routes');
const adminRoutes = require('./admins.routes');
const statisticRoutes = require('./statistic/index.routes');
const settingRoutes = require('./settings.routes');


module.exports = function (app) {

  // /dashboard
  app.use('/dashboard', dashboardRoutes);
  app.use('/api', apiRoutes);
  // home page
  app.get('/', (req, res, next) => {
    return res.render("sites/index");
  });
  
  // /dashboard
  app.use('/dashboard', dashboardRoutes);

  // // /admin
  app.use('/admins', adminRoutes);

  // /statistic
  app.use('/statistic', statisticRoutes);

  // /setting
  app.use('/settings', settingRoutes);

  // not found
  app.get('*', (req, res, next) => {
    return res.render("sites/404");
  });
  
}