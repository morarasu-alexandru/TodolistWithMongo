module.exports = function loggedIn(req, res, next) {
    if (req.session.passport) {
        next();
    } else {
        res.redirect('/login');
    }
};