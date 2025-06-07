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
      const fileExt = req.file.originalname.split('.').pop();
      const filePath = `certificados/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('certificados')
        .upload(filePath, req.file.buffer, {
          contentType: req.file.mimetype
        });

      if (uploadError) {
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
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// PUT /api/certificados/:id
const updateCertificateController = async (req, res) => {
  try {
    const idCertificacion = parseInt(req.params.id);
    const updates = req.body;

    if (!idCertificacion || isNaN(idCertificacion)) {
      return res.status(400).json({ error: 'ID de certificación inválido.' });
    }

    const updated = await updateCertificate(idCertificacion, updates);
    res.json(updated);
  } catch (error) {
    console.error('Error en el controlador al actualizar certificación:', error.message);
    res.status(500).json({ error: 'Error al actualizar certificación' });
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
  const { id } = req.params;

  try {
    const certificates = await certificationsService.getCertificatesByEmployeeId(id);
    res.status(200).json(certificates);
  } catch (error) {
    console.error('Error al obtener certificaciones del empleado:', error.message);
    res.status(500).json({ error: 'Error al obtener certificaciones del empleado' });
  }
};


const uploadCertificateImage = async (req, res) => {
  try {
    const file = req.file;
    const certId = req.params.id;

    if (!file) {
      console.error("No se recibió archivo");
      return res.status(400).json({ error: 'Archivo no recibido' });
    }

    console.log("Archivo recibido:", file);

    const result = await certificationsService.uploadCertificateToStorage(certId, file);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error al subir la imagen del certificado:', error);
    res.status(500).json({ error: 'Error al subir la imagen del certificado' });
  }
};


const getCertificateImageSignedUrl = async (req, res) => {
  try {
    const certId = req.params.id;
    const result = await certificationsService.generateCertificateSignedUrl(certId);
    if (!result) return res.status(404).json({ error: 'Imagen no encontrada para esta certificación' });
    res.status(200).json(result);
  } catch (error) {
    console.error('Error al obtener URL firmada del certificado:', error);
    res.status(500).json({ error: 'Error al generar la URL del certificado' });
  }
};


const removeCertification = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await certificationsService.deleteCertificationById(id);
    if (!result) {
      return res.status(404).json({ message: 'Certificación no encontrada' });
    }

    res.status(200).json({ message: 'Certificación eliminada con éxito', result });
  } catch (error) {
    console.error('Error al eliminar certificación:', error.message);
    res.status(500).json({ message: 'Error al eliminar la certificación', error: error.message });
  }
};



module.exports = {
  createCertificate,
  assignCertificateToEmployee,
  getCertificatesByEmployeeId,
  uploadCertificateImage,
  getCertificateImageSignedUrl,
  updateCertificateController,
  removeCertification  
};
