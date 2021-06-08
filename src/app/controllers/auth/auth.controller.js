const AuthController = function () {

}

// [GET] /auth/login
AuthController.prototype.login = async function (req, res, next){
  res.status(200).render("sites/auth/login", {layout: "auth"});
}

// [GET] /auth/forgot
AuthController.prototype.forgot = async function (req, res, next){ 
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

// [PATCH] /auth/reset/:token
AuthController.prototype.reset = async function (req, res, next){
  res.status(200).render("sites/auth/login");
}


module.exports = new AuthController();