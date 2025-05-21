const multer = require('multer');

const storage = multer.memoryStorage(); // almacena la imagen en memoria
const upload = multer({ storage });

module.exports = upload;
