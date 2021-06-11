"use strict";

const to2digit = (x) => x < 10 ? "0" + x : x;

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
  add: (a, b) => a + b,
  convertDate: date => {
    const newDate = new Date(date);
    const hour = to2digit(newDate.getHours());
    const minute = to2digit(newDate.getMinutes());
    const day = to2digit(newDate.getDay());
    const month = to2digit(newDate.getMonth());
    const year = newDate.getFullYear();
    return `${hour}:${minute} ${day}/${month}/${year}`;
  }
  // show: (ele, arr) => {
  //   console.log(arr);
  //   return true;
  // }
}