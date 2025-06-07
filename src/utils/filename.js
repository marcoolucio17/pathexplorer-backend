const slugify = (str) =>
  str
    .normalize("NFD")                 // quita tildes → Diseño → Diseño
    .replace(/[\u0300-\u036f]/g, "")  // borra restos diacríticos
    .replace(/\s+/g, "-")             // espacios → guiones
    .replace(/[^a-zA-Z0-9_.-]/g, "")  // sólo ASCII seguro
    .toLowerCase();

module.exports = { slugify };
