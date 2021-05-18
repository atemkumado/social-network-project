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


router.post('/system', (req, res) => {
    const { faculty, username, password } = req.body
    console.log("data:  ", faculty, username, password)
    return res.send("Authentication")
})
module.exports = router