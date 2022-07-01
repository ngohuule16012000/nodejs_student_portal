const express = require('express');
const router = express.Router();

const sidebarController = require('../controllers/SidebarController');

router.get('/:slug', sidebarController.show);

router.get('/', sidebarController.index);

module.exports = router;
