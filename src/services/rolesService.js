const supabase = require("../config/supabaseClient");
const ApiError = require("../utils/errorHelper");
//Consulta para llamar la información de la tabla de roles

/**
 * @param "No se recibe ningun parametro"
 * @returns "Un array con la información de todos los roles - Incluye:
 *           ID de rol,
 *           Nombre de rol,
 *           Nivel de rol,
 *           Descripción de rol,
 *           Disponible (booleano),
 *           Por cada rol, un array de requerimientos (habilidades)- Incluye:
 *           ID de habilidad,
 *           Nombre de habilidad,
 *          Es técnica (booleano)
 */

const fetchRolesName = async () => {
  const { data, error } = await supabase
    .from("titulo")
    .select(`idtitulo,tnombre`);
  if (error) {
    console.log("error", error);
    throw new ApiError(
      error.status || 400,
      error.message || "There is an error fetching the roles."
    );
  }
  return data;
};

//Consulta para llamar la información de los roles filtrando por id de rol
/**
 * @param {int} id_rol - ID del rol a buscar
 * @returns "Un array con la información del rol - Incluye:
 *           ID de rol,
 *           Nombre de rol,
 *           Nivel de rol,
 *           Descripción de rol,
 *           Disponible (booleano)
 *           Por cada rol, un array de requerimientos (habilidades)- Incluye:
 *             ID de habilidad,
 *             Nombre de habilidad,
 *             Es técnica (booleano)"
 */

// Aquí afecta el rol
const fetchRoleById = async (id_rol) => {
  const { data, error } = await supabase
    .from("roles")
    .select(
      `
                idrol,
                nombrerol,
                nivelrol,
                descripcionrol,
                disponible,
                requerimientos_roles(
                    requerimientos(
                        idrequerimiento,
                        tiempoexperiencia,
                        habilidades(
                            idhabilidad,
                            nombre,
                            estecnica
                        )
                    )
                )`
    )
    .eq("idrol", id_rol);
  if (error) {
    console.log("error", error);
    throw new ApiError(
      error.status || 400,
      error.message || "There is an error fetching the roles."
    );
  }
  return data;
};

//Consulta para agregar un nuevo rol
/**
 * @param {json} rol - Objeto con la información del rol a agregar - Incluye:
 *          nombrerol,
 *          nivelrol,
 *          descripcionrol,
 *          disponible
 *          Por cada rol, un array de requerimientos (habilidades)- Incluye:
 *             ID de habilidad,
 *             Nombre de habilidad,
 *             Es técnica (booleano)
 * @returns "true" si se agregó correctamente el rol
 */
const addRole = async (rol) => {
  const { data, error } = await supabase.from("roles").insert(rol);
  if (error) {
    console.log("error", error);
    throw new ApiError(
      error.status || 400,
      error.message || "There is an error adding the role."
    );
  }
  return true;
};

//Consulta para actualizar un rol por id de rol
/**
 * @param {int} id_rol
 * @param {json} rol
 * @returns "true" si se actualizó correctamente el rol
 */
const updateRole = async (id_rol, rol) => {
  const { data, error } = await supabase
    .from("roles")
    .update(rol)
    .eq("idrol", id_rol);
  if (error) {
    console.log("error", error);
    throw new ApiError(
      error.status || 400,
      error.message || "There is an error updating the role."
    );
  }
  return true;
};

//Consulta para agregar un nuevo requerimiento a un rol
/**
 * @param {int} id_rol - ID del rol al que se le va a agregar el requerimiento
 * @param {json} requerimiento 
 *               //informacion: {
 *               //    rol: id_rol,
 *               //    requerimientos: [{
 *               //         idhabilidad,
 *               //         tiempoexperiencia,
 *              //    }, etc...]
 
 *               }
* 
 * @returns "true" si se agregó correctamente el requerimiento
 */

const addRequirement = async (idrol, requerimiento) => {
  const { data: resultReq0, error: resultError0 } = await supabase
    .from("requerimientos")
    .select("idrequerimiento")
    .eq("idhabilidad", requerimiento.idhabilidad)
    .eq("tiempoexperiencia", requerimiento.tiempoexperiencia);

  var id_requerimiento = resultReq0[0].idrequerimiento;

  const { data: dataRequerimiento, error: errorRequerimiento } = await supabase
    .from("requerimientos")
    .insert({
      idhabilidad: requerimiento.idhabilidad,
      tiempoexperiencia: requerimiento.tiempoexperiencia,
    });

  const { data: resultReq, error: resultError } = await supabase
    .from("requerimientos")
    .select("idrequerimiento")
    .eq("idhabilidad", requerimiento.idhabilidad)
    .eq("tiempoexperiencia", requerimiento.tiempoexperiencia);

  id_requerimiento = resultReq[0].idrequerimiento;

  const { data: resultReqRole, error: errorReqRole } = await supabase
    .from("requerimientos_roles")
    .insert({
      idrol: idrol,
      idrequerimiento: id_requerimiento,
    });

  if (errorReqRole) {
    console.log("error", errorReqRole);
    throw new ApiError(
      errorReqRole.status || 400,
      errorReqRole.message ||
        "There is an error adding the requirement to the role."
    );
  }
  return true;
};

//Funciona
const deleteRequirement = async (id_rol, id_requerimiento) => {
  const { data, error } = await supabase
    .from("requerimientos_roles")
    .delete()
    .eq("idrol", id_rol)
    .eq("idrequerimiento", id_requerimiento);

  if (error) {
    console.log("error", error);
    throw new ApiError(
      error.status || 400,
      error.message || "There is an error deleting the requirement."
    );
  }
  return true;
};

//Funciona
const deleteRoleProject = async (id_rol, id_proyecto, requerimientos) => {
  try {
    const { data, error } = await supabase
      .from("proyecto_roles")
      .delete()
      .eq("idrol", id_rol)
      .eq("idproyecto", id_proyecto);

    for (let i = 0; i < requerimientos.length; i++) {
      const { data: dataRequerimiento, error: errorRequerimiento } =
        await supabase
          .from("requerimientos_roles")
          .delete()
          .eq("idrol", id_rol)
          .eq("idrequerimiento", requerimientos[i].idrequerimiento);
      if (errorRequerimiento) {
        throw new ApiError(
          errorRequerimiento.status || 400,
          errorRequerimiento.message ||
            "There is an error deleting the requeriment of the role."
        );
      }
    }
    if (error) {
      throw new ApiError(
        error.status || 400,
        error.message || "There is an error deleting the role project."
      );
    }
  } catch (error) {
    throw new ApiError(
      error.status || 400,
      error.message || "There is an error deleting the role project."
    );
  }
  return true;
};

module.exports = {
  fetchRolesName,
  fetchRoleById,
  addRole,
  updateRole,
  addRequirement,
  deleteRequirement,
  deleteRoleProject,
};
