// is developing

"use strict";

const express = require('express');
const router = express.Router();
const path = require("path");
const fs = require("fs");

const uploadPath = path.join(__dirname, "../../public/upload");



// for multer
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname)
  }
});
const fileFilter = function (req, file, cb){
  cb(null, false);
}
const upload = multer({ 
  storage, 
  limits: 10 * 1024 * 1024,
  // fileFilter,
});

// for cloudinary
const cloudinary = require("cloudinary").v2;
// all these sample key and secret apis are not existed.
// please create accout and put your owns to env file;
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME || 'sample', 
  api_key: process.env.CLOUDINARY_API_KEY || '874837483274837', 
  api_secret: process.env.CLOUDINARY_API_SECRET || 'a676b67565c6767a6767d6767f676fe1',
});

const UploadController = function () {

}

UploadController.prototype.get = async function (req, res, next) {
  res.status(200).render("sites/upload");
}

UploadController.prototype.post = async function (req, res, next) {
  console.log(req.files);
  console.log(req.body);
  const files = req.files.map(file => uploadPath + "/" + file.filename );
  for(let i = 0; i < files.length; i++){
    try {
      const result = await cloudinary.uploader.upload(files[i]);
      console.log(result);
    } catch (error) {
      console.error(error.message);
    }
  }
  console.log(files);
 
  // console.log("/upload/" + req.file.filename);
  res.status(200).render("sites/upload");
}

const uploadController = new UploadController();


router.get("/", uploadController.get);
router.post("/", upload.array("myfile"), uploadController.post);


module.exports = router;