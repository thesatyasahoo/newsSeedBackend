const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://admin:admin123@cluster0.dvk52.mongodb.net/newsFeed?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (!err) {
        console.log('MongoDB connected Successfully');
    } else {
        console.log('Connection failed' + JSON.stringify(err, undefined, 2));
    }
});

module.exports = mongoose;
