const express = require('express');
const upload = require('../middlewares/uploadMiddleware');
const { handleCVUpload } = require('../controllers/aiController');
const authMiddleware = require('../middlewares/verifyHashToken');

const router = express.Router();

router.post('/analizar-cv', authMiddleware, upload.single('file'), handleCVUpload);

module.exports = router;
