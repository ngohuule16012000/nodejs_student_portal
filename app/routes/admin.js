const express = require('express');
const router = express.Router();

const adminController = require('../controllers/AdminController');

router.get('/store', adminController.store);
router.post('/store', adminController.storeCheck);
router.get('/changepass', adminController.changePass);
router.put('/changepass', adminController.changePassCheck);
router.get('/icon', adminController.icon);
router.put('/icon', adminController.addicon);
router.get('/department', adminController.department);
router.put('/department', adminController.adddepartment);
router.get('/icon/add_activity', adminController.activityicon);
router.put('/icon/add_activity', adminController.activityiconCheck);
router.put('/storenews', adminController.storenews);

router.get('/', adminController.index);


module.exports = router;
