const Joi       = require('Joi');
Joi.objectId    = require('joi-objectid')(Joi);
const COMMENT   = require('../models/comments-model');
const APIError = require('../utils/APIError');

exports.findOne = {
    params : Joi.object({
        id : Joi.objectId().required()
    })
}

exports.create = {
    body : Joi.object({
        post    : Joi.objectId().required(),
        comment : Joi.string().min(3).max(50).required().trim() 
    })
}

exports.update = {
    params : Joi.object({
        id : Joi.objectId().required()
    }),
    body : Joi.object({
        comment : Joi.string().min(3).max(50).trim() 
    }).required().not({})
}

exports.remove = {
    params : Joi.object({
        id : Joi.objectId().required()
    })
}

exports.isExists = async (req, res, next) => {
    const _id = req.params.id;
    const comment = await COMMENT.findOne({_id, isDeleted: false});
    if (!comment) throw new APIError({status : 404, message : "No comment were found with given id. "});
    next();
}