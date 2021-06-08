'use strict';

// middlewares
const { verifyInDashboard } = require('../../utility/middlewares/app/verify.middleware');

// import routes
const dashboardRoutes = require('./dashboard/index.routes');
const apiRoutes = require('./api/index.routes');
const adminRoutes = require('./admins.routes');
const statisticRoutes = require('./statistic/index.routes');
const settingRoutes = require('./settings.routes');
const authRoutes = require('./auth/index.routes');




module.exports = function (app) {

  // /auth
  app.use('/auth', authRoutes);

  // /api
  app.use('/api', apiRoutes);

  // /dashboard
  app.use('/dashboard', verifyInDashboard,dashboardRoutes);

  // /admin
  app.use('/admins', verifyInDashboard, adminRoutes);

  // /statistic
  app.use('/statistic', verifyInDashboard, statisticRoutes);

  // /setting
  app.use('/settings', verifyInDashboard, settingRoutes);

  // home page
  app.get('/', verifyInDashboard, (req, res, next) => {
    return res.render("sites/index");
  });

  // not found
  app.get('*', verifyInDashboard, (req, res, next) => {
    return res.render("sites/404");
  });

}