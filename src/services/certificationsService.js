// services/certificationsService.js

const supabase = require('../config/supabaseClient');  // O la forma en que estés conectando a tu base de datos

// Crear un nuevo certificado
const createCertificate = async (CNombre, Skill, CTecnica, FechaObtenido, FechaExpiracion, EmitidoPor, ImagenCertificado) => {
    const { data, error } = await supabase
        .from('Certificaciones')
        .insert([{ CNombre, Skill, CTecnica, FechaObtenido, FechaExpiracion, EmitidoPor, ImagenCertificado }]);

    if (error) throw error;
    return data[0];
};

// Asignar un certificado a un empleado
const assignCertificateToEmployee = async (IDUsuario, IdCertificaciones) => {
    const { data, error } = await supabase
        .from('Usuario_Certificado')
        .insert([{ IDUsuario, IdCertificaciones }]);

    if (error) throw error;
    return data[0];
};

// Obtener las certificaciones de un empleado
const getCertificatesByEmployeeId = async (IDEmpleado) => {
    const { data, error } = await supabase
        .from('Usuario_Certificado')
        .select('CNombre, Skill, CTecnica, FechaObtenido, FechaExpiracion, EmitidoPor, ImagenCertificado')
        .join('Certificaciones', 'Certificaciones.IdCertificaciones', 'Usuario_Certificado.IdCertificaciones')
        .eq('IDUsuario', IDEmpleado);

    if (error) throw error;
    return data;
};

module.exports = {
    createCertificate,
    assignCertificateToEmployee,
    getCertificatesByEmployeeId
};
