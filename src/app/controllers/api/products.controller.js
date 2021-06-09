"use strict";
const Product = require("../../models/product.model");
const Category = require("../../models/category.model");
const Supplier = require("../../models/supplier.model");
const validator = require("validator");


const ProductController = function () {

}


// [GET] /api/products
// [GET] /api/products?_filter&prop=value                     : for only filtering
// [GET] /api/products?_paginate&page=num&perPage=num         : for only pagination
// [GET] /api/products?_filter&prop=value&_paginate&page=num&perPage=num         
// => for both filtering and pagination
ProductController.prototype.get = async function (req, res, next) {

  let hasPagination = false, perPage, page;

  // on pagination
  if (req.query.hasOwnProperty("_paginate")) {
    hasPagination = true;
    perPage = parseInt(req.query["perPage"]) || 8;
    page = parseInt(req.query["page"]) || 1;
    delete req.query["_paginate"];
    delete req.query["perPage"];
    delete req.query["page"];
  }

  // on filter
  let objQuery = new Object();
  if (req.query.hasOwnProperty("_filter")) {
    objQuery = req.query;
    delete objQuery["_filter"];
  }



  try {
    let data = await Product.find(objQuery).populate(['supplier', 'categories']);
    if (hasPagination) {
      const totalPage = Math.ceil(data.length / perPage);
      const newData = await Product.find(objQuery).populate(['supplier', 'categories']).limit(perPage).skip(perPage * (page - 1));
      data = new Object();
      data["totalPage"] = totalPage;
      data["hasNextPage"] = page < totalPage;
      data["hasPrevPage"] = page > 1;
      data["data"] = newData;
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ errors: ["Đã có lỗi xảy ra vui lòng thử lại sau!"] });
  }
}

// [GET] /api/products/:id
ProductController.prototype.getOne = async function (req, res, next) {
  const id = req.params.id;

  if (!id) {
    res.status(400).json({ errors: ["Đã có lỗi xảy ra, vui lòng thử lại sau"] });
    return;
  }

  try {
    const data = await Product.findOne({ _id: id }).populate(['supplier', 'categories']);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ errors: ["Đã có lỗi xảy ra vui lòng thử lại sau!"] });
  }
}

// [GET] /api/products/categories/:slug
// [GET] /api/products/categories/:slug?_paginate&page=num&perPage=num         : for only pagination
ProductController.prototype.getByCate = async function (req, res, next) {

  const slug = req.params[0];
  let hasPagination = false, perPage, page;

  // on pagination
  if (req.query.hasOwnProperty("_paginate")) {
    hasPagination = true;
    perPage = parseInt(req.query["perPage"]) || 8;
    page = parseInt(req.query["page"]) || 1;
  }



  try {
    const regex = new RegExp(`^${slug}`);
    const category = await Category.find({ slug: { $regex: regex, $options: 'i' } });
    const _ids = category.map(cate => cate._id);
    let data = await Product.find({ categories: { "$in": _ids } }).populate(['supplier', 'categories']);
    if (hasPagination) {
      const totalPage = Math.ceil(data.length / perPage);
      const newData = await Product.find({ categories: category._id }).populate(['supplier', 'categories']).limit(perPage).skip(perPage * (page - 1));
      data = new Object();
      data["totalPage"] = totalPage;
      data["hasNextPage"] = page < totalPage;
      data["hasPrevPage"] = page > 1;
      data["data"] = newData;
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ errors: ["Đã có lỗi xảy ra vui lòng thử lại sau!"] });
    next(error);
  }
}

