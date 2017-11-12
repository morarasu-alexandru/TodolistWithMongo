const express = require('express');
const router = express.Router();
const methodOverride = require('method-override');


router.use(methodOverride('_method'));


//Home page
router.get('/', (req, res) => {
    res.render('home')
});

router.use('', require('./users'));


module.exports = router;