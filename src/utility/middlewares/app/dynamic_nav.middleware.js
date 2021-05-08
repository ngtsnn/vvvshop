const navs = require("./nav.json"); 

module.exports = (req, res, next) => {
  res.locals.navs = navs;
  next();
}