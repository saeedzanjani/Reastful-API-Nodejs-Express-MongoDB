const {Router} = require('express');
const { getIndex, getSinglePost, getCaptcha, handleContactPage } = require('../controllers/indexController');

const router = new Router()


router.get('/', getIndex)

router.get('/post/:id', getSinglePost)

router.get("/captcha.png", getCaptcha);

router.post("/contact", handleContactPage);


module.exports = router