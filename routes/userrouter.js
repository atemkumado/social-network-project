var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt')
var passport = require('passport')
const flash = require('express-flash')
var session = require('express-session')
var methodOverride = require('method-override');
const users = require('../models/user');
const UserSV = require('../models/usersv');
const { check, validationResult } = require('express-validator')
const fs = require('fs')
var bodyParser = require("body-parser")
const app = require('../app');
require("../passport-setup")

router.use(passport.initialize())
router.use(passport.session())

router.get('/login', (req, res) => {
    if (req.session.user) {
        return res.redirect('/')
    }
    const error = req.flash('error') || ''
    res.render('login', { error })
})

const loginValidator = [
    check('username').exists().withMessage('Vui lòng nhập tên đăng nhập').notEmpty().withMessage('Không được để trống tên đăng nhập').isLength({ min: 5 }).withMessage('Tên đăng nhập phải từ 5 ký tự'),
    check('password').exists().withMessage('Vui lòng nhập mật khẩu').notEmpty().withMessage('Không được để trống mật khẩu').isLength({ min: 6 }).withMessage('Mật khẩu không chính xác'),
]
router.post('/login', loginValidator, (req, res) => {
    let result = validationResult(req)
    if (result.errors.length === 0) {
        let { username, password } = req.body
        let Userr = undefined

        users.findOne({ username: username })
            .then(acc => {
                if (!acc) {
                    req.flash('error', 'Username không tồn tại')
                    return res.redirect('/user/login')
                }
                Userr = acc
                return bcrypt.compare(password, acc.password)
            })
            .then(passwordMatch => {
                if (!passwordMatch) {
                    req.flash('error', 'Mật khẩu không chính xác')
                    return res.redirect('/user/login')
                }
                else {
                    let user = ({
                        username: username,
                        name: Userr.name,
                        department: Userr.department,
                        role: Userr.role
                    })
                    req.session.user = user
                    return res.redirect('/')
                }
            })
            .catch(e => {
                req.flash('error', "dang nhap that bai")
                return res.redirect('/user/login')
            })
    }
    else {
        let messages = result.mapped()
        let message = ''
        for (m in messages) {
            message = messages[m]
            break
        }
        req.flash('error', "Ko dang nhap dc")
        res.redirect('/user/login')
    }
})

router.get('/register', (req, res) => {
    const error = req.flash('error') || ''
    res.render('register.ejs', { error })
})

const regisvalidator = [
    check('username').exists().withMessage('Vui lòng nhập tên đăng nhập').notEmpty().withMessage('Không được để trống tên đăng nhập').isLength({ min: 5 }).withMessage('Tên đăng nhập phải từ 5 ký tự'),
    check('name').exists().withMessage('Vui lòng nhập tên người dùng').notEmpty().withMessage('Không được để trống tên người dùng').isLength({ min: 6 }).withMessage('Tên người dùng phải từ 6 ký tự'),
    check('password').exists().withMessage('Vui lòng nhập mật khẩu').notEmpty().withMessage('Không được để trống mật khẩu').isLength({ min: 6 }).withMessage('Mật khẩu phải từ 6 ký tự'),

]


router.post('/register', regisvalidator, async (req, res) => {
    let rs = validationResult(req)
    if (rs.errors.length === 0) {
        let { username, password, name, department } = req.body
        users.findOne({ username: username })
            .then(acc => {
                if (acc) {
                    req.flash('error', "Tài khoản đã tồn tại")
                    return res.redirect(req.get('referer'))
                }
            })
            .then(() => bcrypt.hash(password, 10))
            .then(hashed => {

                let user = new users({
                    username: username,
                    password: hashed,
                    name: name,
                    department: department,
                    role: "manager"
                })
                return user.save()

            })
            .then(() => {

                return res.redirect(req.get('referer'))
            })
            .catch(e => {
                req.flash('error', 'Đăng ký thất bại')
                return res.redirect(req.get('referer'))
            })

    }
    else {
        let mess = rs.mapped()
        let mes = ''
        for (m in mess) {
            mes = mess[m].msg
            break
        }
        req.flash('error', "Vui lòng nhập đầy đủ thông tin")
        res.redirect(req.get('referer'))
    }


})


users.findOne({ role: "admin" })
    .then(async (acc) => {

        if (!acc) {

            let admin = new users({
                username: "admin",
                password: "admin",
                role: "admin"
            })
            try {

                var created_admin = await admin.save();
                console.log("created_user", created_admin);

            } catch (e) {
                console.log("ERROR in create admin:  ", e)
            }

            admin.save();
        }
    });


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
                        role: "student",
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
                    role: "student"
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