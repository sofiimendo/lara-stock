const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const {
  buscarUsuarioPorEmail,
  crearUsuario,
} = require("../models/users.model");

function registrarUsuario({
  nombre,
  email,
  password,
}) {
  const usuarioExistente =
    buscarUsuarioPorEmail(email);

  if (usuarioExistente) {
    const error = new Error(
      "Ya existe un usuario registrado con ese email"
    );

    error.statusCode = 409;

    throw error;
  }

  const passwordHasheada =
    bcrypt.hashSync(
      password,
      10
    );

  const nuevoUsuario = {
    id: uuidv4(),
    nombre,
    email: email.toLowerCase(),
    password: passwordHasheada,
    createdAt:
      new Date().toISOString(),
  };

  crearUsuario(
    nuevoUsuario
  );

  return {
    id: nuevoUsuario.id,
    nombre: nuevoUsuario.nombre,
    email: nuevoUsuario.email,
    createdAt: nuevoUsuario.createdAt,
  };
}

function iniciarSesion({
  email,
  password,
}) {
  const usuario =
    buscarUsuarioPorEmail(email);

  if (!usuario) {
    const error = new Error(
      "Email o contraseña incorrectos"
    );

    error.statusCode = 401;

    throw error;
  }

  const passwordCorrecta =
    bcrypt.compareSync(
      password,
      usuario.password
    );

  if (!passwordCorrecta) {
    const error = new Error(
      "Email o contraseña incorrectos"
    );

    error.statusCode = 401;

    throw error;
  }

  if (!process.env.JWT_SECRET) {
    const error = new Error(
      "JWT_SECRET no está configurado"
    );

    error.statusCode = 500;

    throw error;
  }

  const token =
    jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );

  return {
    token,
    usuario: {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
    },
  };
}

function obtenerPerfilPorEmail(email) {
  const usuario =
    buscarUsuarioPorEmail(email);

  if (!usuario) {
    const error = new Error(
      "Usuario no encontrado"
    );

    error.statusCode = 404;

    throw error;
  }

  return {
    id: usuario.id,
    nombre: usuario.nombre,
    email: usuario.email,
    createdAt: usuario.createdAt,
  };
}

module.exports = {
  registrarUsuario,
  iniciarSesion,
  obtenerPerfilPorEmail,
};