// [GET] /api/products/supplier/:slug
// [GET] /api/products/supplier/:slug?_paginate&page=num&perPage=num         : for only pagination
ProductController.prototype.getBySupplier = async function (req, res, next) {

  const slug = req.params.slug;
  let hasPagination = false, perPage, page;

  // on pagination
  if (req.query.hasOwnProperty("_paginate")) {
    hasPagination = true;
    perPage = parseInt(req.query["perPage"]) || 8;
    page = parseInt(req.query["page"]) || 1;
  }



  try {
    const supplier = await Supplier.findOne({ slug });
    let data = await Product.find({ supplier: supplier._id }).populate(['supplier', 'categories']);
    if (hasPagination) {
      const totalPage = Math.ceil(data.length / perPage);
      const newData = await Product.find({ supplier: supplier._id }).populate(['supplier', 'categories']).limit(perPage).skip(perPage * (page - 1));
      data = new Object();
      data["totalPage"] = totalPage;
      data["hasNextPage"] = page < totalPage;
      data["hasPrevPage"] = page > 1;
      data["data"] = newData;
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ errors: ["Đã có lỗi xảy ra vui lòng thử lại sau!"] });
  }
}

// [POST] /api/products
ProductController.prototype.post = async function (req, res, next) {
  const newProduct = new Product(req.body);



  // validate
  let errs = [];

  // check name
  if (!newProduct.name || validator.isEmpty(newProduct.name)) {
    errs.push("tên sản phẩm là trường bắt buộc!");
  }

  // check properties
  if (newProduct.properties && newProduct.properties.length) {
    newProduct.properties.forEach((property, index) => {
      if (!property.key || validator.isEmpty(property.key)) {
        errs.push("Vui lòng nhập tên thuộc tính!");
      }

      if (!property.values.length) {
        errs.push("vui lòng nhập giá trị cho thuộc tính!");
      }
      else {
        property.values.forEach((val, i) => {
          if (!val.value || validator.isEmpty(val.value)) {
            errs.push("vui lòng nhập giá trị cho thuộc tính!");
          }
        });
      }
    });
  }

  // check images
  if (!newProduct.images.length) {
    errs.push("Sản phẩm phải có ít nhất 1 hình ảnh");
  }

  // check images
  if (!newProduct.categories.length) {
    errs.push("Sản phẩm phải có ít nhất 1 danh mục");
  }

  if (errs.length){
    res.status(400).json({errors: errs});
  }

  // check categories
  newProduct.categories.forEach((cate, index) => {
    try {
      const category = Category.findOne({ _id: cate });
      if (!category) {
        errs.push(`danh mục thứ ${index + 1} không tồn tại`);
      }
    } catch (error) {
      res.status(500).json({ errors: ["Đã có lỗi xảy ra, vui lòng thử lại sau!"] });
    }
  });

  // check supplier
  if (newProduct.supplier) {
    try {
      const supplier = Supplier.findOne({ _id: newProduct.supplier })
      if (!supplier) {
        errs.push("nhà cung cấp không tồn tại");
      }
    } catch (error) {
      res.status(500).json({ errors: ["Đã có lỗi xảy ra, vui lòng thử lại sau!"] });
    }
  } else{
    errs.push("Sản phẩm phải có nhà cung cấp")
  }

  // check description
  if (!newProduct.description || validator.isEmpty(newProduct.description)) {
    errs.push("mô tả là trường bắt buộc!");
  }

  // check original price
  if (!newProduct.originalPrice) {
    errs.push("giá niêm yết là trường bắt buộc!");
  } else if (newProduct.originalPrice < 0) {
    errs.push("giá niêm yết phải lớn hơn 0");
  }



  try {
    const result = await newProduct.save();
    res.status(200);
    res.json(result);
  } catch (error) {
    res.status(500).json({ errors: ["Đã có lỗi xảy ra vui lòng thử lại sau!"] });
    next(error)
  }
}

