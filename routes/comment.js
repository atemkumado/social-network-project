const express = require('express')
const Comment = require('../models/comment')


const router = express.Router()

router.post('/', async (req, res) => {

    const { user_id, article_id, content } = req.body

    const user_cmt = req.session.user.name
    const user_avt = req.session.user.pic


    const comment = new Comment({
        user_cmt, user_avt, article_id, content
    })

    try {
        const newCMT = await comment.save()
        console.log(newCMT)
        return res.redirect('/')
    } catch (e) {
        console.log(e)
    }

})


router.get('/delete/:id', async (req, res) => {
    const { id } = req.params

    const cmt = await Comment.findByIdAndDelete(id)
    if (!cmt) {
        return res.send(id)
    }
    return res.redirect('/')

})


module.exports = router;