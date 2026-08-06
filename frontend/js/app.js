const API_URL = "http://localhost:4000/api/items";
const SUMMARY_URL = `${API_URL}/resumen`;

let insumos = [];
let temporizadorBusqueda;
let toastTimer;
let idPendienteDeEliminacion = null;

const listaInsumos = document.querySelector("#lista-insumos");
const mensajeVacio = document.querySelector("#mensaje-vacio");

const buscador = document.querySelector("#buscador");
const filtroCategoria = document.querySelector("#filtro-categoria");

const botonInicio = document.querySelector("#nav-inicio");
const botonInsumos = document.querySelector("#nav-insumos");
const seccionInsumos = document.querySelector("#seccion-insumos");

const cardTotal = document.querySelector("#card-total");
const cardStockBajo = document.querySelector("#card-stock-bajo");
const cardSinStock = document.querySelector("#card-sin-stock");

const totalInsumos = document.querySelector("#total-insumos");
const totalStockBajo = document.querySelector("#total-stock-bajo");
const totalSinStock = document.querySelector("#total-sin-stock");

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

const toast = document.querySelector("#toast");
const toastIcon = document.querySelector("#toast-icon");
const toastMessage = document.querySelector("#toast-message");

function mostrarToast(mensaje, tipo = "success") {
  clearTimeout(toastTimer);

  toastMessage.textContent = mensaje;
  toastIcon.textContent = tipo === "success" ? "✅" : "⚠️";

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
    toast.setAttribute("aria-hidden", "true");
  }, 3000);
}

function actualizarPasoCampos() {
  const esUnidad = inputUnidad.value === "unidades";
  const paso = esUnidad ? "1" : "0.01";

  inputCantidad.step = paso;
  inputStockMinimo.step = paso;
}

function limpiarTarjetasActivas() {
  [cardTotal, cardStockBajo, cardSinStock].forEach((card) => {
    card.classList.remove("summary-card--active");
  });
}

function activarTarjeta(cardActiva) {
  limpiarTarjetasActivas();
  cardActiva.classList.add("summary-card--active");
}

