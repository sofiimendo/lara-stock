const fs = require("fs");
const path = require("path");

const USERS_FILE = path.join(
  __dirname,
  "../data/users.json"
);

function leerUsuarios() {
  try {
    const contenido = fs.readFileSync(
      USERS_FILE,
      "utf-8"
    );

    return JSON.parse(contenido);
  } catch (error) {
    console.error(
      "Error al leer usuarios:",
      error
    );

    return [];
  }
}

function guardarUsuarios(usuarios) {
  fs.writeFileSync(
    USERS_FILE,
    JSON.stringify(
      usuarios,
      null,
      2
    )
  );
}

function obtenerUsuarios() {
  return leerUsuarios();
}

function buscarUsuarioPorEmail(email) {
  const usuarios =
    leerUsuarios();

  return usuarios.find(
    (usuario) =>
      usuario.email.toLowerCase() ===
      email.toLowerCase()
  );
}

function crearUsuario(usuario) {
  const usuarios =
    leerUsuarios();

  usuarios.push(usuario);

  guardarUsuarios(
    usuarios
  );

  return usuario;
}

module.exports = {
  obtenerUsuarios,
  buscarUsuarioPorEmail,
  crearUsuario,
};