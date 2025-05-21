const { obtenerFeedbackPorUsuario } = require('../services/feedbackService');

const getFeedbackIfManager = async (req, res) => {
  try {
    const { authz } = req.user;

    if (authz !== 'Manager') {
      return res.status(403).json({ error: 'Solo los managers pueden acceder al feedback.' });
    }

    const { idUsuarioObjetivo } = req.params;

    const feedbacks = await obtenerFeedbackPorUsuario(idUsuarioObjetivo);

    return res.status(200).json({ feedbacks });
  } catch (error) {
    console.error('Error en getFeedbackIfManager:', error.message);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getFeedbackIfManager,
};
