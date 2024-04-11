var express = require('express');
var mongoose = require('mongoose');
var fs = require('fs');
var cors = require('cors');
var app = express();
var port = 3030;

app.use(cors());
app.use(require('body-parser').urlencoded({ extended: false }));

var reviewsData = JSON.parse(fs.readFileSync("reviews.json", 'utf8'));
var dealershipsData = JSON.parse(fs.readFileSync("dealerships.json", 'utf8'));

mongoose.connect("mongodb://mongo_db:27017/", { dbName: 'dealershipsDB' });

var Reviews = require('./review');
var Dealerships = require('./dealership');

// Delete and insert data with promises
Reviews.deleteMany({}).then(function() {
  return Reviews.insertMany(reviewsData.reviews);
}).then(function() {
  return Dealerships.deleteMany({});
}).then(function() {
  return Dealerships.insertMany(dealershipsData.dealerships);
}).catch(function(error) {
  console.error("Error fetching documents:", error);
});

// Express route to home
app.get('/', function(req, res) {
  res.send("Welcome to the Mongoose API");
});

// Express route to fetch all reviews
app.get('/fetchReviews', function(req, res) {
  Reviews.find().then(function(documents) {
    res.json(documents);
  }).catch(function(error) {
    res.status(500).json({ error: 'Error fetching documents' });
  });
});

// Other routes...

// Start the Express server
app.listen(port, function() {
  console.log('Server is running on http://localhost:' + port);
});
