const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { sequelize } = require('./db/models');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
// const loginRouter = require('./routes/login');
const sign_upRouter = require('./routes/signup');
const questionsRouter = require('./routes/questions');
const { restoreUser, logoutUser } = require('./auth.js');


const app = express();

// view engine setup
app.set('view engine', 'pug');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// set up session middleware
const store = new SequelizeStore({ db: sequelize });

app.use(
  session({
    secret: 'superSecret',
    store: store,
    saveUninitialized: false,
    resave: false,
  })
);

// create Session table if it doesn't already exist
store.sync();

app.use(restoreUser);
app.use('/', indexRouter);
app.use('/sign-up', sign_upRouter);
app.use('/questions', questionsRouter);
app.use('/users', usersRouter);
app.use(logoutUser)

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

app.use((req, res, next) => {
  const e = new Error('The request couldn\'t be found')
  e.status = 404
  next(e)
})

app.get(function (err, req, res, next) {
  if (err.status === 404) {
    console.log("any random string")
    res.status(404);
    res.render('404', {
      title: 'Page Not Found',
    });
  } else {
    console.log("any random string 2")

    next(err);
  }
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
