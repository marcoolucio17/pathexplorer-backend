const { obtenerFeedbackPorUsuario, 
  crearFeedback,
  crearRelacionUTPFeedback 
} = require('../services/feedbackService');

const getFeedbackIfManager = async (req, res) => {
  try {
    const { idUsuarioObjetivo } = req.params;
    const feedbacks = await obtenerFeedbackPorUsuario(idUsuarioObjetivo);

    return res.status(200).json({ feedbacks });
  } catch (error) {
    console.error('Error en getFeedbackIfManager:', error.message);
    return res.status(500).json({ error: error.message });
  }
};

const supabase = require('../config/supabaseClient');

const asignarFeedback = async (req, res) => {
  try {
    const { idusuario, idproyecto, feedback, rating } = req.body;

    if (!idusuario || !idproyecto || !feedback || rating == null) {
      return res.status(400).json({ error: 'Datos incompletos para asignar feedback' });
    }

    // Obtener IDUTP desde la tabla UTP
    const { data: utpData, error: utpError } = await supabase
      .from('utp')
      .select('idutp')
      .eq('idusuario', idusuario)
      .eq('idproyecto', idproyecto)
      .single();

    if (utpError || !utpData) {
      return res.status(404).json({ error: 'No se encontró relación UTP para ese usuario y proyecto' });
    }

    const idutp = utpData.idutp;

    // Insertar el feedback
    const feedbackInsertado = await crearFeedback({
      idusuario,
      idproyecto,
      idutp,
      feedback,
      rating
    });

    await crearRelacionUTPFeedback(idutp, feedbackInsertado.idfeedback);

    res.status(201).json({
      message: 'Feedback asignado correctamente',
      feedback: feedbackInsertado
    });
  } catch (error) {
    console.error('Error al asignar feedback:', error.message);
    res.status(500).json({ error: 'Error al asignar feedback' });
  }
};

module.exports = {
  getFeedbackIfManager,
  asignarFeedback
};
