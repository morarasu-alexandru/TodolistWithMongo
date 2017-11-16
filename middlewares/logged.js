module.exports = function loggedIn(req, res, next) {
    if (req.session.passport.user) {
        next();
    } else {
        res.redirect('/login');
    }
};