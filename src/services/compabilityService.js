const supabase = require("../config/supabaseClient");
const ApiError = require("../utils/errorHelper");

const fetchCompatibility = (dataRolHab, dataUserHab) => {
  try {
    const compability = doCalculateCompatibility(dataUserHab, dataRolHab);

    return compability;
  } catch (error) {
    console.error("Error in fetchCompatibility:", error);
  }
};

const doCalculateCompatibility = (UserHab, RolHab) => {
  try {
    let compatibility = 0;
    if (RolHab.length === 0) {
      return 0; // No skills required for the role
    }
    for (const skill of RolHab) {
      if (UserHab.has(skill)) {
        compatibility++;
      }
    }

    const compabilityTotal =
      RolHab.length > 0 ? Math.round((compatibility / RolHab.length) * 100) : 0;

    return compabilityTotal;
  } catch (error) {
    throw new ApiError(
      error.status || 400,
      error.message || "There is an error calculating the compatibility."
    );
  }
};
module.exports = { fetchCompatibility };
