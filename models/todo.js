const User = require('./user');
const Promise = require('bluebird');

User.findAllTodo = (user) => {
    return new Promise((resolve, reject) => {
        User.findOne({userName: user}, (err, foundObject) => {
            if (err) {
                reject(err);
                return;
            }
            if (!foundObject) {
                reject('User not found.');
                return;
            }
            resolve(foundObject.taskList);
        })
    })
};

User.addToDoToUser = (user, todo) => {
    return new Promise((resolve, reject) => {
        User.findOne({userName: user}, (err, foundObject) => {
            if (err) {
                reject(err);
                return;
            }

            if (!foundObject) {
                reject('User not found.');
                return;
            }
            foundObject.taskList.push(todo);
            foundObject.save(function (err, updatedObject) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(updatedObject);
            });
        })
    });
};

User.removeTodo = (user, taskid) => {
    console.log(taskid);
    return new Promise((resolve, reject) => {
        User.findOne({userName: user}, (err, foundObject) => {
            if (err) {
                reject(err);
                return;
            }
            if (!foundObject) {
                reject('User not found.');
                return;
            }
            console.log(foundObject.taskList);
            foundObject.taskList.splice(taskid, 1);
            console.log(foundObject.taskList);
            foundObject.save(function (err, updatedObject) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(updatedObject);
            });
        })
    });
};

module.exports = User;