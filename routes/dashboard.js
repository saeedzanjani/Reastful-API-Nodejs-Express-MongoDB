const {Router} = require('express');

const { createPost, uploadImage, editPost, deletePost } = require('../controllers/dashboardController');
const {authenticated} = require('../middlewares/auth');

const router = new Router()


router.post('/add-post', authenticated, createPost)

router.post('/image-upload', authenticated, uploadImage)

router.put('/edit-post/:id', authenticated, editPost)

router.delete('/delete-post/:id', authenticated, deletePost)


module.exports = router