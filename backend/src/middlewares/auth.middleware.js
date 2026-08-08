const jwt = require("jsonwebtoken");

function validarToken(req, res, next) {
  const authorization =
    req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({
      mensaje: "Token de autenticación requerido",
    });
  }

  const partes =
    authorization.split(" ");

  const esquema =
    partes[0];

  const token =
    partes[1];

  if (
    esquema !== "Bearer" ||
    !token
  ) {
    return res.status(401).json({
      mensaje:
        "Formato de token inválido. Usá Bearer <token>",
    });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({
      mensaje:
        "JWT_SECRET no está configurado",
    });
  }

  try {
    const datosToken =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    req.usuario =
      datosToken;

    next();
  } catch (error) {
    return res.status(401).json({
      mensaje:
        "Token inválido o vencido",
    });
  }
}

module.exports = {
  validarToken,
};