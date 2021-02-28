let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

//database setup
let mongoose = require('mongoose');
let DB = require('./db')

//modules for authentication
let session = require('express-session');
let passport = require('passport');
let passportLocal = require('passport-local');
let localStrategy = passportLocal.Strategy;
let flash = require('connect-flash');

let indexRouter = require('../routes/index');
let usersRouter = require('../routes/users');
let authRouter = require('../routes/authentication');

//passport config
require("../config/passport")(passport);

//point mongoose to the DB URI
mongoose.connect(DB.URI, {useNewUrlParser : true, useUnifiedTopology : true});

let mongoDB = mongoose.connection;
mongoDB.on('error', console.error.bind(console, 'Connection Error : '));
mongoDB.once('open', () => {
  console.log('Connected to MongoDB...')
})


let app = express();


//authentication setup
app.use(session({
  secret : "secretKey",
  saveUninitialized: false,
  resave: false
}));

//initialize flash
app.use(flash());

//initializepassport
app.use(passport.initialize());
app.use(passport.session());

//check authentication
app.use(function (req, res, next) {
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});



// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../node_modules')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


//passport user configuration
let userModel = require('../models/users');
let user = userModel.user;


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
