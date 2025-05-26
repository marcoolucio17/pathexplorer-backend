const supabase = require('../config/supabaseClient');

const getUserById = async (id) => {

  const ret = {};

  const { data, error } = await supabase
    .from('usuario')
    .select('*')
    .eq('idusuario', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  ret["user"] = data;
  ret["user"]["puesto"] = "Staff";

  // buscamos sus habilidades

  const { data: skills, error: skillsError } = await supabase
    .from('usuario_habilidad')
    .select('idhabilidad, habilidades(*)')
    .eq('idusuario', id);

  if (skillsError) {
    throw new Error(skillsError.message);
  }

  ret["skills"] = skills;

  // buscamos sus metas
  const { data: metas, error: metasError } = await supabase
    .from('metas')
    .select('*')
    .eq('idusuario', id);

  if (metasError) {
    throw new Error(metasError.message);
  }

  ret["metas"] = metas;

  // buscamos sus proyectos
  const { data: proyectos, error: proyectosError } = await supabase
    .from('utp')
    .select('*')
    .eq('idusuario', id);

  if (proyectosError) {
    throw new Error(proyectosError.message);
  }

  // utilizando idaplicacion, encontramos el idrol en la tabla aplicaciones y buscamos dicho rol por cada proyecto que haya

  for (const proyecto of proyectos) {
    if (proyecto.idaplicacion) {
      const { data: aplicacion, error: aplicacionError } = await supabase
        .from('aplicacion')
        .select('idrol')
        .eq('idaplicacion', proyecto.idaplicacion)
        .single();

      if (aplicacionError) {
        throw new Error(aplicacionError.message);
      }

      if (aplicacion && aplicacion.idrol) {
        // Buscar el rol en la tabla roles
        const { data: rol, error: rolError } = await supabase
          .from('roles')
          .select('*')
          .eq('idrol', aplicacion.idrol)
          .single();

        if (rolError) {
          throw new Error(rolError.message);
        }

        proyecto.rol = rol;
      } else {
        proyecto.rol = null;
      }
    } else {
      proyecto.rol = null;
    }
  }

  ret["proyectos"] = proyectos;

  // ahora hacemos fetch de sus certs
  const { data: certificados, error: certificadosError } = await supabase
    .from('usuario_certificado')
    .select('certificaciones(*)')
    .eq('idusuario', id);

  if (certificadosError) {
    throw new Error(certificadosError.message);
  }
  ret["certificados"] = certificados;
  return ret;
};

const uploadFotoPerfil = async (id, fotoFile) => {
  if (!fotoFile) throw new Error('Archivo de imagen no proporcionado');

  const { data, error } = await supabase.storage
    .from('fotos-perfil')
    .upload(`foto-${id}-${Date.now()}.jpg`, Buffer.from(fotoFile, 'base64'), {
      contentType: 'image/jpeg',
      upsert: true
    });

  if (error) throw new Error('Error al subir imagen: ' + error.message);

  const { error: updateError } = await supabase
    .from('usuario')
    .update({ fotodeperfil: data.path })
    .eq('idusuario', id);

  if (updateError) throw new Error(updateError.message);

  return { fotodeperfil: data.path };
};

const uploadCV = async (id, cvFile) => {
  if (!cvFile) throw new Error('Archivo de CV no proporcionado');

  const { data, error } = await supabase.storage
    .from('cvs')
    .upload(`cv-${id}-${Date.now()}.pdf`, Buffer.from(cvFile, 'base64'), {
      contentType: 'application/pdf',
      upsert: true
    });

  if (error) throw new Error('Error al subir CV: ' + error.message);

  const { error: updateError } = await supabase
    .from('usuario')
    .update({ cv: data.path })
    .eq('idusuario', id);

  if (updateError) throw new Error(updateError.message);

  return { cv: data.path };
};

module.exports = {
  getUserById,
  uploadFotoPerfil,
  uploadCV
};
