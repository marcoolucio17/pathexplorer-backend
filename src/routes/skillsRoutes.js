const express = require('express');
const {
  getHabilidadesPorTipo,
  assignSkill,
  getTodasHabilidades,
  getTopSkills,
  getUserSkillsNames,
} = require("../controllers/skillsController");
const authMiddleware = require("../middlewares/verifyHashToken");
const router = express.Router();

router.get("/por-tipo", authMiddleware, getHabilidadesPorTipo);

router.post("/asignar", authMiddleware, assignSkill);

router.get("", authMiddleware, getTodasHabilidades);

router.get("/top/:count", authMiddleware, getTopSkills);

router.get("/usuario/:idusuario", authMiddleware, getUserSkillsNames);

module.exports = router;
