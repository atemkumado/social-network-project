const express = require('express')
const User = require('../models/user');
const Article = require('./../models/article')
var bcrypt = require('bcrypt')
const router = express.Router()

router.get('/', async (req, res) => {
    const user = req.session.user
    console.log(user.id)
    let articles = await Article.find({ user_id: user.id });
    articles = articles.reverse()
    return res.render("profile", { user, articles });
})


router.post('/system', async (req, res, next) => {
    const { faculty_id, username, password, faculty } = req.body

    const user = new User({
        name: username,
        password: bcrypt.hashSync(password, 10),
        avatar: "/images/office.png",
        faculty,
        department: faculty_id,
        role: 2,
    })
    try {
        const newUser = await user.save()
        console.log(newUser)
        next();
    } catch (e) {
        console.log(e)
    }

    return res.redirect('/profile')
})
module.exports = router