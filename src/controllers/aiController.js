const { extractCVDataWithGemini } = require('../services/aiService');
const { guardarDatosCVExtraidos } = require('../services/aiService'); // Ajusta la ruta si es necesario
const { uploadCVToStorage } = require('../services/userService'); // asegúrate de que esté exportado ahí

const handleCVUpload = async (req, res) => {
  try {
    console.log("req.body:", req.body);
    
    // Verifica que haya archivo y que haya sido subido correctamente
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: 'Archivo no proporcionado o vacío' });
    }

    const { idusuario } = req.body;

    // Verifica que venga el idusuario en el form-data
    if (!idusuario) {
      return res.status(400).json({ error: 'No se pudo identificar al usuario' });
    }

    await uploadCVToStorage(idusuario, req.file);

    const fileBuffer = req.file.buffer;


    // Llama a Gemini para analizar el CV
    const analysis = await extractCVDataWithGemini(fileBuffer);

    // Guarda habilidades y certificaciones del CV al usuario
    const resultadoGuardado = await guardarDatosCVExtraidos(idusuario, analysis);

    return res.status(200).json({
      message: 'CV analizado y datos guardados correctamente',
      analysis,
      resultadoGuardado
    });

  } catch (error) {
    console.error('Error al analizar el CV:', error);
    res.status(500).json({
      message: 'Error al analizar el CV',
      error: error.message || error,
      raw: error.raw || null
    });
  }
};

module.exports = { handleCVUpload };
