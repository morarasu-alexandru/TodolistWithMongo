const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');


router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser(function (user, done) {
    done(null, user.userName);
});


passport.deserializeUser(function (username, done) {
    User.findOne({userName: username}, function (err, user) {
        if (err) {
            return done(err);
        }
        return done(null, user);
    });
});

passport.use(new LocalStrategy(
    {
        usernameField: 'user[name]',
        passwordField: 'user[password]'
    },
    function (username, password, done) {
        User.findUserName(username, password, done)
    }
));

//Register
router.get('/register', (req, res) => {
    res.render('register')
});
router.post('/register', (req, res) => {
    let newUser = new User({
        userName: req.body.user.name,
        password: req.body.user.password
    });

    User.createUser(newUser);
    res.redirect('/login');
});

// Login page
router.get('/login', function (req, res) {
    res.render('login');
});

router.post('/login', passport.authenticate('local', {
        successRedirect: '/todo',
        failureRedirect: '/login',
        failureFlash: false
    }),
    (req, res) => {
        res.redirect('/todo');
    });

router.get('/logout', (req, res) => {
    console.log(req.user);
    req.logout();
    console.log(req.user);
    console.log('Logged out');
    res.redirect('/');
});

module.exports = router;