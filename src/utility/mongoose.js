module.exports = {
  ConvertObjects: function(arr){
    const newArr = arr.map(ele => ele.toObject());
    return newArr;
  }, 
  ConvertObject: function(obj){
    return obj.toObject();
  }
}