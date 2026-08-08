const API_URL = "http://localhost:4000/api/items";
const SUMMARY_URL = `${API_URL}/resumen`;
const MOVEMENTS_URL = "http://localhost:4000/api/movements";

let insumos = [];
let movimientos = [];

let temporizadorBusqueda;
let toastTimer;
let idPendienteDeEliminacion = null;

// ===============================
// INSUMOS
// ===============================

const listaInsumos = document.querySelector("#lista-insumos");
const mensajeVacio = document.querySelector("#mensaje-vacio");

const buscador = document.querySelector("#buscador");
const filtroCategoria = document.querySelector("#filtro-categoria");

// ===============================
// NAVEGACIÓN
// ===============================

const botonInicio = document.querySelector("#nav-inicio");
const botonInsumos = document.querySelector("#nav-insumos");
const botonMovimientos = document.querySelector("#nav-movimientos");

const seccionInsumos = document.querySelector("#seccion-insumos");
const seccionMovimientos = document.querySelector("#seccion-movimientos");

// ===============================
// TARJETAS
// ===============================

const cardTotal = document.querySelector("#card-total");
const cardStockBajo = document.querySelector("#card-stock-bajo");
const cardSinStock = document.querySelector("#card-sin-stock");

const totalInsumos = document.querySelector("#total-insumos");
const totalStockBajo = document.querySelector("#total-stock-bajo");
const totalSinStock = document.querySelector("#total-sin-stock");

// ===============================
// HISTORIAL DE MOVIMIENTOS
// ===============================

const listaMovimientos = document.querySelector("#lista-movimientos");

const mensajeMovimientosVacio = document.querySelector(
  "#mensaje-movimientos-vacio"
);

const filtroTipoMovimiento = document.querySelector(
  "#filtro-tipo-movimiento"
);

// ===============================
// MODAL AGREGAR / EDITAR
// ===============================

const modal = document.querySelector("#modal-insumo");
const botonAbrirModal = document.querySelector("#abrir-modal");

const botonesCerrarModal = document.querySelectorAll(
  "[data-cerrar-modal]"
);

const formulario = document.querySelector("#form-insumo");
const tituloModal = document.querySelector("#titulo-modal");

const inputId = document.querySelector("#insumo-id");
const inputNombre = document.querySelector("#nombre");
const inputCategoria = document.querySelector("#categoria");
const inputCantidad = document.querySelector("#cantidad");
const inputUnidad = document.querySelector("#unidad");
const inputStockMinimo = document.querySelector("#stock-minimo");

// ===============================
// MODAL ELIMINAR
// ===============================

const modalEliminar = document.querySelector("#modal-eliminar");

const botonesCerrarEliminar = document.querySelectorAll(
  "[data-cerrar-eliminar]"
);

const botonConfirmarEliminar = document.querySelector(
  "#confirmar-eliminar"
);

const nombreInsumoEliminar = document.querySelector(
  "#nombre-insumo-eliminar"
);

// ===============================
// MODAL MOVIMIENTO
// ===============================

const modalMovimiento = document.querySelector("#modal-movimiento");

const botonesCerrarMovimiento = document.querySelectorAll(
  "[data-cerrar-movimiento]"
);

const formularioMovimiento = document.querySelector(
  "#form-movimiento"
);

const movimientoItemId = document.querySelector(
  "#movimiento-item-id"
);

const movimientoNombreInsumo = document.querySelector(
  "#movimiento-nombre-insumo"
);

const movimientoStockActual = document.querySelector(
  "#movimiento-stock-actual"
);

const movimientoTipo = document.querySelector(
  "#movimiento-tipo"
);

const movimientoCantidad = document.querySelector(
  "#movimiento-cantidad"
);

const movimientoUnidad = document.querySelector(
  "#movimiento-unidad"
);

const movimientoMotivo = document.querySelector(
  "#movimiento-motivo"
);

const botonGuardarMovimiento = document.querySelector(
  "#guardar-movimiento"
);

// ===============================
// TOAST
// ===============================

const toast = document.querySelector("#toast");
const toastIcon = document.querySelector("#toast-icon");
const toastMessage = document.querySelector("#toast-message");

