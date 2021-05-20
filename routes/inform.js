const express = require('express')
const Inform = require('./../models/inform')
const router = express.Router()

router.get("/detail/:id", async (req, res) => {
    try {
        let { id } = req.params
        let inform = await Inform.findById(id)

        console.log(inform);
        res.render('detail', { inform });
    } catch (err) {
        console.log(err)
        res.redirect('/');
    }

})


router.post('/add', async (req, res) => {
    const { title, content, faculty, faculty_id } = req.body;

    const inform = new Inform({
        title,
        content,
        faculty,
        faculty_id,

    })
    try {
        const newInform = await inform.save()
        console.log(newInform)
        return res.redirect('/informs')
    } catch (e) {
        console.log(e)
    }
})

router.get('/delete/:id', async (req, res) => {
    const { id } = req.params
    const deletedInform = await Inform.findByIdAndDelete(id)
    if (!deletedInform) return res.status(404)
    return res.redirect("/informs");
})

router.post('/update/:id', async (req, res) => {
    const { id } = req.params

    console.log(id)
    const { title, content } = req.body;

    const editedInform = await Inform.findById(id)
    editedInform.title = title
    editedInform.content = content

    try {
        const updatedInform = await editedInform.save()
        return res.redirect('/informs')
    } catch (e) {
        console.log(e)
    }
})

router.get("/", async (req, res) => {
    try {
        let informs = await Inform.find();
        informs = informs.reverse()
        res.render('inform', { informs });
    } catch (err) {
        console.log(err)
    }
})



module.exports = router