// [POST] /api/products
ProductController.prototype.put = async function (req, res, next) {
  const newProduct = new Product(req.body);
  const id = req.params.id;


  // validate
  let errs = [];

  // check name
  if (!newProduct.name || validator.isEmpty(newProduct.name)) {
    errs.push("tên sản phẩm là trường bắt buộc!");
  }

  // check properties
  if (newProduct.properties && newProduct.properties.length) {
    newProduct.properties.forEach((property, index) => {
      if (!property.key || validator.isEmpty(property.key)) {
        errs.push("Vui lòng nhập tên thuộc tính!");
      }

      if (!property.values.length) {
        errs.push("vui lòng nhập giá trị cho thuộc tính!");
      }
      else {
        property.values.forEach((val, i) => {
          if (!val.value || validator.isEmpty(val.value)) {
            errs.push("vui lòng nhập giá trị cho thuộc tính!");
          }
        });
      }
    });
  }

  // check images
  if (!newProduct.images.length) {
    errs.push("Sản phẩm phải có ít nhất 1 hình ảnh");
  }

  // check images
  if (!newProduct.categories.length) {
    errs.push("Sản phẩm phải có ít nhất 1 danh mục");
  }

  if (errs.length){
    res.status(400).json({errors: errs});
  }

  // check categories
  newProduct.categories.forEach((cate, index) => {
    try {
      const category = Category.findOne({ _id: cate });
      if (!category) {
        errs.push(`danh mục thứ ${index + 1} không tồn tại`);
      }
    } catch (error) {
      res.status(500).json({ errors: ["Đã có lỗi xảy ra, vui lòng thử lại sau!"] });
    }
  });

  // check supplier
  if (newProduct.supplier) {
    try {
      const supplier = Supplier.findOne({ _id: newProduct.supplier })
      if (!supplier) {
        errs.push("nhà cung cấp không tồn tại");
      }
    } catch (error) {
      res.status(500).json({ errors: ["Đã có lỗi xảy ra, vui lòng thử lại sau!"] });
    }
  } else{
    errs.push("Sản phẩm phải có nhà cung cấp")
  }

  // check description
  if (!newProduct.description || validator.isEmpty(newProduct.description)) {
    errs.push("mô tả là trường bắt buộc!");
  }

  // check original price
  if (!newProduct.originalPrice) {
    errs.push("giá niêm yết là trường bắt buộc!");
  } else if (newProduct.originalPrice < 0) {
    errs.push("giá niêm yết phải lớn hơn 0");
  }



  try {
    let oldProduct = await Product.findOne({_id: id});
    oldProduct.overwrite(req.body);
    
    const result = await oldProduct.save();
    res.status(200);
    res.json({message: "Chỉnh sửa thông tin sản phẩm thành công"});
  } catch (error) {
    res.status(500).json({ errors: ["Đã có lỗi xảy ra vui lòng thử lại sau!"] });
    next(error)
  }
}

// [PATCH] /api/products/:id
ProductController.prototype.restore = async function (req, res, next) {
  const id = req.params.id;

  if (!id) {
    res.status(400).json({ errors: ["Đã có lỗi xảy ra, vui lòng thử lại sau"] });
    return;
  }

  try {
    const data = await Product.findOneDeleted({ _id: id });
    const result = await data.restore();
    res.status(200).json({ message: "Khôi phục thành công" });
  } catch (error) {
    res.status(500).json({ errors: ["Đã có lỗi xảy ra vui lòng thử lại sau!"] });
  }
}

// [DELETE] /api/products/:id
ProductController.prototype.delete = async function (req, res, next) {
  const id = req.params.id;

  if (!id) {
    res.status(400).json({ errors: ["Đã có lỗi xảy ra, vui lòng thử lại sau"] });
    return;
  }

  try {
    const data = await Product.findOne({ _id: id });
    const result = await data.delete();
    res.status(200).json({ message: "Xóa vĩnh viễn thành công, bạn không thể hoàn tác" });
  } catch (error) {
    res.status(500).json({ errors: ["Đã có lỗi xảy ra vui lòng thử lại sau!"] });
  }
}

// [DELETE] /api/products/:id/force
ProductController.prototype.deleteForce = async function (req, res, next) {
  const id = req.params.id;

  if (!id) {
    res.status(400).json({ errors: ["Đã có lỗi xảy ra, vui lòng thử lại sau"] });
    return;
  }

  try {
    const data = await Product.findOneDeleted({ _id: id });
    const result = await data.deleteOne();
    res.status(200).json({ message: "Xóa thành công" });
  } catch (error) {
    res.status(500).json({ errors: ["Đã có lỗi xảy ra vui lòng thử lại sau!"] });
  }
}


module.exports = new ProductController();

