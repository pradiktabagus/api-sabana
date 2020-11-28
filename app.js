var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var bodyParser = require("body-parser");
var cors = require('cors')
var InitiateMongoServer = require("./config/db");

var indexRouter = require("./routes/index");
var userRouter = require("./routes/users");

//initiate mongoo server
InitiateMongoServer();

var app = express();

//cors
app.use(cors())

//middleware
app.use(bodyParser.json());
// app.use(session({ secret: 'sabana', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false  }));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
/**
 * @Router Middleware
 * @Router - /user/*
 * @Method - *
 */
app.use("/api/auth", userRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404);
  res.send({
    status: 404,
    message: "Not Found",
  });
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  console.error(err.stack)
  // render the error page
  res.status(err.status || 500);
  res.json({'errors': {
    message: err.message,
    error: err
  }})
});

module.exports = app;
