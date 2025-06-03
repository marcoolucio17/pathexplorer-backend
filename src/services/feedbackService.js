const supabase = require('../config/supabaseClient');

/**
 * Consulta los feedbacks de un usuario específico por su ID.
 * Solo se trae el campo "feedback" (texto).
 *
 * @param {number} idUsuarioObjetivo - ID del usuario del que se quiere consultar el feedback.
 * @returns {Promise<Array>} - Lista de feedbacks.
 */
const obtenerFeedbackPorUsuario = async (idUsuarioObjetivo) => {
  const { data, error } = await supabase
    .from('feedback')          // tabla debe estar en minúsculas
    .select('feedback, rating, fecha')        // solo queremos la columna de texto
    .eq('idusuario', idUsuarioObjetivo); // filtra por el ID del usuario objetivo

  if (error) {
    throw new Error(`Error al consultar feedback: ${error.message}`);
  }

  return data;
};

const crearFeedback = async ({ idusuario, idproyecto, idutp, feedback, rating }) => {
  const { data, error } = await supabase
    .from('feedback')
    .insert([{
      idusuario,
      idproyecto,
      idutp,
      feedback,
      rating
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

const crearRelacionUTPFeedback = async (idutp, idfeedback) => {
  const { data, error } = await supabase
    .from('utp_feedback')
    .insert([{ idutp, idfeedback }]);

  if (error) throw error;
  return data;
};


module.exports = {
  obtenerFeedbackPorUsuario,
  crearFeedback,
  crearRelacionUTPFeedback
};
