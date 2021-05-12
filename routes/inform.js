const express = require('express')
const Inform = require('./../models/inform')
const router = express.Router()

router.post('/add', async (req, res) => {
    const { title, content, faculty } = req.body;

    const inform = new Inform({
        title,
        content,
        faculty,
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
    // const article = await Article.findByIdAndUpdate(id)
    // if (!article) return res.status(404)

    console.log(id)
    const { title, content, faculty } = req.body;

    const editedInform = await Inform.findById(id)
    editedInform.title = title
    editedInform.content = content
    editedInform.faculty = faculty

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


        informs.map((inform) => {
            result = "Khoa ";
            switch (inform.faculty) {
                case 1:
                    result += "Công Nghệ Thông Tin"
                    break;
                case 2:
                    result += "Quản Trị Kinh Doanh"
                    break;
                case 3:
                    result += "Luật"
                    break;
                case 4:
                    result += "Khoa Học và Ứng Dụng"
                    break;
            }
            inform.user_created = result

        });

        informs = informs.reverse()
        res.render('inform', { informs });
    } catch (err) {
        console.log(err)
    }
})



module.exports = router