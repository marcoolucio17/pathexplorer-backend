const supabase = require("../config/supabaseClient");
const ApiError = require("../utils/errorHelper");

const fetchCompatibility = async (id_rol, idusuario) => {
  try {
    const { data: dataUserHab, error: errorUserHab } = await supabase
      .from("usuario_habilidad")
      .select("idhabilidad")
      .eq("idusuario", idusuario)
      .order("idhabilidad", { ascending: true });

    const { data: dataRolHab, error: errorRolHab } = await supabase
      .from("roles")
      .select(
        `requerimientos_roles(
                        requerimientos(
                            habilidades(idhabilidad)
                        )
                    )`
      )
      .eq("idrol", id_rol);

    if (errorUserHab) {
      throw new ApiError(
        errorUserHab.status || 400,
        errorUserHab.message || "There is an error fetching the compatibility."
      );
    }

    const compability = doCalculateCompatibility(dataUserHab, dataRolHab);

    return compability;
  } catch (error) {
    console.log("error", error);
    throw new ApiError(
      error.status || 400,
      error.message || "There is an error fetching the compatibility."
    );
  }
};

const doCalculateCompatibility = (UserHab, RolHab) => {
  try {
    const userSkills = new Set(
      UserHab.map((habilidad) => habilidad.idhabilidad)
    );

    if (RolHab[0].requerimientos_roles.length === 0) {
      return 0;
    }
    const rolSkills =
      RolHab?.[0]?.requerimientos_roles?.flatMap((rr) =>
        rr?.requerimientos?.habilidades?.idhabilidad
          ? [rr.requerimientos.habilidades.idhabilidad]
          : []
      ) || [];

    let compatibility = 0;
    if (rolSkills.length === 0) {
      return 0; // No skills required for the role
    }
    for (const skill of rolSkills) {
      if (userSkills.has(skill)) {
        compatibility++;
      }
    }

    const compabilityTotal =
      rolSkills.length > 0
        ? Math.round((compatibility / rolSkills.length) * 100)
        : 0;

    return compabilityTotal;
  } catch (error) {
    throw new ApiError(
      error.status || 400,
      error.message || "There is an error calculating the compatibility."
    );
  }
};
module.exports = { fetchCompatibility };
