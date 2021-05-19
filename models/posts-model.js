const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const PostSchema = new Schema({
    title           : { type: String, required: true },
    content         : { type: String, required: true },
    isDeleted       : { type: Boolean, default: false },
    user            : { type: ObjectId, ref: 'user', default: null },
    comments        : [{ type: ObjectId, ref: 'comment', default: null }],
    deletedBy       : { type: ObjectId, ref: 'user', default: null },
    deletedAt       : { type: Date, default: null },

}, { versionKey: false, timestamps: true });


module.exports = mongoose.model('post', PostSchema, 'posts');