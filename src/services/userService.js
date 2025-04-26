const supabase = require("../config/supabaseClient");
const { use } = require("../routes/userRoutes");
const ApiError = require('../utils/errorHelper');

const fetchUsers = async () => {
  const { data, error } = await supabase.from("usuario").select("*");
  if (error) throw error;
  return data;
};

const fetchUserById = async (req, res) => {
  const { id } = req.params;
};

const authenticateWithEmailAndPassword = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new ApiError(error.status || 400, error.message);
  }

  return {
    user: data.user,
    status: 'approved',
    token: 'mockToken-1234', 
  };
};

const signUpWithEmailAndPassword = async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  if (error) {
    throw new ApiError(error.status || 400, error.message);
  }

  const { userdata, usererror } = await supabase.from("usuario").insert({
    employeeeid: "A" + Date.now() + "CC",
    tipo: "manager",
    fechaingreso: new Date().toISOString().split("T")[0],
    porcentajestaff: 30,
    estaenproyecto: true,
    nombre: "perenganito",
    nivelusuario: 10,
    correoelectronico: email,
    cv: "holi",
  });

  if (usererror) {
    throw new ApiError(error.status || error.message);
  }

  return userdata;
};

module.exports = {
  fetchUsers,
  authenticateWithEmailAndPassword,
  signUpWithEmailAndPassword,
};