async function cargarInsumos(filtros = {}) {
  try {
    const parametros = new URLSearchParams();

    if (filtros.nombre) {
      parametros.append("nombre", filtros.nombre);
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
      parametros.append("stock", filtros.stock);
    }

    const queryString = parametros.toString();

    const url = queryString
      ? `${API_URL}?${queryString}`
      : API_URL;

    const respuesta = await fetch(url);

    if (!respuesta.ok) {
      throw new Error(
        "No se pudieron obtener los insumos"
      );
    }

    insumos = await respuesta.json();

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

async function actualizarResumen() {
  try {
    const respuesta = await fetch(SUMMARY_URL);

    if (!respuesta.ok) {
      throw new Error(
        "No se pudo obtener el resumen del stock"
      );
    }

    const resumen = await respuesta.json();

    totalInsumos.textContent = resumen.totalInsumos;
    totalStockBajo.textContent = resumen.stockBajo;
    totalSinStock.textContent = resumen.sinStock;
  } catch (error) {
    console.error(error);

    totalInsumos.textContent = "—";
    totalStockBajo.textContent = "—";
    totalSinStock.textContent = "—";
  }
}

function obtenerEstado(insumo) {
  if (insumo.cantidad === 0) {
    return {
      texto: "Sin stock",
      clase: "status-badge--empty",
    };
  }

  if (insumo.cantidad <= insumo.stockMinimo) {
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

function renderizarInsumos(lista) {
  listaInsumos.innerHTML = "";

  if (lista.length === 0) {
    mensajeVacio.hidden = false;
    return;
  }

  mensajeVacio.hidden = true;

  lista.forEach((insumo) => {
    const estado = obtenerEstado(insumo);
    const fila = document.createElement("tr");

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

    listaInsumos.appendChild(fila);
  });
}

async function filtrarInsumos() {
  const nombre = buscador.value.trim();
  const categoria = filtroCategoria.value;

  limpiarTarjetasActivas();

  await cargarInsumos({
    nombre,
    categoria,
  });
}

function activarMenu(botonActivo) {
  botonInicio.classList.remove("nav-link--active");
  botonInsumos.classList.remove("nav-link--active");

  botonActivo.classList.add("nav-link--active");
}

async function mostrarTodosLosInsumos() {
  buscador.value = "";
  filtroCategoria.value = "todas";

  activarTarjeta(cardTotal);
  activarMenu(botonInsumos);

  await cargarInsumos();

  seccionInsumos.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

async function mostrarStockBajo() {
  buscador.value = "";
  filtroCategoria.value = "todas";

  activarTarjeta(cardStockBajo);
  activarMenu(botonInsumos);

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
  filtroCategoria.value = "todas";

  activarTarjeta(cardSinStock);
  activarMenu(botonInsumos);

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
  filtroCategoria.value = "todas";

  limpiarTarjetasActivas();

  await cargarInsumos();

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

  activarMenu(botonInicio);
}

function irAInsumos() {
  seccionInsumos.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });

  activarMenu(botonInsumos);
}

function abrirModal(insumo = null) {
  formulario.reset();
  inputId.value = "";

  if (insumo) {
    tituloModal.textContent = "Editar insumo";

    inputId.value = insumo.id;
    inputNombre.value = insumo.nombre;
    inputCategoria.value = insumo.categoria;
    inputCantidad.value = insumo.cantidad;
    inputUnidad.value = insumo.unidad;
    inputStockMinimo.value = insumo.stockMinimo;
  } else {
    tituloModal.textContent = "Agregar insumo";
  }

  actualizarPasoCampos();

  modal.classList.add("modal--open");
  modal.setAttribute("aria-hidden", "false");

  inputNombre.focus();
}

function cerrarModal() {
  modal.classList.remove("modal--open");
  modal.setAttribute("aria-hidden", "true");

  formulario.reset();
  inputId.value = "";
}

function abrirModalEliminar(id) {
  const insumoEncontrado = insumos.find(
    (insumo) =>
      String(insumo.id) === String(id)
  );

  if (!insumoEncontrado) {
    mostrarToast(
      "No se encontró el insumo seleccionado",
      "error"
    );

    return;
  }

  idPendienteDeEliminacion = insumoEncontrado.id;

  nombreInsumoEliminar.textContent =
    `"${insumoEncontrado.nombre}"`;

  modalEliminar.classList.add("modal--open");

  modalEliminar.setAttribute(
    "aria-hidden",
    "false"
  );

  botonConfirmarEliminar.focus();
}

function cerrarModalEliminar() {
  modalEliminar.classList.remove("modal--open");

  modalEliminar.setAttribute(
    "aria-hidden",
    "true"
  );

  idPendienteDeEliminacion = null;
  nombreInsumoEliminar.textContent = "";
}

async function guardarInsumo(evento) {
  evento.preventDefault();

  const id = inputId.value;

  const datosInsumo = {
    nombre: inputNombre.value.trim(),
    categoria: inputCategoria.value,
    cantidad: Number(inputCantidad.value),
    unidad: inputUnidad.value,
    stockMinimo: Number(inputStockMinimo.value),
  };

  const estaEditando = Boolean(id);

  const url = estaEditando
    ? `${API_URL}/${id}`
    : API_URL;

  const metodo = estaEditando
    ? "PUT"
    : "POST";

  try {
    const respuesta = await fetch(url, {
      method: metodo,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datosInsumo),
    });

    const resultado = await respuesta.json();

    if (!respuesta.ok) {
      const mensajesValidacion =
        resultado.errores
          ?.map((error) => error.mensaje)
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
    mostrarToast(error.message, "error");
  }
}

function editarInsumo(id) {
  const insumoEncontrado = insumos.find(
    (insumo) =>
      String(insumo.id) === String(id)
  );

  if (insumoEncontrado) {
    abrirModal(insumoEncontrado);
  }
}

async function confirmarEliminacion() {
  if (!idPendienteDeEliminacion) {
    return;
  }

  const id = idPendienteDeEliminacion;

  try {
    botonConfirmarEliminar.disabled = true;
    botonConfirmarEliminar.textContent = "Eliminando...";

    const respuesta = await fetch(
      `${API_URL}/${id}`,
      {
        method: "DELETE",
      }
    );

    const resultado = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(
        resultado.mensaje ||
          "No se pudo eliminar el insumo"
      );
    }

    cerrarModalEliminar();

    await filtrarInsumos();

    mostrarToast(
      "Insumo eliminado correctamente"
    );
  } catch (error) {
    console.error(error);
    mostrarToast(error.message, "error");
  } finally {
    botonConfirmarEliminar.disabled = false;
    botonConfirmarEliminar.textContent = "Eliminar";
  }
}

botonInicio.addEventListener(
  "click",
  volverAlInicio
);

botonInsumos.addEventListener(
  "click",
  irAInsumos
);

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

botonAbrirModal.addEventListener("click", () => {
  abrirModal();
});

botonesCerrarModal.forEach((boton) => {
  boton.addEventListener(
    "click",
    cerrarModal
  );
});

botonesCerrarEliminar.forEach((boton) => {
  boton.addEventListener(
    "click",
    cerrarModalEliminar
  );
});

botonConfirmarEliminar.addEventListener(
  "click",
  confirmarEliminacion
);

formulario.addEventListener(
  "submit",
  guardarInsumo
);

inputUnidad.addEventListener(
  "change",
  actualizarPasoCampos
);

buscador.addEventListener("input", () => {
  clearTimeout(temporizadorBusqueda);

  temporizadorBusqueda = setTimeout(() => {
    filtrarInsumos();
  }, 300);
});

filtroCategoria.addEventListener(
  "change",
  filtrarInsumos
);

listaInsumos.addEventListener(
  "click",
  (evento) => {
    const botonEditar = evento.target.closest(
      "[data-editar]"
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

    if (botonEliminar) {
      abrirModalEliminar(
        botonEliminar.dataset.eliminar
      );
    }
  }
);

document.addEventListener(
  "keydown",
  (evento) => {
    if (evento.key !== "Escape") {
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
      modal.classList.contains("modal--open")
    ) {
      cerrarModal();
    }
  }
);

cargarInsumos();