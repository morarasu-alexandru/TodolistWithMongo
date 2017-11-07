const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

app.set('view engine', 'ejs');
app.use(express.static('statics'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(methodOverride('_method'));

//New to do, with user authentification

const userSchema = new mongoose.Schema({
    userName: String,
    password: String,
    taskList: {type: Array, default: []}
});

var User = mongoose.model('User', userSchema);

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
    done(null, user.userName);
});
passport.deserializeUser(function(username, done) {
    User.findOne({userName: username}, function (err, user) {
    if(err) {
        return done(err);
    }
    return done(null, user);
    });
});

passport.use(new LocalStrategy(
    { usernameField : 'user[name]',
        passwordField : 'user[password]'
    },
    function (username, password, done) {
        console.log('ceva');
        User.findOne({userName: username}, function (err, user) {
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
    }
));


mongoose.connect('mongodb://localhost/to_do_app', {
    useMongoClient: true
});

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log('We are connected to Data base');
});

//Home page
app.get('/', function (req, res) {
    res.render('home')
});

app.post('/', function (req, res) {

});

app.delete('/:id', function (req, res) {

});

//Register
app.get('/register', function (req, res) {
    res.render('register')
});
app.post('/register', function (req, res) {
    let newUser = new User({
        userName: req.body.user.name,
        password: req.body.user.password
    });

    User.create(newUser, function (err, newUser) {
        if (err) {
            console.log(err);
        } else {
            console.log(newUser);
        }
    });
    res.redirect('/')
});

// Login page

app.get('/login', function (req, res) {
    res.render('login');
});

app.post('/login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: false
    }),
     (req, res) => {
        res.redirect('/');
    });

app.listen(3000, function () {
    console.log('app started')
});