const Account = require('../models/Account');
const Icon = require('../models/Icon');
const IconActivity = require('../models/IconActivity');
const { mutipleMongooseToObject } = require('../util/mongoose');
const { mongooseToObject } = require('../util/mongoose');

// upload
const path = require('path');

const log = true;

class SiteController {
    // [GET] /
    index(req, res, next) 
    {
        if (req.session.username)
        {
            Account.findOne({username: req.session.username})
                .then(account => {
                    if(account['department'] === true || req.session.username === 'admin')
                    {
                        res.redirect('/admin');
                    }
                    else
                    {
                        res.render('home');
                    }
                })
                .catch(next);
        }
        else
        {
            req.session.log = log;
            res.locals.log = req.session.log;
            res.render('login');
        }
        
    }

    // [GET] /login
    login(req, res) 
    {
        req.session.log = log;
        res.locals.log = req.session.log;

        if(req.session.flash)
        {
            res.locals.flash = req.session.flash;
            res.render('login');
            req.session.flash = false;
        }
        else
        {
            res.render('login');
        }
        
        
    }

    // [POST] /login
    loginCheck(req, res, next)
    {
        let username = req.body.username;
        let password = req.body.password;
        Account.findOne({username})
            .then((account) => {
                if(account.length == 0)
                {
                    req.session.flash = {
                        type: 'danger',
                        message: 'Username không hợp lệ!',
                    }

                    req.session.log = log;
                    res.locals.log = req.session.log;
                    res.redirect('login');
                }
                else if(account['password'] === password)
                {
                    req.session.username = username;
                    req.session.userid = account['id'];
                    res.app.locals.admin = account['name'];
                    res.app.locals.img   = account['img'];

                    Icon.find({ type: 'feel'})
                        .then((icons) => {
                            const size = Math.ceil(icons.length/2);
                            let array1 = [];
                            let array2 = [];
                            for (let i = 0; i <= size; ++i)
                            {
                                array1.push(icons[i]);
                            }
                            for (let i = size-1; i < icons.length; ++i)
                            {
                                array2.push(icons[i]);
                            }
                            
                            res.app.locals.feelicon1 = mutipleMongooseToObject(array1);
                            res.app.locals.feelicon2 = mutipleMongooseToObject(array2);
                        })      
                        .catch(next);
                    
                    IconActivity.find({})
                        .then((iconActivity) => {
                            res.app.locals.activityicon = mutipleMongooseToObject(iconActivity);
                        })
                        .catch(next);

                    res.redirect('/admin');
                }
                else
                {                    
                    req.session.flash = {
                        type: 'danger',
                        message: 'Password không hợp lệ!',
                    }

                    req.session.log = log;
                    res.locals.log = req.session.log;
                    res.redirect('login');
                }
            })
            .catch(next);
    }

    // [GET] /logout
    logout(req, res)
    {
        req.session.username = false;
        req.session.log = log;
        res.locals.log = req.session.log;
        res.redirect('login');
    }
    
    // [GET] /profile
    profile(req, res, next)
    {
        if(req.session.username == undefined)
        {
            res.redirect('login');
        }
        res.locals.flash = req.session.flash;   
        Account.findOne({username: req.session.username})
            .then(account => {
                res.locals.profile = mongooseToObject(account);
                res.render('profile');
            })
            .catch(next);
        req.session.flash = false;
        
    }

    // [GET] /profile
    updateProfile(req, res, next)
    {
        res.render('updateprofile');
    }

    // [PUT] /profile
    updateProfileCheck(req, res, next)
    {
        res.render('updateprofile');
    }

    // [PUT] /upload
    upload(req, res, next)
    {
        console.log(req.files);
        if(req.files)
        {
            const file = req.files.filetoupload;
            const filename = file.name;

            file.mv( './app/public/upload/' + filename, function (err){
                if(err)
                {
                    console.log(err);
                    req.session.flash = {
                        type: 'dange',
                        message: 'Upload hình ảnh thất bại!',
                    }
                    res.redirect('profile');
                }
                else
                {
                    //update hình đại diện
                    if(req.session.username == undefined)
                    {
                        req.session.flash = {
                            type: 'danger',
                            message: 'Vui lòng đăng nhập lại!',
                        }
                        res.redirect('profile');
                    }
                    Account.updateOne({ username: req.session.username }, { img: '/upload/' + filename })
                        .then(() => {
                            req.session.flash = {
                                type: 'success',
                                message: 'Upload hình ảnh thành công.',
                            }
                            res.app.locals.img = '/upload/' + filename;
                            res.redirect('profile');
                        })
                        .catch(next);

                }
            });
        } 
    }

    // [GET] /auth/google
    authGoogle()
    {
        passport.authenticate('google', {
            scope: ['profile', 'email']
        })
    }
    
    // [GET] /auth/google/callback
    authGoogleCallback()
    {
        passport.authenticate('google');
    }
}

module.exports = new SiteController();
