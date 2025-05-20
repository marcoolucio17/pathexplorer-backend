const certificationsService = require('../services/certificationsService');

const createCertificate = async (req, res) => {
  try {
    const {
      cnombre,
      idhabilidad,
      fechaobtenido,
      fechaexpiracion,
      emitidopor,
      imagencertificado
    } = req.body;

    let imagenUrl = null;

    if (req.file) {
      console.log('📂 Archivo recibido:', req.file);

      const fileExt = req.file.originalname.split('.').pop();
      const filePath = `certificados/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('certificados')
        .upload(filePath, req.file.buffer, {
          contentType: req.file.mimetype
        });

      if (uploadError) {
        console.error('❌ Error al subir imagen:', uploadError.message);
        return res.status(500).json({ error: 'Error al subir imagen' });
      }

      const { data: publicUrlData } = supabase.storage
        .from('certificados')
        .getPublicUrl(filePath);

      imagenUrl = publicUrlData.publicUrl;
    } else if (imagencertificado) {
      imagenUrl = imagencertificado;
    }

    const cert = await certificationsService.createCertificate(
      cnombre,
      idhabilidad ? parseInt(idhabilidad) : null,
      fechaobtenido,
      fechaexpiracion,
      emitidopor,
      imagenUrl
    );

    res.status(201).json({ message: 'Certificación registrada correctamente', cert });
  } catch (error) {
    console.error('❌ Error al crear certificación:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const assignCertificateToEmployee = async (req, res) => {
  const { idusuario, idcertificaciones } = req.body;
  try {
    const assignment = await certificationsService.assignCertificateToEmployee(idusuario, idcertificaciones);
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: "Error al asignar el certificado al empleado", error: error.message });
  }
};

const getCertificatesByEmployeeId = async (req, res) => {
  const { idempleado } = req.params;
  try {
    const certificates = await certificationsService.getCertificatesByEmployeeId(idempleado);
    res.status(200).json(certificates);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las certificaciones", error: error.message });
  }
};

module.exports = {
  createCertificate,
  assignCertificateToEmployee,
  getCertificatesByEmployeeId
};
