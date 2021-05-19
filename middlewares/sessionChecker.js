exports.auth = function (req, res, next) {
    if (req.session && req.session.user) {
        res.locals.session = req.session;
        next();
    }
    else
        return res.redirect('/auth/login');
}