const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');


router.use(passport.initialize());
router.use(passport.session());

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
        User.find({userName: username}, function (err, user) {
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

//Register
router.get('/register', function (req, res) {
    res.render('register')
});
router.post('/register', function (req, res) {
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
router.get('/login', function (req, res) {
    res.render('login');
});

router.post('/login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: false
    }),
    (req, res) => {
        res.redirect('/');
    });

module.exports = router;