function mostrarToast(mensaje, tipo = "success") {
  clearTimeout(toastTimer);

  toastMessage.textContent = mensaje;

  toastIcon.textContent =
    tipo === "success" ? "✅" : "⚠️";

  toast.classList.remove(
    "toast--success",
    "toast--error",
    "toast--visible"
  );

  toast.classList.add(
    tipo === "success"
      ? "toast--success"
      : "toast--error",
    "toast--visible"
  );

  toast.setAttribute("aria-hidden", "false");

  toastTimer = setTimeout(() => {
    toast.classList.remove("toast--visible");

    toast.setAttribute(
      "aria-hidden",
      "true"
    );
  }, 3000);
}

// ===============================
// PASOS DE LOS INPUTS
// ===============================

function actualizarPasoCampos() {
  const esUnidad =
    inputUnidad.value === "unidades";

  const paso = esUnidad
    ? "1"
    : "0.01";

  inputCantidad.step = paso;
  inputStockMinimo.step = paso;
}

function actualizarPasoMovimiento(unidad) {
  const esUnidad =
    unidad === "unidades";

  movimientoCantidad.step =
    esUnidad ? "1" : "0.01";

  movimientoCantidad.min =
    esUnidad ? "1" : "0.01";
}

// ===============================
// TARJETAS
// ===============================

function limpiarTarjetasActivas() {
  [
    cardTotal,
    cardStockBajo,
    cardSinStock,
  ].forEach((card) => {
    card.classList.remove(
      "summary-card--active"
    );
  });
}

function activarTarjeta(cardActiva) {
  limpiarTarjetasActivas();

  cardActiva.classList.add(
    "summary-card--active"
  );
}

// ===============================
// CARGAR INSUMOS
// ===============================

async function cargarInsumos(filtros = {}) {
  try {
    const parametros =
      new URLSearchParams();

    if (filtros.nombre) {
      parametros.append(
        "nombre",
        filtros.nombre
      );
    }

    if (
      filtros.categoria &&
      filtros.categoria !== "todas"
    ) {
      parametros.append(
        "categoria",
        filtros.categoria
      );
    }

    if (filtros.stock) {
      parametros.append(
        "stock",
        filtros.stock
      );
    }

    const queryString =
      parametros.toString();

    const url = queryString
      ? `${API_URL}?${queryString}`
      : API_URL;

    const respuesta =
      await fetch(url);

    if (!respuesta.ok) {
      throw new Error(
        "No se pudieron obtener los insumos"
      );
    }

    insumos =
      await respuesta.json();

    renderizarInsumos(insumos);

    await actualizarResumen();
  } catch (error) {
    console.error(error);

    listaInsumos.innerHTML = `
      <tr>
        <td colspan="7">
          No se pudo cargar el stock. Revisá que el servidor esté funcionando.
        </td>
      </tr>
    `;

    mostrarToast(
      "No se pudo conectar con el servidor",
      "error"
    );
  }
}

// ===============================
// RESUMEN
// ===============================

async function actualizarResumen() {
  try {
    const respuesta =
      await fetch(SUMMARY_URL);

    if (!respuesta.ok) {
      throw new Error(
        "No se pudo obtener el resumen del stock"
      );
    }

    const resumen =
      await respuesta.json();

    totalInsumos.textContent =
      resumen.totalInsumos;

    totalStockBajo.textContent =
      resumen.stockBajo;

    totalSinStock.textContent =
      resumen.sinStock;
  } catch (error) {
    console.error(error);

    totalInsumos.textContent = "—";
    totalStockBajo.textContent = "—";
    totalSinStock.textContent = "—";
  }
}

// ===============================
// ESTADO DEL STOCK
// ===============================

function obtenerEstado(insumo) {
  if (insumo.cantidad === 0) {
    return {
      texto: "Sin stock",
      clase: "status-badge--empty",
    };
  }

  if (
    insumo.cantidad <=
    insumo.stockMinimo
  ) {
    return {
      texto: "Stock bajo",
      clase: "status-badge--low",
    };
  }

  return {
    texto: "Disponible",
    clase: "status-badge--available",
  };
}

