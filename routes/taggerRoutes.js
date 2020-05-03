var express = require('express');
var router = express.Router();
const request = require('request');
const https = require('https')

var jsdom = require('jsdom');
$ = require('jquery')(new jsdom.JSDOM().window);

//tagger home route
router.get('/',function(req, res){    
  res.render('tagger', {
    layout : 'index', 
    pageTitle: 'tagger.site',
    projectsTab:'active',
    icon: 'https://cdn4.iconfinder.com/data/icons/48-bubbles/48/06.Tags-512.png'
  });
});

module.exports.router = router;