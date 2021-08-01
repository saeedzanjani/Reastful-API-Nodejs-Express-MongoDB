const mongoose = require('mongoose');
const { schema } = require('./validations/postValidator');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 255,
        minlength: 2,
        trim: true
    },
    text: {
        type: String,
        required: true,
        minlength: 4
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    thumbnail: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "public",
        enum: ["public", "private"]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

postSchema.index({title: "text"})

postSchema.statics.postValidation = function(body) {
    return schema.validate(body, {abortEarly: false})
}

module.exports = mongoose.model("Post", postSchema)