function obtenerIconoCategoria(categoria) {
  const iconos = {
    Refrigerados: "🧊",
    Endulzantes: "🍯",
    Almacén: "🥫",
    "Harinas y féculas": "🌾",
    "Frutos secos": "🥜",
    "Cereales y semillas": "🌱",
    "Frutas secas": "🍇",
    "Leudantes y especias": "🧁",
    "Chocolates y cacao": "🍫",
    Saborizantes: "🧴",
    "Dulces y rellenos": "🍮",
    Suplementos: "💪",
    Congelados: "❄️",
  };

  return iconos[categoria] || "📦";
}

// ===============================
// RENDER TABLA DE INSUMOS
// ===============================

function renderizarInsumos(lista) {
  listaInsumos.innerHTML = "";

  if (lista.length === 0) {
    mensajeVacio.hidden = false;
    return;
  }

  mensajeVacio.hidden = true;

  lista.forEach((insumo) => {
    const estado =
      obtenerEstado(insumo);

    const fila =
      document.createElement("tr");

    fila.innerHTML = `
      <td>
        <strong>${insumo.nombre}</strong>
      </td>

      <td>
        <span class="category-badge">
          ${obtenerIconoCategoria(insumo.categoria)}
          ${insumo.categoria}
        </span>
      </td>

      <td>${insumo.cantidad}</td>

      <td>${insumo.unidad}</td>

      <td>${insumo.stockMinimo}</td>

      <td>
        <span class="status-badge ${estado.clase}">
          ${estado.texto}
        </span>
      </td>

      <td>
        <div class="actions">

          <button
            class="action-button action-button--edit"
            type="button"
            aria-label="Editar ${insumo.nombre}"
            data-editar="${insumo.id}"
          >
            ✏️
          </button>

          <button
            class="action-button action-button--movement"
            type="button"
            aria-label="Registrar movimiento de ${insumo.nombre}"
            data-movimiento="${insumo.id}"
          >
            📦
          </button>

          <button
            class="action-button action-button--delete"
            type="button"
            aria-label="Eliminar ${insumo.nombre}"
            data-eliminar="${insumo.id}"
          >
            🗑️
          </button>

        </div>
      </td>
    `;

    listaInsumos.appendChild(
      fila
    );
  });
}

// ===============================
// FILTROS DE INSUMOS
// ===============================

async function filtrarInsumos() {
  const nombre =
    buscador.value.trim();

  const categoria =
    filtroCategoria.value;

  limpiarTarjetasActivas();

  await cargarInsumos({
    nombre,
    categoria,
  });
}
// ===============================
// HISTORIAL DE MOVIMIENTOS
// ===============================

function formatearFecha(fecha) {
  const fechaMovimiento =
    new Date(fecha);

  if (
    Number.isNaN(
      fechaMovimiento.getTime()
    )
  ) {
    return "—";
  }

  return fechaMovimiento.toLocaleString(
    "es-AR",
    {
      dateStyle: "short",
      timeStyle: "short",
    }
  );
}

function obtenerInsumoPorId(
  itemId,
  listaCompleta
) {
  return listaCompleta.find(
    (item) =>
      String(item.id) ===
      String(itemId)
  );
}

function renderizarMovimientos(
  lista,
  listaCompletaInsumos
) {
  listaMovimientos.innerHTML = "";

  if (lista.length === 0) {
    mensajeMovimientosVacio.hidden =
      false;

    return;
  }

  mensajeMovimientosVacio.hidden =
    true;

  lista.forEach((movimiento) => {
    const insumo =
      obtenerInsumoPorId(
        movimiento.itemId,
        listaCompletaInsumos
      );

    const nombreInsumo =
      insumo?.nombre ||
      "Insumo eliminado";

    const unidad =
      insumo?.unidad || "";

    const esEntrada =
      movimiento.tipo === "entrada";

    const textoTipo =
      esEntrada
        ? "↑ Entrada"
        : "↓ Salida";

    const claseTipo =
      esEntrada
        ? "movement-badge--entry"
        : "movement-badge--exit";

    const motivo =
      movimiento.motivo ||
      "Sin motivo";

    const fila =
      document.createElement("tr");

    fila.innerHTML = `
      <td>
        ${formatearFecha(
          movimiento.fecha
        )}
      </td>

      <td>
        <strong>
          ${nombreInsumo}
        </strong>
      </td>

      <td>
        <span
          class="movement-badge ${claseTipo}"
        >
          ${textoTipo}
        </span>
      </td>

      <td>
        ${movimiento.cantidad}
        ${unidad}
      </td>

      <td>
        ${motivo}
      </td>
    `;

    listaMovimientos.appendChild(
      fila
    );
  });
}

