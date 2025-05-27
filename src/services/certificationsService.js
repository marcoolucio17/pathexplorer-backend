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
    console.error('Error al insertar certificación:', error.message);
    throw error;
  }

  return data;
};

//update
const updateCertificate = async (idCertificacion, updates) => {
  const { data, error } = await supabase
    .from('certificaciones')
    .update({
      cnombre: updates.cnombre,
      idhabilidad: updates.idhabilidad || null,
      fechaobtenido: updates.fechaobtenido,
      fechaexpiracion: updates.fechaexpiracion,
      emitidopor: updates.emitidopor,
      imagencertificado: updates.imagencertificado
    })
    .eq('idcertificaciones', idCertificacion)
    .select()
    .single();

  if (error) {
    console.error('Error al actualizar certificación:', error.message);
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
    console.error('Error al asignar certificado al usuario:', error.message);
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
    console.error('Error al obtener certificaciones del empleado:', error.message);
    throw error;
  }

  return data;
};

const uploadCertificateToStorage = async (certId, file) => {
  const filePath = `cert-${Date.now()}-${file.originalname}`;

  const { data, error } = await supabase.storage
    .from('certificaciones')
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });

  if (error) throw new Error(`Error al subir a Supabase: ${JSON.stringify(error)}`);


  const { error: updateError } = await supabase
    .from('certificaciones')
    .update({ imagencertificado: filePath })
    .eq('idcertificaciones', certId);

  if (updateError) throw new Error(`Error al actualizar la tabla: ${JSON.stringify(updateError)}`);

  return { message: 'Imagen del certificado subida correctamente', path: filePath };
};

const generateCertificateSignedUrl = async (certId) => {
  const { data: cert, error } = await supabase
    .from('certificaciones')
    .select('imagencertificado')
    .eq('idcertificaciones', certId)
    .single();

  if (error || !cert?.imagencertificado) return null;

  const { data: urlData, error: urlError } = await supabase.storage
    .from('certificaciones')
    .createSignedUrl(cert.imagencertificado, 60 * 60); // 1 hora

  if (urlError) throw urlError;

  return { url: urlData.signedUrl };
};

module.exports = {
  createCertificate,
  assignCertificateToEmployee,
  getCertificatesByEmployeeId,
  uploadCertificateToStorage,
  generateCertificateSignedUrl,
  updateCertificate
};
