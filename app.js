require('dotenv').config()
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var logger = require("morgan");
var indexRouter = require("./routes/index");

var articleRouter = require("./routes/article")
var informRouter = require("./routes/inform")

var profileRouter = require("./routes/profile")
var commentRouter = require("./routes/comment")

const flash = require('express-flash')
const session = require('express-session')

require("./passport-setup")
var UserRouter = require("./routes/userrouter")

var passport = require("passport")
var bodyParser = require("body-parser")



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
app.use(flash());

app.use(passport.initialize())
app.use(passport.session())
app.use(session({
    secret: "Any normal Word",       //decode or encode session
    resave: false,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded(
    { extended: false }
))


const users = require('./models/user');



//Middleware check login
function authChecker(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        error = ""
        res.redirect("/user/login");
    }
}




app.use("/user", UserRouter);

app.use(authChecker);

// routes


app.use("/", indexRouter)


app.use("/articles", articleRouter)
app.use("/informs", informRouter)

app.use("/profile", profileRouter)
app.use("/comment", commentRouter)



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