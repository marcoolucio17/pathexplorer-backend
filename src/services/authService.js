const supabase = require("../config/supabaseClient");
const { use } = require("../routes/userRoutes");
const ApiError = require("../utils/errorHelper");
const { encryptPayload, decryptToken } = require("../utils/token");

/**
 * Method that authenticates a user in Supabase and returns their
 * access token.
 * @param {string} providerid
 * @param {string} password
 * @returns User access token
 */
const authenticateWithEmailAndPassword = async (providerid, password) => {
  const email = providerid + "@accenture.com";

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.log("error", error);
    throw new ApiError(error.status || 400, error.message || "Invalid login credentials.");
  }

  // una vez que sepamos que está verificado, lo buscamos en la tabla usuarios
  const { data: supadata, error: supaerror } = await supabase
    .from("usuario")
    .select("*")
    .eq("correoelectronico", email);

  if (supaerror) {
    throw new ApiError(supaerror.status || 400, supaerror.message);
  }

  const payload = {
    user: supadata[0], // supabase regresa una lista cuando debe de ser solo un elemento. no debería de haber correos/providerid duplicados
    exp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    authz: supadata[0]?.tipo, // esta llave es el rol, para más fácil acceso
  };

  // token will be the payload but encrypted
  payload["token"] = encryptPayload(payload);

  return payload;
};

/**
 * Method that signs up a user into Supabase and adds it into the db.
 * Also, returns the user access token for proper sign-in.
 * @param {Object} payload
 * @returns User access token
 */
const signUpWithEmailAndPassword = async ({
  name,
  lastname,
  providerid,
  role,
  level,
  password,
}) => {
  const { data, error } = await supabase.auth.signUp({
    email: providerid + "@accenture.com",
    password: password,
  });

  if (error) {
    throw new ApiError(error.status || 400, error.message);
  }

  const { userdata, usererror } = await supabase.from("usuario").insert({
    employeeeid: providerid,
    tipo: role,
    fechaingreso: new Date().toISOString().split("T")[0],
    porcentajestaff: 0,
    estaenproyecto: false,
    nombre: name + lastname,
    nivelusuario: level,
    correoelectronico: providerid + "@accenture.com",
    // cv: "holi", todavía veré como enviar esto
  });

  // todo : en caso de que este paso falle, también se debe de borrar de supabase auth
  if (usererror) {
    throw new ApiError(error.status || error.message);
  }

  // una vez que se haya completado exitosamente el registro, hacemos sign-in
  const encryptedUserData = authenticateWithEmailAndPassword(
    providerid,
    password
  );

  return encryptedUserData;
};

module.exports = {
  authenticateWithEmailAndPassword,
  signUpWithEmailAndPassword,
};
