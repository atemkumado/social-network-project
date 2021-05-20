const express = require('express')
const Comment = require('../models/comment')


const router = express.Router()

router.post('/', async (req, res) => {

    const { user_id, article_id, content } = req.body
    var user = req.session.user
    var user_cmt
    if(user.role < 3 ){
        user_cmt = user.faculty
    }else{
        user_cmt = user.name
    }
    
    const user_avt = user.pic


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