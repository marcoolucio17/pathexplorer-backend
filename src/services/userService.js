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

const uploadCVToStorage = async (userId, file) => {
  const filePath = `cv-${Date.now()}-${file.originalname}`;
  const { data, error } = await supabase.storage
    .from('cvs')
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });

  if (error) throw error;

  const { error: updateError } = await supabase
    .from('usuario')
    .update({ cv: filePath })
    .eq('idusuario', userId);

  if (updateError) throw updateError;

  return { message: 'CV subido correctamente', path: filePath };
};

const uploadProfileToStorage = async (userId, file) => {
  const filePath = `foto-${Date.now()}-${file.originalname}`;
  const { data, error } = await supabase.storage
    .from('fotos-perfil')
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });

  if (error) throw error;

  const { error: updateError } = await supabase
    .from('usuario')
    .update({ fotodeperfil: filePath })
    .eq('idusuario', userId);

  if (updateError) throw updateError;

  return { message: 'Foto de perfil subida correctamente', path: filePath };
};

const generateCVSignedUrl = async (userId) => {
  const { data: user, error } = await supabase
    .from('usuario')
    .select('cv')
    .eq('idusuario', userId)
    .single();

  if (error || !user?.cv) return null;

  const { data: urlData, error: urlError } = await supabase.storage
    .from('cvs')
    .createSignedUrl(user.cv, 60 * 60); // 1 hora

  if (urlError) throw urlError;

  return { url: urlData.signedUrl };
};

const generateProfileSignedUrl = async (userId) => {
  const { data: user, error } = await supabase
    .from('usuario')
    .select('fotodeperfil')
    .eq('idusuario', userId)
    .single();

  if (error || !user?.fotodeperfil) return null;

  const { data: urlData, error: urlError } = await supabase.storage
    .from('fotos-perfil')
    .createSignedUrl(user.fotodeperfil, 60 * 60); // 1 hora

  if (urlError) throw urlError;

  return { url: urlData.signedUrl };
};

const updateUsuarioParcial = async (id, campos) => {
  const { data, error } = await supabase
    .from('usuario')
    .update(campos)
    .eq('idusuario', id)
    .select()
    .single();

  if (error) throw error;

  return data;
};


module.exports = {
  getUserById,
  uploadCVToStorage,
  uploadProfileToStorage,
  generateCVSignedUrl,
  generateProfileSignedUrl,
  updateUsuarioParcial
};
