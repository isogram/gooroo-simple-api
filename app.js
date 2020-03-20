var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var env = require('dotenv').load();
var port = process.env.PORT || env.parsed.PORT || 8080;

// models
var models = require("./models");

// routes
var books = require('./routes/books');
var categories = require('./routes/categories');
var users = require('./routes/users');

// sync db
models.sequelize.sync().then(function() {
    console.log('connected to database')
}).catch(function(err) {
    console.log(err)
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// register routes
app.use('/books', books);
app.use('/categories', categories);
app.use('/users', users);

// index path
app.get('/', function(req, res){
    console.log('app listening on port: '+port);
    res.send({'message': 'simple rest api for gooroo'})
});

app.listen(port, function(){
    console.log('app listening on port: '+port);
});

module.exports = app;