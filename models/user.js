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

User.findUserName = (username, password, done) => {
    User.findOne({userName: username}, (err, user) => {
        console.log(user);
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, {message: 'Incorrect username.'});
        }
        if (user.password !== password) {
            return done(null, false, {message: 'Incorrect password.'});
        }
        return done(null, user);
    });
};

User.createUser = (newUser) => {
    User.create(newUser, (err, newUser) => {
        if (err) {
            console.log(err);
        } else {
            console.log(newUser);
        }
    });
};

module.exports = User;