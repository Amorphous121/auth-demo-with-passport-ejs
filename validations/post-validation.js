const Joi       = require('Joi');
Joi.objectId    = require('joi-objectid')(Joi);

const POST      = require('../models/posts-model');
const APIError  = require('../utils/APIError');

exports.create = {
    body : Joi.object({
        title       : Joi.string().min(3).max(50).required().trim(),
        content     : Joi.string().min(3).max(50).required().trim()
    })
}

exports.findOne = {
    params : Joi.object({
        id : Joi.objectId().required()
    })
}

exports.update = {
    params : Joi.object({
        id : Joi.objectId().required()
    }),
    body : Joi.object({
        title       : Joi.string().min(3).max(50).trim(),
        content     : Joi.string().min(3).max(50).trim()
    }).required().not({})
}

exports.remove = {
    params : Joi.object({
        id : Joi.objectId().required()
    })
}

exports.isExists = async (req, res, next) => {
    const _id  = req.params.id;
    const post = await POST.findOne({ _id, isDeleted : false });
    if (!post) throw new APIError({status : 404, message : "No Record were found for given Id" }); 
    next();  
}