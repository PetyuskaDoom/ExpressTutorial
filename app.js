//console.log("TEST");

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');

var app = express();
var port = 3000;

// // Middleware, outputs to console everytime page is refreshed
// var logger = function(req, res, next) {
//   console.log('logging...');
//   next();
// }

// app.use(logger);

// Middleware view engine
app.set('view engine', 'ejs');

// Set up folder for view
app.set('views', path.join(__dirname, 'views'));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set static path
app.use(express.static(path.join(__dirname, 'public')));

// Global vars
app.use(function(req, res, next) {
  res.locals.errors = null;
  next();
});

// var people = [
//   {
//     name: "Raluca",
//     age: 34 
//   },
//   {
//     name: "Agnes",
//     age: 34 
//   },
//   {
//     name: "Ewelina",
//     age: 29 
//   }
// ];

// Express validator middleware
// app.use(expressValidator({
//   errorFormatter: function(param, msg, value) {
//     var namespace = param.split('.'),
//         root = namespace.shift(),
//         formParam = root;

//     while (namespace.length) {
//       formParam += '[' + namespace.shift() + ']';
//     }    

//     return {
//       param: formParam,
//       msg: msg,
//       value: value
//     };
//   }
// }));

// Express validator v5
app.use(expressValidator()); 

var users = [
  {
    id: 1,
    firstName: 'Raluca',
    lastName: 'Manoliu',
    email: 'rala@gmail.com'
  },
  {
    id: 2,
    firstName: 'Agnes',
    lastName: 'Grzyb',
    email: 'aga@gmail.com'
  },
  {
    id: 3,
    firstName: 'Ewelina',
    lastName: 'Dziedzina',
    email: 'ewel@gmail.com'
  }
];

// Use an anonymous callback function as second param.
app.get('/', function(req, res) {
  //res.send('TESTING 10'); // send method prints out to browser screen the agrument.
  //res.json(people);
  
  //var title = 'Customers';
  res.render('index', {
    title: 'Customers',
    users: users
  });
});

app.post('/users/add', function(req, res) {
  //console.log("FORM SUBMITTED"); // Outputs to command window.
  //console.log(req.body.firstName);

  req.checkBody('firstName', 'First Name is required').notEmpty();
  req.checkBody('lastName', 'Last Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();

  var errors = req.validationErrors();

  if(errors) {
    console.log("ERRORS!!!");
    res.render('index', {
      title: 'Customers',
      users: users,
      errors: errors
    });
  }
  else {
    var newUser = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email
    }
    console.log(newUser);
    console.log('SUCCESS!!!');
  }
});

app.listen(port, function() {
  console.log("Server started on port " + port);
});

// Install nodemon to monitor for any changes node.js (app.js) application and automatically restart the server when a page is refreshed with new data. No need to press Ctrl + c and type node app every time a change is made.

