const supabase = require('../config/supabaseClient');

const fetchUsers = async () => {
  const { data, error } = await supabase.from("usuario").select("*");
  if (error) throw error;
  return data;
};

const fetchUserById = async (req, res) => {
    const { id } = req.params;
}



module.exports = { fetchUsers };
