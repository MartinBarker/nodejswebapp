var express = require('express');
var router = express.Router();

//home page
router.get('/', (req, res) => {
    res.render('home', {
        layout : 'index', 
        pageTitle: 'martinbarker.me', 
        icon: '/static/assets/img/home.png', 
        homePage:'active',
    });
});

//projects page
router.get('/projects', (req, res) => {
    res.render('projects', {
        layout : 'index',
        pageTitle: 'projects',
        icon: '/static/assets/img/projects.png', 
        projectsTab:'active'
    });
});

//tagger routes
router.use('/tagger', require('./taggerRoutes').router);

//discogstagger routes
//router.use('/discogstagger', require('./discogstagger_api').router);

router.get("/url", (req, res, next) => {
    res.json(["Tony","Lisa","Michael","Ginger","Food"]);
});

module.exports = router;