async function cargarMovimientos() {
  try {
    const [
      respuestaMovimientos,
      respuestaInsumos,
    ] = await Promise.all([
      fetch(MOVEMENTS_URL),
      fetch(API_URL),
    ]);

    if (
      !respuestaMovimientos.ok ||
      !respuestaInsumos.ok
    ) {
      throw new Error(
        "No se pudo cargar el historial"
      );
    }

    movimientos =
      await respuestaMovimientos.json();

    const listaCompletaInsumos =
      await respuestaInsumos.json();

    movimientos.sort(
      (a, b) =>
        new Date(b.fecha) -
        new Date(a.fecha)
    );

    const tipoSeleccionado =
      filtroTipoMovimiento.value;

    const movimientosFiltrados =
      tipoSeleccionado === "todos"
        ? movimientos
        : movimientos.filter(
            (movimiento) =>
              movimiento.tipo ===
              tipoSeleccionado
          );

    renderizarMovimientos(
      movimientosFiltrados,
      listaCompletaInsumos
    );
  } catch (error) {
    console.error(error);

    listaMovimientos.innerHTML = `
      <tr>
        <td colspan="5">
          No se pudo cargar el historial de movimientos.
        </td>
      </tr>
    `;

    mostrarToast(
      "No se pudo cargar el historial",
      "error"
    );
  }
}

async function filtrarMovimientos() {
  await cargarMovimientos();
}

// ===============================
// NAVEGACIÓN
// ===============================

function activarMenu(botonActivo) {
  [
    botonInicio,
    botonInsumos,
    botonMovimientos,
  ].forEach((boton) => {
    boton.classList.remove(
      "nav-link--active"
    );
  });

  botonActivo.classList.add(
    "nav-link--active"
  );
}

async function mostrarTodosLosInsumos() {
  buscador.value = "";

  filtroCategoria.value =
    "todas";

  activarTarjeta(cardTotal);

  activarMenu(
    botonInsumos
  );

  await cargarInsumos();

  seccionInsumos.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

async function mostrarStockBajo() {
  buscador.value = "";

  filtroCategoria.value =
    "todas";

  activarTarjeta(
    cardStockBajo
  );

  activarMenu(
    botonInsumos
  );

  await cargarInsumos({
    stock: "bajo",
  });

  seccionInsumos.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

async function mostrarSinStock() {
  buscador.value = "";

  filtroCategoria.value =
    "todas";

  activarTarjeta(
    cardSinStock
  );

  activarMenu(
    botonInsumos
  );

  await cargarInsumos({
    stock: "agotado",
  });

  seccionInsumos.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

async function volverAlInicio() {
  buscador.value = "";

  filtroCategoria.value =
    "todas";

  limpiarTarjetasActivas();

  await cargarInsumos();

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

  activarMenu(
    botonInicio
  );
}

function irAInsumos() {
  seccionInsumos.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });

  activarMenu(
    botonInsumos
  );
}

async function irAMovimientos() {
  await cargarMovimientos();

  seccionMovimientos.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });

  activarMenu(
    botonMovimientos
  );
}

// ===============================
// MODAL AGREGAR / EDITAR
// ===============================

