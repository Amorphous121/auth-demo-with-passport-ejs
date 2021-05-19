const mongoose = require('mongoose');
const POST = require('./posts-model')
const APIError = require('../utils/APIError');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const CommentSchema = new Schema({

    comment         : { type: String, required: true },
    user            : { type: ObjectId, ref: 'user', default: null },
    post            : { type: ObjectId, ref: 'post', default: null },
    isDeleted       : { type: Boolean, default: false, required: true },
    deletedBy       : { type: ObjectId, ref: 'user', default: null },
    deletedAt       : { type: Date, default: null }

}, { versionKey: false, timestamps: true });


CommentSchema.pre('save', async function (next) {
    const post = await POST.findOne({ _id: this.post, isDeleted: false });
    if (post) next();
    else throw new APIError({status : 400, message : "Please provide a valid post id."});
})


module.exports = mongoose.model('comment', CommentSchema, 'comments');