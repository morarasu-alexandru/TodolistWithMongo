var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var methodOverride = require('method-override');


app.set('view engine', 'ejs');
app.use(express.static('statics'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(methodOverride('_method'));

mongoose.connect('mongodb://localhost/to_do_app', {
    useMongoClient: true
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log('We are connected to Data base');
});

var toDoSchema = new mongoose.Schema({
    task: {type: String, default: 'unset task'},
    ajaxRequest: {type: Boolean, default: false}
});

var Todo = mongoose.model('ToDo', toDoSchema);

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

app.listen(3000, function () {
    console.log('app started')
});