const router        = require('express').Router();
const CommentController = require('../controllers/comment-controller');

const { auth } = require('../middlewares/sessionChecker');

router.delete('/delete/:id', auth, CommentController.delete);

router.post('/addComment', auth, CommentController.create);

router.get('/update/:id', auth, CommentController.updateGET);

router.put('/update/:id', auth, CommentController.update);

module.exports = router;

