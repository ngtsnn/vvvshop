"use strict";

module.exports = {
  isSelected: (url, val) => {
    return url.includes(val);
  },
  compare: (a, b) => a.toString() == b.toString(),
  in: (ele, arr) => {
    let isIn = false;
    arr.forEach(element => {
      if (element.toString() == ele.toString()){
        isIn = true;
      }
    });
    return isIn;
  },
  // show: (ele, arr) => {
  //   console.log(arr);
  //   return true;
  // }
}