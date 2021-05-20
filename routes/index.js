var express = require('express');
var router = express.Router();
var expressLayouts = require('express-ejs-layouts');

const Article = require('./../models/article')
const Comment = require('./../models/comment')
const Inform = require('./../models/inform')

router.use(expressLayouts)

/* GET home page. */
router.get('/', async function (req, res) {
    try {
        user = req.session.user;
        var articles = await Article.find();
        articles = articles.reverse()
        var comments = await Comment.find();

        var informs = await Inform.find();
        console.log(informs)
        res.render('index', { articles, user, comments, informs });
    } catch (err) {
        console.log(err)
    }

});




module.exports = router;