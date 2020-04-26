var express = require('express');
var router = express.Router();

//tagger route
router.get('/',function(req, res){    
  res.render('tagger', {layout : 'index', pageTitle: 'tagger.site'});
});

//discogs release ID api route
router.get("/:id",function(req,res){
  const releaseid = req.params.id;
  console.log("/:id , releaseid = ", releaseid)
  
  // return data
  var data = ["Tony","Lisa","Michael","Ginger","Food"]
  res.json(data);

 });

module.exports.router = router;