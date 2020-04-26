var express = require('express');
var router = express.Router();

//home page
router.get('/', (req, res) => {
    res.render('main', {layout : 'index'});
});

//projects page
router.get('/projects', (req, res) => {
    res.render('projects', {layout : 'index'});
});

//tagger routes
router.use('/tagger', require('./tagger_api').router);

//discogstagger routes
//router.use('/discogstagger', require('./discogstagger_api').router);

router.get("/url", (req, res, next) => {
    res.json(["Tony","Lisa","Michael","Ginger","Food"]);
});

module.exports = router;