const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/verifyHashToken');
const upload = require('../middlewares/uploadMiddleware'); 

const {
  uploadUserCV,
  uploadUserProfilePicture,
  getUserCVSignedUrl,
  getUserProfileSignedUrl
} = require('../controllers/userController');

router.get('/usuario/:ID', authMiddleware, userController.getUserById);

//Formdata
router.post('/upload-cv/:id', authMiddleware, upload.single('file'), uploadUserCV);
router.post('/upload-profile/:id', authMiddleware, upload.single('file'), uploadUserProfilePicture);
router.get('/cv-url/:id', authMiddleware, getUserCVSignedUrl);
router.get('/profile-url/:id', authMiddleware, getUserProfileSignedUrl);


module.exports = router;    