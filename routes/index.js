const router = require('express').Router();
const ensureLogin = require('connect-ensure-login');
const { auth } = require('../middlewares/sessionChecker')

router.get('/', auth,  (req, res, next) => {
     res.render('index', { title : "Home Page "});
})

router.use('/auth/', require('./auth-routes'));

router.use('/posts/', ensureLogin.ensureLoggedIn({ redirectTo : '/auth/login/' }), auth , require('./posts-routes'));

router.use('/comments/', ensureLogin.ensureLoggedIn({ redirectTo : '/auth/login/' }), auth , require('./commets-routes') )

module.exports = router;