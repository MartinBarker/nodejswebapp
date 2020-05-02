var express = require('express');
var router = express.Router();
var $ = require('jquery');
var http = require('http');

//tagger home page route
router.get('/',function(req, res){    
  res.render('tagger', {
    layout : 'index', 
    pageTitle: 'tagger.site',
    projectsTab:'active',
    icon: 'https://cdn4.iconfinder.com/data/icons/48-bubbles/48/06.Tags-512.png'
  });
});

//discogs release id
router.get("/release/:id",function(req,res){
  const releaseid = req.params.id;
  console.log("/tagger/release/:id , id = ", releaseid);
  
  //make discogs API request to get tracklist
  /* 
  $.ajax({
    url: 'https://api.discogs.com/masters/17217',
    type: 'GET',
    contentType: "application/json",
    success: function (data) {
        console.log('ajax successfull, data = ' + data);
    },
    error: function (error) { // error callback 
      console.log('ajax failed, error = ' + error);
    }
    
  }); */

  //return data
  var data = [
    ['trackTitle1', 'start1', 'end1'],
    ['trackTitle1', 'start1', 'end1'],
    ['trackTitle1', 'start1', 'end1']
  ]
  res.json(data);

});

//discogs master id
router.get("/master/:id",function(req,res){
  const releaseid = req.params.id;
  console.log("/tagger/master/:id , id = ", releaseid);
  
  // return data
  //var data = ["Tony","Lisa","Michael","Ginger","Food"]
  //res.json(data);

});

module.exports.router = router;