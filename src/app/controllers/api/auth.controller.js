"use strict";

const validator = require("validator");
const jwt = require("jsonwebtoken");
const User = require("../../models/user.model");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");


const AuthController = function () {

}

// [POST] /api/auth/login
AuthController.prototype.login = async function (req, res, next) {

  const loggedUser = req.body;

  // validate
  let errs = [];

  if (!loggedUser.account && !loggedUser.password) {
    errs.push("very bad request!!");
  }


  // check find user or not
  const foundUser = await User.findOne({
    $or: [
      {
        email: loggedUser.account,
      },
      {
        phone: loggedUser.account,
      },
    ]
  });
  if (!foundUser) {
    res.status(400).json({ errors: ["tài khoản hoặc mật khẩu không chính xác!"] });
    return;
  }

  // check password
  if (!foundUser.compare(loggedUser.password)) {
    errs.push("tài khoản hoặc mật khẩu không chính xác!");
  }

  if (errs.length) {
    res.status(400).json({ errors: errs });
    return;
  }

  // create token
  const token = jwt.sign({
    _id: foundUser._id,
    role: foundUser.role,
    name: foundUser.name,
    avatar: foundUser.avatar,
  }, process.env.SECRET_KEY || "DevSecretKey", { expiresIn: '1d' });

  res.header("auth_token", token).cookie('auth_token', token, { expires: new Date(Date.now() + 86400000), }).status(200).json({ "auth_token": token });


}

// [POST] /api/auth/register
AuthController.prototype.register = async function (req, res, next) {

  const newUser = new User(req.body);

  // validate
  let errs = [];

  // check is email
  if (!newUser.email || validator.isEmpty(newUser.email)) {
    errs.push("email là trường bắt buộc!");
  }
  if (!newUser.email || !validator.isEmail(newUser.email)) {
    errs.push("email có định dạng sai!");
  }
  // check phone
  const VNPhoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
  if (!VNPhoneRegex.test(newUser.phone)) {
    errs.push("số điện thoại có định dạng sai");
  }
  // check password
  if (newUser.password) {
    if (!validator.isStrongPassword(newUser.password, {
      minLength: 8,
      minLowercase: 0,
      minUppercase: 0,
      minNumbers: 0,
      minSymbols: 0,
    })) {
      errs.push("mật khẩu có ít nhất 8 kí tự");
    }
  }
  // check name
  if (!newUser.name || validator.isEmpty(newUser.name)) {
    errs.push("tên là trường bắt buộc!");
  }

  // force role is user
  newUser.role = "user";


  // check email and phone number is register or not
  const oldEmailUser = await User.findOne({ email: newUser.email });
  const oldTelUser = await User.findOne({ phone: newUser.phone });
  if (oldEmailUser) {
    errs.push("email này đã được đăng kí!");
  }
  if (oldTelUser) {
    errs.push("số điện thoại này đã được đăng kí!");
  }



  // render errors if it has
  if (errs.length) {
    res.status(400).json({ errors: errs });
    return;
  }


  // hash password
  newUser.encode();


  // create new user
  try {
    const result = await newUser.save();

    // create token
    const token = jwt.sign({
      _id: result._id,
      role: result.role,
      name: result.name,
      avatar: result.avatar,
    }, process.env.SECRET_KEY || "DevSecretKey", { expiresIn: '1d' });

    res.header("auth_token", token).cookie('auth_token', token, { expires: new Date(Date.now() + 86400000), }).status(200).json({ "auth_token": token });
  }
  catch (err) {
    res.status(500).json({ errors: ["Đã có lỗi xảy ra vui lòng thử lại sau!"] });

  }

}

