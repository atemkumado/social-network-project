const express = require('express')
const Inform = require('./../models/inform')
const router = express.Router()

router.get("/:id", async (req, res) => {

    try {
        let {id} = req.params
        let inform = await Inform.findById(id)
        
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

        console.log(inform);
        res.render('detail', { inform });
    } catch (err) {
        console.log(err)
    }

})
module.exports = router