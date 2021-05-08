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

const URLToRoutes = (prev, curr) => { // prev = dashboard; curr = blogs
  return [...prev, {
    breadcrumbTitle: capitalize(engToVie[curr.toLowerCase()] || ""), // Tin tức
    url: (prev[prev.length - 1].url === "/" ? "" : prev[prev.length - 1].url) + "/" + curr, // /dashboard/blogs
  }]
}

const sliceURL = function (req, res, next){
  const path = req.originalUrl;
  let tokens = path.substring(1).split("/");

  let routeArr = tokens.reduce(URLToRoutes, [{
    breadcrumbTitle: "Trang chủ",
    url: "/",
  }]);

  const result = routeArr.map((ele) => {
    if (ele.breadcrumbTitle === "")
      routeArr = [];
  })

  // console.log(routeArr);

  res.locals.routeArr = routeArr;
  res.locals.baseURL = path;
  next();
}

module.exports = sliceURL;