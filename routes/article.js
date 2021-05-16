const express = require('express')
const Article = require('./../models/article')

const router = express.Router()

const imageMineTypes = ['image/jpeg', 'image/png', 'image/gif']

router.post('/', async (req, res) => {
    console.log("OK")
    const user_id = req.session.user.id;
    const username = req.session.user.name;
    const avatar = req.session.user.pic;
    const content = req.body.content;
    const image = req.body.image || null

    const article = new Article({
        user_id,
        username,
        avatar,
        content
    })
    saveArticle(article, image)
    try {
        const newArticle = await article.save()
        return res.redirect('/')
    } catch (e) {
        console.log(e)
    }
})

router.get('/delete/:id', async (req, res) => {
    const { id } = req.params
    const article = await Article.findByIdAndDelete(id)
    if (!article) return res.status(404)
    return res.redirect("/");
})

router.post('/update/:id', async (req, res) => {
    const { id } = req.params
    // const article = await Article.findByIdAndUpdate(id)
    // if (!article) return res.status(404)
    console.log(id)
    const content = req.body.content;
    const image = req.body.image || null

    const article = await Article.findById(id)
    article.content = content
    saveArticle(article, image)
    try {
        const updatedArticle = await article.save()
        return res.redirect('/')
    } catch (e) {
        console.log(e)
    }
})

function saveArticle(article, imgEncoded) {
    if (imgEncoded == null) return;
    const img = JSON.parse(imgEncoded);
    if (img != null && imageMineTypes.includes(img.type)) {
        article.image = new Buffer.from(img.data, 'base64')
        article.imageType = img.type
    }

}


module.exports = router