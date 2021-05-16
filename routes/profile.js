const express = require('express')
const UserSV = require('../models/usersv');
const Article = require('./../models/article')
const router = express.Router()

router.get('/', async (req, res) => {
    const user = req.session.user
    console.log(user.id)
    let articles = await Article.find({ user_id: user.id });
    articles = articles.reverse()
    return res.render("profile", { user, articles });
})

module.exports = router