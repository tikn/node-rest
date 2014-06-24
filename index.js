var express = require('express');
var app = express();
var Datastore = require('nedb');
var db = {};
var responder = require('./httpResponder');

var port = process.argv[2] || 3000;
var root = "http://localhost:" + port;

// connect to NeDB database
db.movies = new Datastore({ filename: 'db/movies', autoload: true });

// Necessary for accessing POST data via req.body object
// app.use(express.bodyParser());
app.use(express.urlencoded());
app.use(express.json());

// catch all route to set global values
app.use(function(req, res, next) {
	res.type('application/json');
	res.locals.respond = responder.setup(res);
	next();
});

// Routes
app.get('/', function(req, res) {
	res.send("The API is working");
});
// get movie list
app.get('/movies', function(req, res) {
	db.movies.find({}, res.locals.respond);
});
// insert movie
app.post('/movies', function(req, res) {
	db.movies.insert({title: req.body.title}, res.locals.respond);
});
// get a movie
app.get('/movies/:id', function(req, res) {
	db.movies.findOne({ _id: req.params.id }, res.locals.respond);
});
// update movie
app.put('/movies/:id', function(req, res) {
	db.movies.update({ _id: req.params.id }, req.body, function(err, num) {
		res.locals.respond(err, { success: num + " records updated"});
	});
});
// delete movie
app.delete('/movies/:id', function(req, res) {
	db.movies.remove({ _id: req.params.id }, res.locals.respond);
});

app.listen(port);