function abrirModal(insumo = null) {
  formulario.reset();

  inputId.value = "";

  if (insumo) {
    tituloModal.textContent =
      "Editar insumo";

    inputId.value =
      insumo.id;

    inputNombre.value =
      insumo.nombre;

    inputCategoria.value =
      insumo.categoria;

    inputCantidad.value =
      insumo.cantidad;

    inputUnidad.value =
      insumo.unidad;

    inputStockMinimo.value =
      insumo.stockMinimo;
  } else {
    tituloModal.textContent =
      "Agregar insumo";
  }

  actualizarPasoCampos();

  modal.classList.add(
    "modal--open"
  );

  modal.setAttribute(
    "aria-hidden",
    "false"
  );

  inputNombre.focus();
}

function cerrarModal() {
  modal.classList.remove(
    "modal--open"
  );

  modal.setAttribute(
    "aria-hidden",
    "true"
  );

  formulario.reset();

  inputId.value = "";
}

// ===============================
// MODAL ELIMINAR
// ===============================

function abrirModalEliminar(id) {
  const insumoEncontrado =
    insumos.find(
      (insumo) =>
        String(insumo.id) ===
        String(id)
    );

  if (!insumoEncontrado) {
    mostrarToast(
      "No se encontró el insumo seleccionado",
      "error"
    );

    return;
  }

  idPendienteDeEliminacion =
    insumoEncontrado.id;

  nombreInsumoEliminar.textContent =
    `"${insumoEncontrado.nombre}"`;

  modalEliminar.classList.add(
    "modal--open"
  );

  modalEliminar.setAttribute(
    "aria-hidden",
    "false"
  );

  botonConfirmarEliminar.focus();
}

function cerrarModalEliminar() {
  modalEliminar.classList.remove(
    "modal--open"
  );

  modalEliminar.setAttribute(
    "aria-hidden",
    "true"
  );

  idPendienteDeEliminacion =
    null;

  nombreInsumoEliminar.textContent =
    "";
}

// ===============================
// MODAL MOVIMIENTO
// ===============================

function abrirModalMovimiento(id) {
  const insumoEncontrado =
    insumos.find(
      (insumo) =>
        String(insumo.id) ===
        String(id)
    );

  if (!insumoEncontrado) {
    mostrarToast(
      "No se encontró el insumo seleccionado",
      "error"
    );

    return;
  }

  formularioMovimiento.reset();

  movimientoItemId.value =
    insumoEncontrado.id;

  movimientoNombreInsumo.textContent =
    insumoEncontrado.nombre;

  movimientoStockActual.textContent =
    `Stock actual: ${insumoEncontrado.cantidad} ${insumoEncontrado.unidad}`;

  movimientoUnidad.textContent =
    `Cantidad expresada en ${insumoEncontrado.unidad}`;

  actualizarPasoMovimiento(
    insumoEncontrado.unidad
  );

  modalMovimiento.classList.add(
    "modal--open"
  );

  modalMovimiento.setAttribute(
    "aria-hidden",
    "false"
  );

  movimientoTipo.focus();
}

function cerrarModalMovimiento() {
  modalMovimiento.classList.remove(
    "modal--open"
  );

  modalMovimiento.setAttribute(
    "aria-hidden",
    "true"
  );

  formularioMovimiento.reset();

  movimientoItemId.value = "";

  movimientoNombreInsumo.textContent =
    "Insumo";

  movimientoStockActual.textContent =
    "Stock actual: —";

  movimientoUnidad.textContent =
    "Unidad del insumo";
}

// ===============================
// GUARDAR INSUMO
// ===============================

async function guardarInsumo(evento) {
  evento.preventDefault();

  const id =
    inputId.value;

  const datosInsumo = {
    nombre:
      inputNombre.value.trim(),

    categoria:
      inputCategoria.value,

    cantidad:
      Number(
        inputCantidad.value
      ),

    unidad:
      inputUnidad.value,

    stockMinimo:
      Number(
        inputStockMinimo.value
      ),
  };

  const estaEditando =
    Boolean(id);

  const url = estaEditando
    ? `${API_URL}/${id}`
    : API_URL;

  const metodo = estaEditando
    ? "PUT"
    : "POST";

  try {
    const respuesta =
      await fetch(url, {
        method: metodo,

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(
          datosInsumo
        ),
      });

    const resultado =
      await respuesta.json();

    if (!respuesta.ok) {
      const mensajesValidacion =
        resultado.errores
          ?.map(
            (error) =>
              error.mensaje
          )
          .join("\n");

      throw new Error(
        mensajesValidacion ||
        resultado.mensaje ||
        "No se pudo guardar el insumo"
      );
    }

    cerrarModal();

    await filtrarInsumos();

    mostrarToast(
      estaEditando
        ? "Insumo actualizado correctamente"
        : "Insumo agregado correctamente"
    );
  } catch (error) {
    console.error(error);

    mostrarToast(
      error.message,
      "error"
    );
  }
}