// [GET] /api/auth/forgot/:email
AuthController.prototype.forgot = async function (req, res, next) {
  const email = req.params.email;


  if (!process.env.GOOGLEAPI_CLIENT_ID || !process.env.GOOGLEAPI_CLIENT_SECRET || !process.env.GOOGLEAPI_REDIRECT_URI || !process.env.GOOGLEAPI_REFRESS_TOKEN) {
    res.status(500).json({ errors: ["Đã có lỗi xảy ra vui lòng thử lại sau!"] });
    return;
  }

  try {
    let baseURL = process.env.USER_BASE_URL;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ errors: ["Email này chưa đăng kí thành viên!"] });
      return;
    }

    if (user.role === "admin" || user.role === "super admin"){
      baseURL = process.env.HOST_BASE_URL + "auth/"
    }

    // set up google tokens
    const oAuth2token = await new google.auth.OAuth2(process.env.GOOGLEAPI_CLIENT_ID, process.env.GOOGLEAPI_CLIENT_SECRET, process.env.GOOGLEAPI_REDIRECT_URI);
    await oAuth2token.setCredentials({ refresh_token: process.env.GOOGLEAPI_REFRESS_TOKEN });

    // create token
    const token = jwt.sign({
      _id: user._id,
      email: user.email,
    }, process.env.SECRET_KEY || "DevSecretKey", { expiresIn: '15m' });



    // create mail transporter
    const accessToken = await oAuth2token.getAccessToken();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.ethereal.email",
      auth: {
        type: "OAuth2",
        user: "tusocnau@gmail.com",
        clientId: process.env.GOOGLEAPI_CLIENT_ID,
        clientSecret: process.env.GOOGLEAPI_CLIENT_SECRET,
        refreshToken: process.env.GOOGLEAPI_REFRESS_TOKEN,
        accessToken,

      },
    });

    // create mail option
    const option = {
      from: '"VVVShop 👻" <tusocnau@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "[reset password] VVVShop đặt lại mật khẩu - do not reply", // Subject line
      html: `<p>Chào quý khách,</p><p>Chúng tôi đã tiếp nhận yêu cầu đặt lại mật khẩu của quý khách. Đây là mail tự động, vui lòng không phản hồi lại email này. Để đặt lại mật khẩu, quý khách vui lòng truy cập tại <a href="${baseURL || "http://localhost:3001/"}reset/${token}" target="_blank">đây</a>&nbsp;và điền đầy đủ thông tin sau đó nhấn xác nhận.&nbsp;</p><p>Lưu ý: Quý khách chỉ có 15 phút kể từ lúc email này được gửi để xác nhận thay đổi mật khẩu. Sau thời gian này, đường dẫn trên sẽ không còn tác dụng.</p><p>Nếu có lỗi xảy ra, hãy truy cập đường dẫn này:&nbsp;<a href="${baseURL || "http://localhost:3001/"}reset/${token}" target="_blank">${baseURL || "http://localhost:3001/"}reset/${token}</a></p><p>Cảm ơn quý khách đã tin tưởng và sử dụng dịch vụ của chúng tôi,</p><p>Trân trọng,</p><p>VVVShop<br></p><p>----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------</p><p><br></p><p>Dear our customer,</p><p>We have recently received your request about resetting your password. This is an automated message, please not to reply directly to this email. In order proceed your password reset, click <a href="${baseURL || "http://localhost:3001/"}reset/${token}" target="_blank">here</a>,&nbsp;fulfill your form and submit it.&nbsp;</p><p>Note: You only have 15 minutes to complete your settings. After that, the url will no longer be available.</p><p>If any errors occur on this link, please access via this url:&nbsp;<a href="${baseURL || "http://localhost:3001/"}reset/${token}" target="_blank" style="font-size: 1rem; text-decoration-line: underline; color: rgb(0, 86, 179); background-color: rgb(255, 255, 255);">${baseURL || "http://localhost:3001/"}reset/${token}</a></p><p>Thanks for using our services.</p><p>Best regards,</p><p>VVVShop</p>`, // html body
    }

    // send mail
    const info = await transporter.sendMail(option);

    // console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));



    res.status(200).json({ message: "Vui lòng kiểm tra mail để thiết lập lại mật khẩu" });
  } catch (error) {
    res.status(500).json({ errors: ["Đã có lỗi xảy ra vui lòng thử lại sau!"] });
  }
}

// [PATCH] /api/auth/reset/:id
AuthController.prototype.resetPassword = async function (req, res, next) {
  const _id = req.params.id;
  const newPassword = req.body.password;


  if (_id !== req.user._id){
    res.status(401).send({ errors: ["Lỗi xác thực!!"] });
    return;
  }

  // check request has password or not
  if (!newPassword) {
    res.status(400).json({ errors: ["mật khẩu phải có ít nhất 8 kí tự"] });
    return;
  }

  // validate password
  if (!validator.isStrongPassword(newPassword, {
    minLength: 8,
    minLowercase: 0,
    minUppercase: 0,
    minNumbers: 0,
    minSymbols: 0,
  })) {
    res.status(400).json({ errors: ["mật khẩu phải có ít nhất 8 kí tự"] });
    return;
  }


  try {
    const user = await User.findOne({ _id });
    if (!user) {
      res.status(400).json({ errors: ["Đã có lỗi xảy ra vui lòng thử lại sau!"] });
      return;
    }
    user.password = newPassword;
    user.encode();
    const result = await user.save();

    // create token
    const token = jwt.sign({
      _id: result._id,
      role: result.role,
      name: result.name,
      avatar: result.avatar,
    }, process.env.SECRET_KEY || "DevSecretKey", { expiresIn: '1d' });

    res.header("auth_token", token).cookie('auth_token', token, { expires: new Date(Date.now() + 86400000), }).status(200).json({ "auth_token": token });
  } catch (error) {
    res.status(500).json({ errors: ["Đã có lỗi xảy ra vui lòng thử lại sau!"] });
  }
}



module.exports = new AuthController();