const Yup = require('yup');

exports.schema = Yup.object().shape({
    title: Yup.string().required("Post Title is require")
        .min(3, 'Title Should be Higher 3 carakter')
        .max(100, 'Title Should be lower 100 carakter'),
    text: Yup.string().required("Post Text is require"),
    status: Yup.mixed().oneOf(["public", "private"], 'Select one status'),
    thumbnail: Yup.object().shape({
        name: Yup.string().required("thumbnail is require"),
        size: Yup.number().max(3000000),
        MimeType: Yup.mixed().oneOf(["image/jpeg", "image/png"], "Accept just jpeg and png format")
    })
})