function editarInsumo(id) {
  const insumoEncontrado =
    insumos.find(
      (insumo) =>
        String(insumo.id) ===
        String(id)
    );

  if (insumoEncontrado) {
    abrirModal(
      insumoEncontrado
    );
  }
}
// ===============================
// CONFIRMAR ELIMINACIÓN
// ===============================

async function confirmarEliminacion() {
  if (
    !idPendienteDeEliminacion
  ) {
    return;
  }

  const id =
    idPendienteDeEliminacion;

  try {
    botonConfirmarEliminar.disabled =
      true;

    botonConfirmarEliminar.textContent =
      "Eliminando...";

    const respuesta =
      await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",
        }
      );

    const resultado =
      await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(
        resultado.mensaje ||
        "No se pudo eliminar el insumo"
      );
    }

    cerrarModalEliminar();

    await filtrarInsumos();

    await cargarMovimientos();

    mostrarToast(
      "Insumo eliminado correctamente"
    );
  } catch (error) {
    console.error(error);

    mostrarToast(
      error.message,
      "error"
    );
  } finally {
    botonConfirmarEliminar.disabled =
      false;

    botonConfirmarEliminar.textContent =
      "Eliminar";
  }
}

// ===============================
// REGISTRAR MOVIMIENTO
// ===============================

async function registrarMovimiento(evento) {
  evento.preventDefault();

  const itemId =
    movimientoItemId.value;

  const tipo =
    movimientoTipo.value;

  const cantidad =
    Number(
      movimientoCantidad.value
    );

  const motivo =
    movimientoMotivo.value.trim();

  if (!itemId) {
    mostrarToast(
      "No se encontró el insumo",
      "error"
    );

    return;
  }

  if (!tipo) {
    mostrarToast(
      "Seleccioná entrada o salida",
      "error"
    );

    return;
  }

  if (
    !cantidad ||
    cantidad <= 0
  ) {
    mostrarToast(
      "La cantidad debe ser mayor a 0",
      "error"
    );

    return;
  }

  const insumoSeleccionado =
    insumos.find(
      (insumo) =>
        String(insumo.id) ===
        String(itemId)
    );

  if (
    insumoSeleccionado?.unidad ===
      "unidades" &&
    !Number.isInteger(cantidad)
  ) {
    mostrarToast(
      "Para unidades ingresá un número entero",
      "error"
    );

    return;
  }

  const datosMovimiento = {
    itemId,
    tipo,
    cantidad,
  };

  if (motivo) {
    datosMovimiento.motivo =
      motivo;
  }

  try {
    botonGuardarMovimiento.disabled =
      true;

    botonGuardarMovimiento.textContent =
      "Registrando...";

    const respuesta =
      await fetch(
        MOVEMENTS_URL,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            datosMovimiento
          ),
        }
      );

    const resultado =
      await respuesta.json();

    if (!respuesta.ok) {
      const mensajesValidacion =
        resultado.errores
          ?.map(
            (error) =>
              error.mensaje
          )
          .join("\n");

      throw new Error(
        mensajesValidacion ||
        resultado.mensaje ||
        "No se pudo registrar el movimiento"
      );
    }

    cerrarModalMovimiento();

    await filtrarInsumos();

    await cargarMovimientos();

    mostrarToast(
      tipo === "entrada"
        ? "Entrada registrada correctamente"
        : "Salida registrada correctamente"
    );
  } catch (error) {
    console.error(error);

    mostrarToast(
      error.message,
      "error"
    );
  } finally {
    botonGuardarMovimiento.disabled =
      false;

    botonGuardarMovimiento.textContent =
      "Registrar movimiento";
  }
}

