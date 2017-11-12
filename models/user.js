const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: String,
    password: String,
    taskList: {type: Array, default: []}
});

mongoose.connect('mongodb://localhost/to_do_app', {
    useMongoClient: true
});

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log('We are connected to Data base');
});

const User = mongoose.model('User', userSchema);

module.exports = User;