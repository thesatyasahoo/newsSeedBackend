const mongoose = require('mongoose');

let Users = mongoose.model('Users', {
    firstName: { type: String },
    lastName: { type: String },
    username: { type: String },
    email: { type: String },
    password: { type: String },
    file: {type: String},
});

module.exports = Users;
