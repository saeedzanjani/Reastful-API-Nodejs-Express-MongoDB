const Yup = require('yup');

exports.schema = Yup.object().shape({
    fullname: Yup.string().required('Fullname is required').min(3).max(255),
    email: Yup.string().email('Email is not Valid').required('Email is required'),
    password: Yup.string().required('Password is required').min(4).max(100),
    confirmPassword: Yup.string().required().oneOf([Yup.ref('password'), null], 'Password is not same')
})