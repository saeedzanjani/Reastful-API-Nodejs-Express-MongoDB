const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const { sendEmail } = require("../utils/mailer");


exports.registerHandler = async (req, res, next) => {
  try {
    await User.userValidation(req.body);

    const { fullname, email, password } = req.body;

    const user = await User.findOne({ email });

    if(user) {
      const error = new Error("A User has already registered with this email");
      error.statusCode = 422;
      throw error;
      
    } else {

      await User.create({ fullname, email, password });

      sendEmail(email, fullname, "Welcome", "We happy you join to out site");

      res.status(201).json({message: "Registration was Successful"})
    }
  } catch (err) {
    next(err)
  }
};


exports.loginHandler = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("User with this email Not Found");
      error.statusCode = 404;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign(
        {
          user: {
            id: user._id.toString(),
            email: user.email,
            fullname: user.fullname,
          },
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "2h",
        }
      );

      res.status(200).json({ token, userId: user._id.toString() });
    } else {
      const error = new Error("Email or Password is inValid!");
      error.statusCode = 422;
      throw error;
    }
  } catch (err) {
    next(err);
  }
};


exports.handleForgetPassword = async (req, res, next) => {
  const { email } = req.body;

  
  try {
    const user = await User.findOne({ email: email });
    
    if (!user) {
      const error = new Error("User with this email Not Found")
      error.statusCode = 404
      throw error
    }
  
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  
    const resetLink = `http://localhost:3000/users/reset-password/${token}`;
  
    sendEmail(
      user.email,
      user.fullname,
      "Forget Password",
      `For change passwor click in link <a href="${resetLink}">Change Password</a>`
    );
  
    res.status(200).json({message: "Link for reset Password is sent!"})
  } catch (err) {
    next(err)
  }
  
};


exports.handleResetPassword = async (req, res, next) => {
  const token = req.params.token
  const { password, confirmPassword } = req.body;

  
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

    if(!decodedToken) {
      const error = new Error('User not Verify!')
      error.statusCode = 401
      throw error
    }

    if (passport !== confirmPassword) {
      const error = new Error('Password and confirmPassword is not same')
      error.statusCode = 422
      throw error
    }
  
    const user = await User.findOne({ _id: decodedToken.userId });
  
    if (!user) {
      const error = new Error('User with this email Not Found')
      error.statusCode = 404
      throw error
    }
  
    user.password = password;
    await user.save();
  
    res.status(200).json({message: "Email changed Successful"})
  } catch (err) {
    next(err)
  }
};