// ===============================
// USUARIO LARA
// ===============================

const botonUsuario =
  document.querySelector(
    "#boton-usuario"
  );

const menuUsuario =
  document.querySelector(
    "#menu-usuario"
  );

const botonAbrirPerfil =
  document.querySelector(
    "#abrir-perfil"
  );

const botonAbrirAcerca =
  document.querySelector(
    "#abrir-acerca"
  );

const modalPerfil =
  document.querySelector(
    "#modal-perfil"
  );

const modalAcerca =
  document.querySelector(
    "#modal-acerca"
  );

const botonesCerrarPerfil =
  document.querySelectorAll(
    "[data-cerrar-perfil]"
  );

const botonesCerrarAcerca =
  document.querySelectorAll(
    "[data-cerrar-acerca]"
  );

// ===============================
// MENÚ DESPLEGABLE
// ===============================

function abrirMenuUsuario() {
  menuUsuario.classList.add(
    "user-dropdown--open"
  );

  menuUsuario.setAttribute(
    "aria-hidden",
    "false"
  );

  botonUsuario.setAttribute(
    "aria-expanded",
    "true"
  );
}

function cerrarMenuUsuario() {
  if (
    menuUsuario.contains(
      document.activeElement
    )
  ) {
    botonUsuario.focus();
  }

  menuUsuario.classList.remove(
    "user-dropdown--open"
  );

  menuUsuario.setAttribute(
    "aria-hidden",
    "true"
  );

  botonUsuario.setAttribute(
    "aria-expanded",
    "false"
  );
}

function alternarMenuUsuario() {
  const estaAbierto =
    menuUsuario.classList.contains(
      "user-dropdown--open"
    );

  if (estaAbierto) {
    cerrarMenuUsuario();
  } else {
    abrirMenuUsuario();
  }
}

// ===============================
// MODAL PERFIL
// ===============================

function abrirModalPerfil() {
  cerrarMenuUsuario();

  modalPerfil.classList.add(
    "modal--open"
  );

  modalPerfil.setAttribute(
    "aria-hidden",
    "false"
  );
}

function cerrarModalPerfil() {
  if (
    modalPerfil.contains(
      document.activeElement
    )
  ) {
    botonUsuario.focus();
  }

  modalPerfil.classList.remove(
    "modal--open"
  );

  modalPerfil.setAttribute(
    "aria-hidden",
    "true"
  );
}

// ===============================
// MODAL ACERCA DEL SISTEMA
// ===============================

function abrirModalAcerca() {
  cerrarMenuUsuario();

  modalAcerca.classList.add(
    "modal--open"
  );

  modalAcerca.setAttribute(
    "aria-hidden",
    "false"
  );
}

function cerrarModalAcerca() {
  if (
    modalAcerca.contains(
      document.activeElement
    )
  ) {
    botonUsuario.focus();
  }

  modalAcerca.classList.remove(
    "modal--open"
  );

  modalAcerca.setAttribute(
    "aria-hidden",
    "true"
  );
}

// ===============================
// EVENTOS DE NAVEGACIÓN
// ===============================

botonInicio.addEventListener(
  "click",
  volverAlInicio
);

botonInsumos.addEventListener(
  "click",
  irAInsumos
);

botonMovimientos.addEventListener(
  "click",
  irAMovimientos
);

// ===============================
// EVENTOS TARJETAS
// ===============================

cardTotal.addEventListener(
  "click",
  mostrarTodosLosInsumos
);

cardStockBajo.addEventListener(
  "click",
  mostrarStockBajo
);

cardSinStock.addEventListener(
  "click",
  mostrarSinStock
);

// ===============================
// EVENTOS MODAL INSUMOS
// ===============================

botonAbrirModal.addEventListener(
  "click",
  () => {
    abrirModal();
  }
);

botonesCerrarModal.forEach(
  (boton) => {
    boton.addEventListener(
      "click",
      cerrarModal
    );
  }
);

// ===============================
// EVENTOS MODAL ELIMINAR
// ===============================

botonesCerrarEliminar.forEach(
  (boton) => {
    boton.addEventListener(
      "click",
      cerrarModalEliminar
    );
  }
);

