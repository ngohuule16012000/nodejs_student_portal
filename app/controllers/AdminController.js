const { render } = require('node-sass');
const Account = require('../models/Account');
const Icon = require('../models/Icon');
const IconActivity = require('../models/IconActivity');
const News = require('../models/News');
const { mutipleMongooseToObject } = require('../util/mongoose');
const { mongooseToObject } = require('../util/mongoose');
        
const ac = 'active';
const text = 'text-dark';

class AdminController 
{
    // [GET] /admin
    index(req, res, next) 
    { 
        // Icon.updateMany({ type: "Đang chúc mừng" }, { typeOf: "activity" })
        //     .then(() => res.render('admin'))
        //     .catch(next);
        // return;
        
        News.find({}).sorttable()
            .then(news => {                  
                res.locals.news = mutipleMongooseToObject(news);
                res.render('admin');
            })
            .catch(next);
    }

    // [GET] /admin/store
    store(req, res) 
    {
        Object.assign(res.locals.sidebar, {
            active: 
            {
                home:       text,
                store:      ac,
                change:     text,
                icon:       text,
                department: text,
            }
        });

        res.locals.flash = req.session.flash;
        res.render('admin/store');
        req.session.flash = false;
    }

    // [POST] /admin/store
    storeCheck(req, res, next)
    {
        req.body.department = true;
        const account = new Account(req.body);
        account.save()
            .then(() => {
                req.session.flash = {
                    type: 'success',
                    message: 'Tạo tài khoản thành công.',
                }
                res.redirect('store');
            })
            .catch(next);
        
    }

    // [GET] /admin/changepass
    changePass(req, res)
    {
        Object.assign(res.locals.sidebar, {
            active: 
            {
                home:       text,
                store:      text,
                change:     ac,
                icon:       text,
                department: text,
            }
        });

        res.locals.flash = req.session.flash;
        res.render('admin/changepass');
        req.session.flash = false;
    }
    
    // [PUT] /admin/changepass
    changePassCheck(req, res, next)
    {
        const pass1 = req.body.password1;
        const pass2 = req.body.password2;
        if(pass1 === pass2)
        {
            if(req.session.username == undefined)
            {
                req.session.flash = {
                    type: 'danger',
                    message: 'Vui lòng đăng nhập lại!',
                }
                res.redirect('changepass');
            }

            Account.updateOne({ username: req.session.username }, { password: pass1 })
            .then(() => {
                req.session.flash = {
                    type: 'success',
                    message: 'Thay đổi mật khẩu thành công.',
                }
                res.redirect('changepass');
            })
            .catch(next);
        }
        else
        {
            req.session.flash = {
                type: 'danger',
                message: 'Mật khẩu không trùng khớp.',
            }
            res.redirect('changepass');
        }
        
    }

    // [GET] admin/icon
    icon(req, res, next)
    {
        Object.assign(res.locals.sidebar, {
            active: 
            {
                home:       text,
                store:      text,
                change:     text,
                icon:       ac,
                department: text,
                
            }
        });

        res.locals.flash = req.session.flash;
        res.render('admin/icon');
        req.session.flash = false;
    }
    
    // [PUT] admin/icon
    addicon(req, res, next)
    {
        const icon = new Icon(req.body);
        if (req.body.type == 'activity')
        {
            const iconActivity = new IconActivity(req.body);
            iconActivity.save();
        }
        
        icon.save()
            .then(() => {
                req.session.flash = {
                    type: 'success',
                    message: 'Thêm icon thành công.',
                }
                res.redirect('icon');
            })
            .catch(next);
    }

    // [GET] admin/department
    department(req, res, next)
    {
        Object.assign(res.locals.sidebar, {
            active: 
            {
                home:       text,
                store:      text,
                change:     text,
                icon:       text,
                department: ac,
                
            }
        });
        res.render('admin/department');
    }

    // [PUT] admin/department
    adddepartment(req, res, next)
    {
        res.render('admin/department');
    }

    // [GET] admin/icon/add_activity
    activityicon(req, res, next)
    {
        Object.assign(res.locals.sidebar, {
            active: 
            {
                home:       text,
                store:      text,
                change:     text,
                icon:       ac,
                department: text,
                
            }
        });

        Icon.find({ type: 'activity' })
            .then((icons) => {
                res.app.locals.activityiconname = mutipleMongooseToObject(icons);
                
                res.locals.flash = req.session.flash;
                res.render('admin/activityicon');
                req.session.flash = false;
                
            })      
            .catch(next);

        
    }
    
    // [PUT] admin/icon/add_activity
    activityiconCheck(req, res, next)
    {
        req.body.typeOf = 'activity';
        const icon = new Icon(req.body);

        Promise.all([
            icon.save(),
            Icon.find({ type: req.body.type })
        ])
            .then(([saved, icon]) => {
                IconActivity.updateOne({ name: req.body.type}, { icons: icon })
                    .then(() => {
                        req.session.flash = {
                            type: 'success',
                            message: 'Thêm icon thành công.',
                        }
                        res.redirect('add_activity');
                    })
                    .catch(next);
            })
            .catch(next);
        
    }

    // [PUT] /admin/storenews
    storenews(req, res, next)
    {
        if(req.session.username == undefined)
        {
            res.redirect('/login');
            return;
        }

        let filename = false;

        if(req.files)
        {
            const file = req.files.filetoupload;
            filename = file.name;

            file.mv( './app/public/upload/' + filename, function (err){
                if(err)
                {
                    console.log(err);
                    req.session.flash = {
                        type: 'dange',
                        message: 'Upload hình ảnh thất bại!',
                    }
                    res.redirect('/admin');
                }
                else
                {
                    filename = '/upload/' + filename;
                }
            });
        } 

        const id = req.session.userid;
        Account.findOne({id})
            .then(acc => {
                const news = new News(req.body);
                news.basic = {
                    name: acc.name,
                    img: acc.img,
                };
                //news.basic = acc;
                if(filename)
                    news.filetoupload = '/upload/' +  filename;
                // res.json(news);
                // return;
                news.save()
                    .then(() => res.redirect('/admin'))
                    .catch(next);
            })
            .catch(next);
       
    }
}

module.exports = new AdminController();
