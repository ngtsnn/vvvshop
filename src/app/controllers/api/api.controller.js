


const APIController = function (_model) {
  this.model = _model;

}

// [GET] /api/models
// [GET] /api/models?_filter&prop=value
APIController.prototype.get = async function (req, res, next){

  // for filter
  let queryObj = new Object();
  if (req.query.hasOwnProperty("_filter")){
    queryObj = req.query;
    delete queryObj["_filter"];
  }

  try {
    const data = await this.model.findOne(queryObj);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({errors: ["Đã có lỗi xảy ra, vui lòng thử lại sau"]});
    next(error);
  }
}

// [GET] /api/models/:id
APIController.prototype.getOne = async function (req, res, next){ 
  const id = req.params.id;

  if (!id){
    res.status(400).json({errors: ["Đã có lỗi xảy ra, vui lòng thử lại sau"]});
    return;
  }

  try {
    const data = await this.model.find({_id: id});
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({errors: ["Đã có lỗi xảy ra, vui lòng thử lại sau"]});
  }
}

// // [GET] /api/models?_filter&prop=value
// APIController.prototype.filter = async function (req, res, next){
  

//   try {
//     const data = await this.model.find({});
//     res.status(200).json(data);
//   } catch (error) {
//     res.status(400).json({errors: ["Đã có lỗi xảy ra, vui lòng thử lại sau"]});
//   }
// }


module.exports = APIController;