botonConfirmarEliminar.addEventListener(
  "click",
  confirmarEliminacion
);

// ===============================
// EVENTOS MODAL MOVIMIENTO
// ===============================

botonesCerrarMovimiento.forEach(
  (boton) => {
    boton.addEventListener(
      "click",
      cerrarModalMovimiento
    );
  }
);

// ===============================
// FORMULARIOS
// ===============================

formulario.addEventListener(
  "submit",
  guardarInsumo
);

formularioMovimiento.addEventListener(
  "submit",
  registrarMovimiento
);

// ===============================
// UNIDAD
// ===============================

inputUnidad.addEventListener(
  "change",
  actualizarPasoCampos
);

// ===============================
// BUSCADOR
// ===============================

buscador.addEventListener(
  "input",
  () => {
    clearTimeout(
      temporizadorBusqueda
    );

    temporizadorBusqueda =
      setTimeout(() => {
        filtrarInsumos();
      }, 300);
  }
);

// ===============================
// FILTROS
// ===============================

filtroCategoria.addEventListener(
  "change",
  filtrarInsumos
);

filtroTipoMovimiento.addEventListener(
  "change",
  filtrarMovimientos
);

// ===============================
// ACCIONES DE LA TABLA
// ===============================

listaInsumos.addEventListener(
  "click",
  (evento) => {
    const botonEditar =
      evento.target.closest(
        "[data-editar]"
      );

    const botonMovimiento =
      evento.target.closest(
        "[data-movimiento]"
      );

    const botonEliminar =
      evento.target.closest(
        "[data-eliminar]"
      );

    if (botonEditar) {
      editarInsumo(
        botonEditar.dataset.editar
      );
    }

    if (botonMovimiento) {
      abrirModalMovimiento(
        botonMovimiento.dataset.movimiento
      );
    }

    if (botonEliminar) {
      abrirModalEliminar(
        botonEliminar.dataset.eliminar
      );
    }
  }
);

// ===============================
// EVENTOS DEL USUARIO
// ===============================

botonUsuario.addEventListener(
  "click",
  (evento) => {
    evento.stopPropagation();

    alternarMenuUsuario();
  }
);

menuUsuario.addEventListener(
  "click",
  (evento) => {
    evento.stopPropagation();
  }
);

botonAbrirPerfil.addEventListener(
  "click",
  abrirModalPerfil
);

botonAbrirAcerca.addEventListener(
  "click",
  abrirModalAcerca
);

botonesCerrarPerfil.forEach(
  (boton) => {
    boton.addEventListener(
      "click",
      cerrarModalPerfil
    );
  }
);

botonesCerrarAcerca.forEach(
  (boton) => {
    boton.addEventListener(
      "click",
      cerrarModalAcerca
    );
  }
);

// Cierra el menú de Lara
// cuando se hace click afuera.

document.addEventListener(
  "click",
  () => {
    cerrarMenuUsuario();
  }
);

// ===============================
// ESCAPE
// ===============================

document.addEventListener(
  "keydown",
  (evento) => {
    if (
      evento.key !== "Escape"
    ) {
      return;
    }

    if (
      modalPerfil.classList.contains(
        "modal--open"
      )
    ) {
      cerrarModalPerfil();
      return;
    }

    if (
      modalAcerca.classList.contains(
        "modal--open"
      )
    ) {
      cerrarModalAcerca();
      return;
    }

    if (
      modalMovimiento.classList.contains(
        "modal--open"
      )
    ) {
      cerrarModalMovimiento();
      return;
    }

    if (
      modalEliminar.classList.contains(
        "modal--open"
      )
    ) {
      cerrarModalEliminar();
      return;
    }

    if (
      modal.classList.contains(
        "modal--open"
      )
    ) {
      cerrarModal();
      return;
    }

    if (
      menuUsuario.classList.contains(
        "user-dropdown--open"
      )
    ) {
      cerrarMenuUsuario();
    }
  }
);

// ===============================
// INICIO
// ===============================

async function iniciarAplicacion() {
  await cargarInsumos();
  await cargarMovimientos();
}

iniciarAplicacion();