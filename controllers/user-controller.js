const passport = require('passport');
const Joi = require('joi');
const APIError = require('../utils/APIError');
const USER = require('../models/users-model');
const POST = require('../models/posts-model');
const COMMENT = require('../models/comments-model');
const ROLE = require('../models/role-model');


exports.register = async (req, res, next) => {

    const { firstName, lastName, email, password } = req.body;
    const payload = req.body;

    let user = await USER.findOne({ email , isDeleted : false});
    if (user)
        return res.render('register-page', { error: "Email is already in use.", data: { firstName, lastName, email } });

    try {
        const schema = Joi.object({
            firstName: Joi.string().min(3).max(20).trim().required(),
            lastName: Joi.string().min(3).max(20).trim().required(),
            email: Joi.string().min(7).max(45).trim().required().lowercase().email(),
            password: Joi.string().min(4).max(10).trim().required(),
            cpassword: Joi.string().min(4).max(10).trim().required(),
        });

        if (password !== req.body.cpassword)
            return res.render('register-page', { error: "Passwords do not match.", data: { firstName, lastName, email } });

        const result = schema.validate(req.body);

        if (result.error) 
            return res.render('register-page', { error: result.error.details[0].message, data: { firstName, lastName, email } });

        const role = await ROLE.findOne({ name: new RegExp('user', 'i') }, '_id');
        if (!role) throw new APIError({ status: 500, message: "System roles are not generated yet." });
        let roleId = role._id;
        const user = await USER.create({ firstName: payload.firstName, lastName, email, password, role: roleId });

        if (user)
            res.redirect('/auth/login');
        else
            res.redirect('/auth/register');

    } catch (error) {
        res.render('register-page', { data: { firstName, lastName, email }, error: error.message })
    }
}

exports.login = async (req, res, next) => {

    try {
    
        req.session.user = req.user._id;
        req.session.role = req.user.role.name;
        res.locals.session = req.session;
        res.redirect('/posts/allpost');

        /* Old login logic */

        // let payload = req.body;
        // payload.email = payload.email.trim();
        // payload.password = payload.password.trim();  
        // const { email, password } = payload;
        // const schema = Joi.object({
        //     email: Joi.string().min(7).max(45).trim().required().lowercase().email(),
        //     password: Joi.string().min(4).max(10).trim().required(),
        // })
        // const result = schema.validate(payload);
        // if (result.error)
        //     return res.render('login-page', { error: result.error.details[0].message , email : email });
        // let user = await USER.findOne({ email, isDeleted: false }).populate({ path: 'role' });
        // if (!user) return res.render('login-page', { error: "Invalid email Id ", email : email });
        // const validate = await user.isValidPassword(password);
        // if (!validate) return res.render('login-page', { error: "Invalid password", email : email });

        // res.locals.session = req.session;
        // console.log(req.session)
        // return res.redirect('/posts/allpost');
    } catch (error) {
        console.log(error)
        return res.redirect('/');
    }
}

exports.profileView = async (req, res, next) => {
    try {
        if (!req.session)
            throw new Error("Session not initialized")
        const user = await USER.findOne({ _id: req.session.user , isDeleted: false })
             .populate({ path: 'posts', match: { isDeleted: false }, select: '_id title content' })
        res.locals.session = req.session;
        return res.render('profile', { user : user });
    } catch (error) {
        console.log(error.message);
        return res.redirect('/')
    }
}

exports.deleteProfile = async(req, res, next) => {
    
    const user = await USER.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { $set: { isDeleted: true, deletedAt: Date.now(), deletedBy: req.session.user } }, { new: true });
    await POST.updateMany({ user: user._id, isDeleted: false }, { $set: { isDeleted: true } });
    await COMMENT.updateMany({ user: user._id, isDeleted: true }, { $set: { isDeleted: true } });
    return res.redirect('/auth/login');
}

exports.updateGET = async (req, res, next) => {
    const user = await USER.findOne({ _id : req.params.id, isDeleted : false });
    return res.render('edit-profile', { user : user });
}

exports.updatePUT = async (req, res, next) => {

    try {
        const schema = Joi.object({
            firstName: Joi.string().min(3).max(20).trim().required(),
            lastName: Joi.string().min(3).max(20).trim().required(),
            email: Joi.string().min(7).max(45).trim().required().lowercase().email(),
            password: Joi.string().min(4).max(10).trim().required(),
        });
    
        let user = await USER.findOne({ email : req.body.email , isDeleted : false});
        if (user)
            return res.render('edit-profile', { user : {...req.body, _id : req.params.id}, error : "Email is already in use."});

        let result = schema.validate(req.body);    
        if (result.error)
            return res.render('edit-profile', { user : {...req.body, _id : req.params.id }, error : result.error.details[0].message });
    
        user = await USER.findOneAndUpdate({ _id : req.session.user, isDeleted : false }, { ...req.body }, { new : true } )
        return res.redirect('/auth/profile');
    } catch (error) {
        let msg = error.code === 11000 ? "Email already Exists" : error.message;
        return res.render('edit-profile', { user : {...req.body, _id : req.params.id}, error : msg});
    }
}
