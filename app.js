//console.log("TEST");
//  Use nodemon so we don't have to stop and restart the server every time a change is made.

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');
var db = mongojs('customerapp', ['users'])

var app = express();
var port = 3000;

// // Middleware, outputs to console everytime page is refreshed
// var logger = function(req, res, next) {
//   console.log('logging...');
//   next(); // This ends this piece of middleware and calls the next middleware function.
// }
// app.use(logger);

// Middleware view engine
app.set('view engine', 'ejs');

// Set up folder for view
app.set('views', path.join(__dirname, 'views'));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set static path (Any static resources go into the public folder - HTML, CSS etc)
// The contents of public will overwrite anything defined in app.js
app.use(express.static(path.join(__dirname, 'public')));

// Global vars
app.use(function(req, res, next) {
  res.locals.errors = null;
  next();
});

// var people = [
//   {
//     name: "Raluca",
//     age: 32 
//   },
//   {
//     name: "Agnes",
//     age: 32 
//   },
//   {
//     name: "Ewelina",
//     age: 25 
//   }
// ];

// Express validator v5 defination middleware (these are functions that have access to request and response objects)
app.use(expressValidator()); 

// var users = [
//   {
//     id: 1,
//     firstName: 'Raluca',
//     lastName: 'Rom',
//     email: 'rala@gmail.com'
//   },
//   {
//     id: 2,
//     firstName: 'Agnes',
//     lastName: 'Pol',
//     email: 'aga@gmail.com'
//   },
//   {
//     id: 3,
//     firstName: 'Ewelina',
//     lastName: 'Pol',
//     email: 'ewel@gmail.com'
//   }
// ];

// Route handler. Use an anonymous callback function as second param. Home route.
app.get('/', function(req, res) {
  // res.send('TESTING 12'); // send method prints out to browser screen the agrument.
  // res.json(people);
  
  // var title = 'Customers';
  // res.render('index');

  db.users.find(function (err, docs) {
    // console.log(docs);

    res.render('index', {
      title: 'Customers',
      // users: users
      users: docs
    });
  });
});

app.post('/users/add', function(req, res) {
  console.log("FORM SUBMITTED"); // Outputs to command window.
  // console.log(req.body.first_name);

  req.checkBody('first_name', 'First Name is required').notEmpty();
  req.checkBody('last_name', 'Last Name is required').notEmpty();
  req.checkBody('email', 'Valid email is required').isEmail();
  
  var errors = req.validationErrors();

  console.log(errors);

  if(errors) {
    console.log("FAILED!!!");

    res.render('index', {
      title: 'Customers',
      // users: users,
      users: users,
      errors: errors
    });
  }
  else {
    // Create object
    var newUser = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email
    }
    console.log(newUser);
    console.log('SUCCESS!!!');
    db.users.insert(newUser, function(err, result) {
      if(err) {
        console.log(err);
      }
      else {
        res.redirect('/');
        console.log('RECORD ADDED TO DB');
      }
    }); 
  }
});

app.delete('/users/delete/:id', function(req, res) {
  console.log(req.params.id);
});

app.listen(port, function() {
  console.log(`Server started on port ${port}`);
});

// Install nodemon to monitor for any changes node.js (app.js) application and automatically restart the server when a page is refreshed with new data. No need to press Ctrl + c and type node app every time a change is made.

