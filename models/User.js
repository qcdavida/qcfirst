const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const course = require('../models/Course').schema;
const bcrypt = require('bcrypt-nodejs');

const userSchema = new Schema({
    email: {
        type: String,
        required: "Please supply an email",
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        trim: true
    },
    firstname: {
        type: String,
        trim: true
    },
    lastname: {
        type: String,
        trim: true
    },
    courseid: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Courses' } ], //reference to associated Courses
    role: {
        type: String,
        default: 'student',
        enum: ["student", "instructor", "admin"]
    },
})

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('users', userSchema);