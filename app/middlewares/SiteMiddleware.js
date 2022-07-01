
module.exports = function SiteMiddleware(req, res, next)
{
    //res.locals.img = "upload/download20220204193520.png";

    res.locals.sidebar = 
    {
        active: 
        {
            home:       'active',
            store:      'text-dark',
            change:     'text-dark',
            icon:       'text-dark',
            department: 'text-dark',
        }
    }

    next();
}