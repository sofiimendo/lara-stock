const {
  registrarUsuario,
  iniciarSesion,
  obtenerPerfilPorEmail,
} = require("../services/users.service");

function register(req, res) {
  try {
    const usuario = registrarUsuario(req.body);

    return res.status(201).json({
      mensaje: "Usuario registrado correctamente",
      usuario,
    });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({
        mensaje:
          error.message ||
          "No se pudo registrar el usuario",
      });
  }
}

function login(req, res) {
  try {
    const resultado = iniciarSesion(req.body);

    return res.status(200).json({
      mensaje: "Inicio de sesión correcto",
      ...resultado,
    });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({
        mensaje:
          error.message ||
          "No se pudo iniciar sesión",
      });
  }
}

function profile(req, res) {
  try {
    const usuario = obtenerPerfilPorEmail(
      req.usuario.email
    );

    return res.status(200).json({
      usuario,
    });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({
        mensaje:
          error.message ||
          "No se pudo obtener el perfil",
      });
  }
}

module.exports = {
  register,
  login,
  profile,
};