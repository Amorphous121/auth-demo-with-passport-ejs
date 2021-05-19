const passport = require('passport');
const APIError = require('../utils/APIError');

const handleJwt = (req, res, next, roles) => (err, user, info) => {
    try {
        if (err || !user) {
            throw new APIError({status : 401,  message : info.message});
        }
        if (roles !== undefined) {
            roles = typeof roles == 'string' ? [roles] : roles;
            if (!roles.includes(user.role))
                throw new APIError({status : 403, message : "You have not sufficient rights to access this route."});
        }
        req.user = user;
        return next();
    }
    catch(err) {
        next(err);
    }
}

exports.hasAuth = (roles) => (req, res, next) => {
    passport.authenticate('jwt', { session : false }, handleJwt(req, res, next, roles))(req, res, next);
}