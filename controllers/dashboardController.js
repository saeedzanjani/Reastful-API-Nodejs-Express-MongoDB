const fs = require('fs');

const Post = require("../models/Post");
const multer = require("multer");
const sharp = require("sharp");
const shortId = require("shortid");
const appRoot = require("app-root-path");




exports.createPost = async (req, res, next) => {

  const thumbnail = req.files ? req.files.thumbnail : {};
  const fileName = `${shortId.generate()}_${thumbnail.name}`;
  const uploadPath = `${appRoot}/public/uploads/thumbnails/${fileName}`;

  try {
    req.body = { ...req.body, thumbnail };

    await Post.postValidation(req.body);

    await sharp(thumbnail.data)
      .jpeg({ quality: 60 })
      .toFile(uploadPath)
      .catch((err) => console.log(err));

    await Post.create({ ...req.body, user: req.userId, thumbnail: fileName });

    res.status(201).json({message: 'Register Successful'})
  } catch (err) {
    next(err)
  }
};

exports.uploadImage = (req, res) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "/public/uploads/");
    },
    filename: (req, file, cb) => {
      cb(null, `${shortId.generate()}_${file.originalname}`);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (file.mimeType == "image/jpeg") {
      cb(null, true);
    } else {
      cb("Just jpeg format supported ...!", false);
    }
  };

    // const fileFilter = (req, file, cb) => {
    //     if (file.mimetype == "image/jpeg") {
    //         cb(null, true);
    //     } else {
    //         cb("تنها پسوند JPEG پشتیبانی میشود", false);
    //     }
    // };

  const upload = multer({
    limits: { fileSize: 4000000 },
    // dest: 'uploads/',
    // storage: storage,
    fileFilter: fileFilter,
  }).single("image");

  upload((req, res), async (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(422).json({error: "Image size not be must 4mb"});
      }
      res.status(400).json({error: err});
    } else {
      if (req.files) {
        const fileName = `${shortId.generate()}_${req.files.image.name}`;
        await sharp(req.files.image.data)
          .jpeg({ quality: 60 })
          .toFile(`./public/uploads/${fileName}`)
          .catch((err) => console.log(err));
        res.status(200).json({image: `http://localhost:3000/uploads/${fileName}`});
      } else {
          res.status(400).json({error: "Please choice image for upload"});
      }
    }
  });
};



exports.editPost = async (req, res, next) => {

  const thumbnail = req.files ? req.files.thumbnail : {};
  const fileName = `${shortId.generate()}_${thumbnail.name}`;
  const uploadPath = `${appRoot}/public/uploads/thumbnails/${fileName}`;

  const post = await Post.findOne({ _id: req.params.id });
  try {
      if (thumbnail.name)
          await Post.postValidation({ ...req.body, thumbnail });
      else
          await Post.postValidation({
              ...req.body,
              thumbnail: {
                  name: "placeholder",
                  size: 0,
                  mimetype: "image/jpeg",
              },
          });

      if (!post) {
         const error = new Error("Post Not Found")
          error.statusCode = 404
          throw error
      }

      if (post.user != req.userId) {
          const error = new Error("User inValid for Edit this Post ")
          error.statusCode = 401
          throw error
      } else {
          if (thumbnail.name) {
              fs.unlink(
                  `${appRoot}/public/uploads/thumbnails/${post.thumbnail}`,
                  async (err) => {
                      if (err) console.log(err);
                      await sharp(thumbnail.data)
                      .jpeg({ quality: 60 })
                      .toFile(uploadPath)
                       .catch((err) => console.log(err));
                  }
              );
          }

          const { title, status, text } = req.body;
          post.title = title;
          post.status = status;
          post.text = text;
          post.thumbnail = thumbnail.name ? fileName : post.thumbnail;

          await post.save();

          res.status(200).json({message: "Edit Successful"})
      }
  } catch (err) {
      next(err)
  }
};


exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndRemove({ _id: req.params.id });
    const filePath = `${appRoot}/public/uploads/thumbnails/${post.thumbnail}`
      fs.unlink(filePath, (err) => {
              if (err) {
                  const error = new Error("Error in Delete Image")
                  error.statusCode = 400
                  throw error
              } else {
                  res.status(200).json({message: "Delete Post Successful"})
              }
          }
      );
  } catch (err) {
    next(err)
  }
};


exports.getCaptcha = (req, res) => {
  CAPTCHA_NUM = parseInt(Math.random() * 9000 + 1000);
  const p = new captchapng(80, 30, CAPTCHA_NUM);
  p.color(0, 0, 0, 0);
  p.color(80, 80, 80, 255);

  const img = p.getBase64();
  const imgBase64 = Buffer.from(img, "base64");

  res.send(imgBase64);
};

