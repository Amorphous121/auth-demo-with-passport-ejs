const USER = require('../models/users-model');
const COMMENT = require('../models/comments-model');
const POST = require('../models/posts-model');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);


exports.create = async (req, res, next) => {

    let payload = req.body;

    const schema = Joi.object({
        comment: Joi.string().min(3).max(150).required(),
        post: Joi.objectId().required(),
    })

    let result = schema.validate(payload);

    if (result.error) {
        return res.redirect('/posts/allpost');
    }

    let comment = await COMMENT.create({
        post: payload.post,
        comment: payload.comment,
        user: req.session.user,
    });

    await USER.findOneAndUpdate({ _id: req.session.user, isDeleted: false }, { $addToSet: { comments: comment._id } });
    await POST.findOneAndUpdate({ _id: payload.post, isDeleted: false }, { $addToSet: { comments: comment._id } });

    return res.redirect('/posts/allpost');
}


exports.updateGET = async (req, res, next) => {
    const comment = await COMMENT.findOne({ _id: req.params.id, isDeleted: false });
    res.render('edit-comment', { comment: comment });
}

exports.update = async (req, res, next) => {
    try {
        const schema = Joi.object({
            comment: Joi.string().min(3).max(50).required()
        })
        const result = schema.validate(req.body);
        if (result.error)
            return res.render('edit-comment', { error: result.error.details[0].message, comment: { _id: req.params.id, comment: req.body.comment } });
        await COMMENT.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { ...req.body }, { new: true });
        res.redirect('/posts/allpost');
    } catch (error) {
        console.log(error.message);
        res.redirect('/post/allpost');
    }
}

exports.delete = async (req, res, next) => {
    try {
        const comment = await COMMENT.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { $set: { isDeleted: true, deletedBy: req.session.user, deletedAt: Date.now() } }, { new: true });
        await POST.findOneAndUpdate({ _id: comment.post, isDeleted: false }, { $pull: { comments: req.params.id } });
        await USER.findOneAndUpdate({ _id: comment.user, isDeleted: false }, { $pull: { comments: req.params.id } });
        res.redirect('/posts/allpost');
    } catch (error) {
        console.log(error);
        res.redirect('/posts/allpost');
    }
}