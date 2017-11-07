'use strict'

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

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

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log('We are connected to Data base');
});

//Old to do
var toDoSchema = new mongoose.Schema({
    task: {type: String, default: 'unset task'},
    ajaxRequest: {type: Boolean, default: false}
});

var Todo = mongoose.model('ToDo', toDoSchema);


//Home page
app.get('/', function (req, res) {
    Todo.find(function (err, tasks) {
        if (err) {
            console.log(err);
        } else {
            res.render('home', {todos: tasks});
        }
    });
});

app.post('/', function (req, res) {
    var newTask = new Todo({
        task: req.body.task,
        ajaxRequest: req.body.ajaxRequest
    });
    newTask.save(function (err, task) {
        if (err) {
            console.log(err);
        }
        console.log("task added: ", task);
        Todo.find(function (err, tasks) {
            if (err) {
                console.log(err);
            }
            else {
                if (task.ajaxRequest) {
                    res.send(task);
                }
                else {
                    res.redirect('/')
                }
            }
        });
    });
});

app.delete('/:id', function (req, res) {
    console.log(req.params);
    console.log(req.params.id);
    Todo.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
});

//Register
app.get('/register', function (req, res) {
    res.render('register')
});
app.post('/register', function (req, res) {
    var newUser = new User({
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