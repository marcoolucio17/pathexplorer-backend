const express = require('express');
const upload = require('../middlewares/uploadMiddleware');
const { handleCVUpload, mejorarTexto  } = require('../controllers/aiController');
const authMiddleware = require('../middlewares/verifyHashToken');

const router = express.Router();

router.post('/analizar-cv', authMiddleware, upload.single('file'), handleCVUpload);

router.post('/mejorar-texto', mejorarTexto);

module.exports = router;
