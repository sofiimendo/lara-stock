const express = require("express");

const {
  register,
  login,
  profile,
} = require("../controllers/users.controller");

const {
  validarToken,
} = require("../middlewares/auth.middleware");

const {
  registerSchema,
  loginSchema,
} = require("../schemas/users.schema");

const validate = require(
  "../middlewares/validate.middleware"
);

const router = express.Router();

// ===============================
// REGISTRO
// ===============================

router.post(
  "/register",
  validate(registerSchema),
  register
);

// ===============================
// LOGIN
// ===============================

router.post(
  "/login",
  validate(loginSchema),
  login
);

// ===============================
// PERFIL PROTEGIDO
// ===============================

router.get(
  "/profile",
  validarToken,
  profile
);

module.exports = router;