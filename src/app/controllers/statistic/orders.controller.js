"use strict";
const Order = require("../../models/order.model");
const Product = require("../../models/product.model");
const User = require("../../models/user.model");
const validator = require("validator");
const { ConvertObjects, ConvertObject } = require("../../../utility/functions/mongoose");


const OrderController = function () {

}


// [GET] /statistic/orders
OrderController.prototype.index = async function (req, res, next) {

  try {
    let orders = await Order.find({});
    orders = ConvertObjects(orders);
    res.status(200).render("sites/statistic/orders/index", {
      orders
    });
  } catch (error) {
    res.status(500).redirect("/500");
  }
}

// [GET] /statistic/orders/:id
OrderController.prototype.detail = async function (req, res, next) {

  const {id} = req.params;

  try {
    let order = await Order.findOne({_id: id}).populate({ path: 'details.product', select: ['name', 'images'] }).populate({ path: "user", select: ["name", "avatar"] });
    order = ConvertObject(order);
    res.status(200).render("sites/statistic/orders/detail", {
      order,
    });
  } catch (error) {
    res.status(500).redirect("/500");
  }
}



module.exports = new OrderController();

