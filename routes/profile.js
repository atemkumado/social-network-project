const express = require('express')
const UserSV = require('../models/usersv');
const Article = require('./../models/article')
const router = express.Router()

router.get('/', (req, res) => {
    const user = req.session.user
    return res.render("profile", { user });
})

module.exports = router