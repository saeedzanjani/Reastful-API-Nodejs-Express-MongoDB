const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const { schema } = require("./validations/userRegister");

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true,
    minLength: 3,
    maxLength: 255,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 4,
    maxHeight: 100,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.statics.userValidation = function (body) {
  return schema.validate(body, { abortEarly: false });
};

userSchema.pre('save', function(next) {
    let user = this

    if(!user.isModified('password')) return next() 

    bcrypt.hash(user.password, 10, (err, hash) => {
        if(err) return next(err)

        user.password = hash
        next()
    })
})

module.exports = mongoose.model("User", userSchema);
