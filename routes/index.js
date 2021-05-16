var express = require('express');
var router = express.Router();
var app = require('../app');
var expressLayouts = require('express-ejs-layouts');
// const { route } = require('./user');

const Article = require('./../models/article')
router.use(expressLayouts)

/* GET home page. */
router.get('/', async function (req, res) {
    try {
        user = req.session.user;
        let articles = await Article.find();
        articles = articles.reverse()
        res.render('index', { articles, user });
    } catch (err) {
        console.log(err)
    }

});




module.exports = router;