const supabase = require('../config/supabaseClient');

// Crear una certificación
const createCertificate = async (cnombre, idhabilidad, fechaobtenido, fechaexpiracion, emitidopor, imagenUrl) => {
  const { data, error } = await supabase
    .from('certificaciones')
    .insert([{
      cnombre,
      idhabilidad: idhabilidad || null,
      fechaobtenido,
      fechaexpiracion,
      emitidopor,
      imagencertificado: imagenUrl
    }])
    .select()
    .single();

  if (error) {
    console.error('❌ Error al insertar certificación:', error.message);
    throw error;
  }

  return data;
};

// Asignar certificado a un usuario
const assignCertificateToEmployee = async (idusuario, idcertificaciones) => {
  const { data, error } = await supabase
    .from('usuario_certificado')
    .insert([{ idusuario, idcertificaciones }])
    .select()
    .single();

  if (error) {
    console.error('❌ Error al asignar certificado al usuario:', error.message);
    throw error;
  }

  return data;
};

// Obtener certificados por ID de empleado
const getCertificatesByEmployeeId = async (idempleado) => {
  const { data, error } = await supabase
    .from('usuario_certificado')
    .select(`
      *,
      certificaciones (
        *,
        habilidades (
          nombre,
          estecnica
        )
      )
    `)
    .eq('idusuario', idempleado);

  if (error) {
    console.error('❌ Error al obtener certificaciones del empleado:', error.message);
    throw error;
  }

  return data;
};

module.exports = {
  createCertificate,
  assignCertificateToEmployee,
  getCertificatesByEmployeeId
};
