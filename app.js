const express = require('express');
const app = express();
const expressSession = require('express-session');
const bodyParser = require('body-parser');


app.set('view engine', 'ejs');
app.use(express.static('statics'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));
app.use((req, res, next) => {
    res.locals.variabila = "view variable";
   res.locals.session = req.session.passport || {};
   next();
});
app.use(require('./controllers'));


app.listen(3000, function () {
    console.log('app started')
});