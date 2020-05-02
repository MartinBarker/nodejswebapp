var express = require('express');
var app = express();
const path = require('path');

//http requests
var $ = require('jquery');
var http = require('http');

//Loads the handlebars module
const handlebars = require('express-handlebars');

//Sets our app to use the handlebars engine
app.set('view engine', 'handlebars');

//Sets handlebars configurations (we will go through them later on)
app.engine('handlebars', handlebars({
    layoutsDir: __dirname + '/views/layouts',
}));

//connect all routes
const routes = require('./routes');
app.use('/', routes);

//use this folder for static files
app.use('/static/', express.static(__dirname + '/static/'));

const port = 5000;
app.listen(port, () => 
    console.log(`App listening to port ${port}`
));