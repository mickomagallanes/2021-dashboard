// const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
// const logger = require('morgan');

const mysql_conn = require("./models/db.js");
const apiRouter = require('./routes/api');
const limiter = require('./middlewares/ratelimiter.js');
const cors = require('cors');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const sessionStore = new MySQLStore({}, mysql_conn.pool);

const app = express();
// middleware for limiter
app.use(limiter.perMinuteLimit);

app.use(cors());

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: '53l3po$@lAr93E$!a&G3lE54',
  store: sessionStore,
  cookie: { maxAge: 24 * 60 * 60 * 1000, httpOnly: true, secure: true },
  resave: true,
  saveUninitialized: false
}));

app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

module.exports = app;
