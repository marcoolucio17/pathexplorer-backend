const supabase = require('../config/supabaseClient');
const ApiError = require('../utils/errorHelper');

const fetchCompatibility = async (id_rol,idusuario) => { 
    try {
        const { data: dataUserHab, error: errorUserHab } = await supabase
            .from("usuario_habilidad")
            .select('idhabilidad')
            .eq('idusuario', idusuario)
            .order('idhabilidad', { ascending: true });   
        
        const { data: dataRolHab, error: errorRolHab } = await supabase
            .from("roles")
            .select(`requerimientos_roles(
                        requerimientos(
                            habilidades(idhabilidad)
                        )
                    )`)
            .eq('idrol', id_rol);

        if (errorUserHab) { 
            console.log("error", errorUserHab);
            throw new ApiError(errorUserHab.status || 400, errorUserHab.message || "There is an error fetching the compatibility.");
        }
        const compability = doCalculateCompatibility(dataUserHab, dataRolHab);
        return compability;
    } catch (error) {
        console.log("error", error);
        throw new ApiError(error.status || 400, error.message || "There is an error fetching the compatibility.");
    }
}


const doCalculateCompatibility = (UserHab, RolHab) => { 
    try { 
        const userSkills = new Set(UserHab.map(habilidad => habilidad.idhabilidad));

        const rolSkills = RolHab[0].requerimientos_roles.map(rr => rr.requerimientos.habilidades.idhabilidad);

        let compatibility = 0;

        for (const skill of rolSkills) {
            if (userSkills.has(skill)) {
                compatibility++;
            }
        }
        console.log(compatibility, rolSkills.length);
        const compabilityTotal = rolSkills.length > 0
            ? Math.round((compatibility / rolSkills.length) * 100)
            : 0;

        return compabilityTotal
    } catch (error) {
        console.log("error", error);
        throw new ApiError(error.status || 400, error.message || "There is an error calculating the compatibility.");
    }

}
module.exports = { fetchCompatibility };