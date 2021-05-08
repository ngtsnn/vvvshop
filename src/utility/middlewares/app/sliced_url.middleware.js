"use strict";

const engToVie = {
  "home": "trang chủ",
  "dashboard": "bảng điều khiển",
  "products": "sản phẩm",
  "product": "sản phẩm",
  "categories": "danh mục",
  "category": "danh mục",
  "blogs": "tin tức",
  "blog": "tin tức",
  "admins": "quản trị viên",
  "admin": "quản trị viên",
  "statistics": "thống kê",
  "statistic": "thống kê",
  "income": "doanh thu",
  "orders": "đơn hàng",
  "order": "đơn hàng",
  "settings": "cài đặt",
  "setting": "cài đặt",
}

const capitalize = function (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const URLToRoutes = (acc, prev) => { // acc = dashboard; prev = blogs
  return [...acc, {
    breadcrumbTitle: capitalize(engToVie[prev.toLowerCase()] || ""), // Tin tức
    url: (acc[acc.length - 1].url === "/" ? "" : acc[acc.length - 1].url) + "/" + prev, // /dashboard/blogs
  }]
}

const sliceURL = function (req, res, next){
  const path = req.originalUrl;
  let tokens = path.substring(1).split("/");

  const routeArr = tokens.reduce(URLToRoutes, [{
    breadcrumbTitle: "Trang chủ",
    url: "/",
  }])
  res.locals.routeArr = routeArr;
  next();
}

module.exports = sliceURL;