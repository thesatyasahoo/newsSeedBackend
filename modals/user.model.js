const mongoose = require('mongoose');

let User = mongoose.model('users', {
    firstName: { type: String },
    lastName: { type: String },
    username: { type: String },
    email: { type: String },
    password: { type: String },
    file: {type: String},
});

module.exports = User;
