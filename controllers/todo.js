'use strict';

const express = require('express');
const router = express.Router();
const User = require('../models/todo');
const loggedIn = require('../middlewares/logged');

router.get('/todo', loggedIn, (req, res) => {
    User
        .findAllTodo(res.locals.session.user)
        .then((response) => {
            console.log(response);
            res.render('todo', {todolist: response});
        })
        .catch((error) => {
            console.error((error));
        })

});

router.post('/todo', loggedIn, (req, res) => {
    let loading = true;
    User
        .addToDoToUser(res.locals.session.user, req.body.task)
        .then((response) => {
            console.log(response);
            res.redirect('/todo');
        })
        .catch((error) => {
            console.error(error);
            res.redirect('/');
        })
        .finally(() => {
            loading = false;
            console.log('FINALLY');
        });
});

router.post('/removetodo/:id', loggedIn, (req, res) => {
    let taskid = req.params.id;
    User
        .removeTodo(res.locals.session.user, taskid)
        .then((response) => {
            console.log(response);
            res.redirect('/todo');
        })
        .catch((error) => {
            console.error(error);
            res.redirect('/');
        });
});

module.exports = router;