const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const USER = require("../models/users-model");
const POST = require("../models/posts-model");
const COMMENT = require("../models/comments-model");


exports.allpost = async (req, res, next) => {

    try {
        const query =  POST.find({ isDeleted: false })
        .populate({
            path: "comments",
            match: { isDeleted: false },
            populate: {
                path: "user",
                model: "user",
                select: { firstName: 1, _id: 1 },
            }
        }).sort({ createdAt: -1 });

        const page = req.query.page * 1 || 1;               
        const limit = req.query.limit * 1 || 5;
        const skip = (page - 1) * limit;

        const count = await POST.countDocuments({isDeleted : false});
        
        const posts = await query.skip(skip).limit(limit);

        return res.render('all-post', { posts: posts, current : page, pages : Math.ceil(count / limit)});

    } catch (error) {
        res.locals.message = error.message;
        res.locals.error = error;
        return res.render('error');
    }
}


exports.create = async (req, res, next) => {

    try {
        const { title, content } = req.body;
        const schema = Joi.object({
            title: Joi.string().min(3).max(50).required(),
            content: Joi.string().min(3).max(50).required()
        });

        const result = schema.validate(req.body);

        if (result.error)
            return res.render('create-post', { error: result.error.details[0].message, data: { title, content } });

        
        
        const post = await POST.create({ title, content, user: req.user._id });
        await USER.findOneAndUpdate({ _id: req.session.user }, { $addToSet: { posts: post._id } });
        return res.redirect('/posts/allpost');
    }
    catch (error) {
        console.log(error);
        return res.redirect('/posts/allpost');
    }
};

exports.update = async (req, res, next) => {
    try {
        const { title, content } = req.body;
        const schema = Joi.object({
            title: Joi.string().min(3).max(50).required(),
            content: Joi.string().min(3).max(50).required()
        });

        const result = schema.validate(req.body);

        if (result.error)
            return res.render('edit-post', { error: result.error.details[0].message, post: { title, content, _id: req.params.id } });

        await POST.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { title, content }, { new: true });
        return res.redirect('/posts/allpost');

    } catch (error) {
        console.log(error.message);
        return res.redirect('/posts/allpost');
    }
}


exports.delete = async (req, res, next) => {

    try {
        
        const postInfo = await POST.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { $set: { isDeleted: true, deletedBy : req.session.user, deletedAt : Date.now() } }, { new: true });
        await USER.findOneAndUpdate({ _id: postInfo.user, isDeleted: false }, { $pull: { posts: req.params.id } });
        await COMMENT.updateMany({ post: req.params.id, isDeleted: false }, { $set: { isDeleted: true } });
        res.redirect('/posts/allpost')

    } catch (error) {
        console.log(error.message);
        res.redirect('/posts/allpost')
    }
}

exports.show = async (req, res, next) => {
    const post = await POST.findOne({ _id: req.params.id, isDeleted: false });
    res.render('show', { post: post });
}

exports.edit = async (req, res, next) => {
    const post = await POST.findOne({ _id: req.params.id, isDeleted: false });
    res.render('edit-post', { post: post });
}

