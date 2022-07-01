const express = require('express');
const router = express.Router();

const siteController = require('../controllers/SiteController');

router.post('/login', siteController.loginCheck);
router.get('/login', siteController.login);
router.get('/logout', siteController.logout);
router.get('/profile', siteController.profile);
router.get('/update_profile', siteController.updateProfile);
router.put('/update_profile', siteController.updateProfileCheck);
router.put('/upload', siteController.upload);
router.get('/auth/google', siteController.authGoogle);
router.get('/auth/google/callback', siteController.authGoogleCallback);

router.get('/', siteController.index);

module.exports = router;
