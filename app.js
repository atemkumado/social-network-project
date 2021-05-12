var createError = require("http-errors");
var express = require("express");
var path = require("path");
var logger = require("morgan");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var articleRouter = require("./routes/article")
var informRouter = require("./routes/inform")
var detailRouter = require("./routes/detail")


// setup mongoose
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/social-network', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

// static files
var app = express();
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
// view engine setup

app.set("view engine", "ejs");
app.use(logger("dev"));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: false }));
app.set("layout", "./layouts/layout")
app.set("javascripts", "./javascripts/fileUpload")


// routes
app.use("/", indexRouter);
app.use("/users", usersRouter);



app.use("/articles", articleRouter)
app.use("/informs", informRouter)
app.use("/detail", detailRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});



module.exports = app;