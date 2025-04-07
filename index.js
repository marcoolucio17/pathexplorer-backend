const express = require("express");
const app = express();
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

app.use(express.json());

// cliente de superbase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

app.get("/", (req, res) => {
  res.send("Welcome to PathExplorer! Your backend is running.");
});

app.get("/usuarios", async (req, res) => {
  const { data, error } = await supabase.from("usuario").select("*");

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json(data);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
