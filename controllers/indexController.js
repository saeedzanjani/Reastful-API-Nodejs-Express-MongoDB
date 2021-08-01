const Post = require("../models/Post");
const captchapng = require("captchapng");

exports.getIndex = async (req, res, next) => {
  try {
    const postsNumbers = await Post.find({
      status: "public",
    }).countDocuments();

    const posts = await Post.find({ status: "public" }).sort({
      createdAt: "desc",
    });

    if (!posts) {
      const error = new Error("Posts Not Found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ posts, total: postsNumbers });

  } catch (err) {
    next(err);
  }
};

exports.getSinglePost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ _id: req.params.id }).populate("user");

    if (!post) {
      // res.status(404).json({message: "Not Found"})
      const error = new Error("Post Not Found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ post })

  } catch (err) {
    // res.status(400).json({error: err})
    next(err);
  }
};

exports.handleContactPage = async (req, res) => {
  // const errorArr = [];

  const { fullname, email, message } = req.body;
  const schema = Yup.object().shape({
    fullname: Yup.string().required("نام و نام خانوادگی الزامی می باشد"),
    email: Yup.string()
        .email("آدرس ایمیل صحیح نیست")
        .required("آدرس ایمیل الزامی می باشد"),
    message: Yup.string().required("پیام اصلی الزامی می باشد"),
});

  try {
    await schema.validate(req.body, { abortEarly: false });

    sendEmail(
      email,
      fullname,
      "پیام از طرف وبلاگ",
      `${message} <br/> ایمیل کاربر : ${email}`
    );
    
      res.status(200).json({ message: "Your Message sent Successfully" })

  } catch (err) {
    // err.inner.forEach((e) => {
    //   errorArr.push({
    //     name: e.path,
    //     message: e.message,
    //   });
    // });

    // res.status(422).json({ error: errorArr })
    
    // const error = new Error("Not Found");
    // error.statusCode = 422;
    // error.data = errorArr

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
