const PostController    = require('../controllers/post-controller');
const router            = require('express').Router();

const { auth } = require('../middlewares/sessionChecker');

router.get('/create', (req, res, next) => {
    res.render('create-post');
})

router.get('/show/:id', auth, PostController.show)

router.get('/edit/:id', auth ,PostController.edit);

router.post('/create', auth ,PostController.create);

router.get('/allpost', auth ,PostController.allpost);

router.put('/:id', auth ,PostController.update);

router.delete('/:id', auth, PostController.delete);


module.exports = router;

