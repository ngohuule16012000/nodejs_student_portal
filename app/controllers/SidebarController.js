class SidebarController {
    // [GET] /
    index(req, res) {
        res.render('sidebardemo');
    }

    // [GET] /sidebar/:slug
    show(req, res) {
        res.send('Sidebar detail');
    }
}

module.exports = new SidebarController();
