//import routes
const productsRoutes = require('./products.routes')



module.exports = function (app) {
  app.use('/products' ,productsRoutes);
  app.get('/', (req, res) => {
    return res.render("sites/index");
  });
  
}