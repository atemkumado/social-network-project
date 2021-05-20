var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt')
var passport = require('passport')
const flash = require('express-flash')

const users = require('../models/user');
const UserSV = require('../models/usersv');
const { check, validationResult } = require('express-validator')

require("../passport-setup")

router.use(passport.initialize())
router.use(passport.session())

function createAdmin(req, res, next) {
    users.findOne({ name: "admin" })
        .then(async (acc) => {
            if (!acc) {
                let admin = new users({
                    name: "admin",
                    password: bcrypt.hashSync("admin", 10),
                    avatar: "/images/admin.png",
                    faculty: "Admin",
                    department: -1,
                    role: 1
                })
                try {

                    var created_admin = await admin.save();
                    console.log("created_user", created_admin);

                } catch (e) {
                    console.log("ERROR in create admin:  ", e)
                }
            }
            next();
        });
}

router.get('/login', createAdmin, (req, res) => {
    console.log('ERROR', req.flash('error'));
    if (req.session.user) {
        return res.redirect('/')
    }
    const error = req.flash('error');
    res.render('login', { error })
})



const loginValidator = [
    check('username').exists().withMessage('Vui lòng nhập tên đăng nhập').notEmpty().withMessage('Không được để trống tên đăng nhập').isLength({ min: 3 }).withMessage('Tên đăng nhập phải từ 3 ký tự'),
    check('password').exists().withMessage('Vui lòng nhập mật khẩu').notEmpty().withMessage('Không được để trống mật khẩu'),
]
router.post('/login', loginValidator, (req, res, next) => {
    console.log("login")
    let result = validationResult(req)
    let { username, password } = req.body


    if (result.errors.length === 0) {

        var account = undefined
        users.findOne({ name: username })
            .then(acc => {
                let check = false;
                if (!acc) {

                    return check;
                } else {
                    account = acc
                    console.log("acccount", acc)
                    return check = true;

                }

            })
            .then(check => {
                console.log("check", req.flash('error'))
                if (check) {
                    bcrypt.compare(password, account.password, function (err, result) {
                        if (result) {
                            user = ({
                                id: account._id,
                                username: username,
                                name: account.name,
                                pic: account.avatar,
                                faculty: account.faculty,
                                department: account.department,
                                role: account.role
                            })
                            req.session.user = user;
                            return res.redirect('/')

                        } else {
                            req.flash('error', 'Mật khẩu không chính xác')
                            return res.render('login', { error: req.flash('error') })
                        }
                    })

                } else {
                    req.flash('error', 'Username không tồn tại')
                    return res.render('login', { error: req.flash('error') })
                }

            })
            .catch(e => {
                req.flash('error', "Login Failed")
                return res.redirect('/user/login')
            })
    }
    else {
        let messages = result.mapped()
        let message
        for (m in messages) {
            message = messages[m].msg
            break
        }
        req.flash('error', message)
        return res.render('login', { error: req.flash('error') })

    }

})


router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/user/login' }),
    function (req, res) {
        // Successful authentication, redirect home.
        let { name, email, pic } = {
            name: req.user.displayName,
            email: req.user.emails[0].value,
            pic: req.user.photos[0].value
        }
        //    return res.end(email);
        UserSV.findOne({ email })

            .then(async (acc) => {

                if (!acc) {

                    let usernew = new UserSV({
                        email: email,
                        role: 3,
                        name: name,
                        avatar: pic
                    })
                    try {

                        var created_user = await usernew.save();
                        console.log("created_user", created_user);

                    } catch (e) {
                        console.log("ERROR:  ", e)
                    }

                    usernew.save();
                }

                let user = {
                    id: (acc) ? acc._id : created_user._id,
                    name,
                    email,
                    pic,
                    role: 3
                }

                req.session.user = user
                // return res.render('profile', { user })
                return res.redirect('/')
            })


            .catch(e => {
                req.flash('error', 'Đăng nhập thất bại')
                return res.redirect('/user/login')
            })

    }
);

router.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/user/login')
})



module.exports = router;