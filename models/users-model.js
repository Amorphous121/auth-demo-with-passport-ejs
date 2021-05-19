const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const UserSchema =  new Schema({

    firstName       : { type  : String, required : true, trim : true },
    lastName        : { type  : String, required : true, trim : true },
    email           : { type  : String, required : true, lowercase : true, trim : true },
    isDeleted       : { type  : Boolean, default : false, required : true },
    password        : { type  : String, required : true, trim : true},
    posts           : [{ type : mongoose.Schema.Types.ObjectId, ref : 'post', default: null }],
    comments        : [{ type : mongoose.Schema.Types.ObjectId, ref : 'comment', default: null }],
    role            : { type  : ObjectId, ref : 'role',  default: null },
    deletedBy       : { type  : ObjectId, ref: 'user', default: null},
    deletedAt       : { type  : Date, default: null },

}, { versionKey: false, timestamps : true });

UserSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}


UserSchema.virtual('fullname').get(function() {
    return this.firstName + " " + this.lastName;
})

UserSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

UserSchema.pre('findOneAndUpdate', async function (next) {
    if (this._update.password) {
        this._update.password = await bcrypt.hash(this._update.password, 10);
        next();
    }
})

module.exports = mongoose.model('user', UserSchema, 'users');