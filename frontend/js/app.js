const API_URL = "http://localhost:4000/api/items";
const SUMMARY_URL = `${API_URL}/resumen`;

let insumos = [];

const listaInsumos = document.querySelector("#lista-insumos");
const mensajeVacio = document.querySelector("#mensaje-vacio");

const buscador = document.querySelector("#buscador");
const filtroCategoria = document.querySelector("#filtro-categoria");

const totalInsumos = document.querySelector("#total-insumos");
const totalStockBajo = document.querySelector("#total-stock-bajo");
const totalSinStock = document.querySelector("#total-sin-stock");

const modal = document.querySelector("#modal-insumo");
const botonAbrirModal = document.querySelector("#abrir-modal");
const botonesCerrarModal = document.querySelectorAll("[data-cerrar-modal]");

const formulario = document.querySelector("#form-insumo");
const tituloModal = document.querySelector("#titulo-modal");

const inputId = document.querySelector("#insumo-id");
const inputNombre = document.querySelector("#nombre");
const inputCategoria = document.querySelector("#categoria");
const inputCantidad = document.querySelector("#cantidad");
const inputUnidad = document.querySelector("#unidad");
const inputStockMinimo = document.querySelector("#stock-minimo");

async function cargarInsumos() {
  try {
    const respuesta = await fetch(API_URL);

    if (!respuesta.ok) {
      throw new Error("No se pudieron obtener los insumos");
    }

    insumos = await respuesta.json();

    await actualizarInterfaz();
  } catch (error) {
    console.error(error);

    listaInsumos.innerHTML = `
      <tr>
        <td colspan="7">
          No se pudo cargar el stock. Revisá que el servidor esté funcionando.
        </td>
      </tr>
    `;
  }
}

async function actualizarResumen() {
  try {
    const respuesta = await fetch(SUMMARY_URL);

    if (!respuesta.ok) {
      throw new Error("No se pudo obtener el resumen del stock");
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

function filtrarInsumos() {
  const textoBuscado = buscador.value.toLowerCase().trim();
  const categoriaSeleccionada = filtroCategoria.value;

  const resultado = insumos.filter((insumo) => {
    const coincideNombre = insumo.nombre
      .toLowerCase()
      .includes(textoBuscado);

    const coincideCategoria =
      categoriaSeleccionada === "todas" ||
      insumo.categoria === categoriaSeleccionada;

    return coincideNombre && coincideCategoria;
  });

  renderizarInsumos(resultado);
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
      const mensajesValidacion = resultado.errores
        ?.map((error) => error.mensaje)
        .join("\n");

      throw new Error(
        mensajesValidacion ||
          resultado.mensaje ||
          "No se pudo guardar el insumo"
      );
    }

    cerrarModal();

    await cargarInsumos();

    window.alert(
      estaEditando
        ? "Insumo actualizado correctamente"
        : "Insumo agregado correctamente"
    );
  } catch (error) {
    console.error(error);

    window.alert(error.message);
  }
}

function editarInsumo(id) {
  const insumoEncontrado = insumos.find(
    (insumo) => String(insumo.id) === String(id)
  );

  if (insumoEncontrado) {
    abrirModal(insumoEncontrado);
  }
}

async function eliminarInsumo(id) {
  const insumoEncontrado = insumos.find(
    (insumo) => String(insumo.id) === String(id)
  );

  if (!insumoEncontrado) {
    return;
  }

  const confirmar = window.confirm(
    `¿Querés eliminar el insumo "${insumoEncontrado.nombre}"?`
  );

  if (!confirmar) {
    return;
  }

  try {
    const respuesta = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    const resultado = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(
        resultado.mensaje ||
          "No se pudo eliminar el insumo"
      );
    }

    await cargarInsumos();

    window.alert("Insumo eliminado correctamente");
  } catch (error) {
    console.error(error);

    window.alert(error.message);
  }
}

async function actualizarInterfaz() {
  await actualizarResumen();
  filtrarInsumos();
}

botonAbrirModal.addEventListener("click", () => {
  abrirModal();
});

botonesCerrarModal.forEach((boton) => {
  boton.addEventListener("click", cerrarModal);
});

formulario.addEventListener("submit", guardarInsumo);

buscador.addEventListener("input", filtrarInsumos);

filtroCategoria.addEventListener(
  "change",
  filtrarInsumos
);

listaInsumos.addEventListener("click", (evento) => {
  const botonEditar = evento.target.closest(
    "[data-editar]"
  );

  const botonEliminar = evento.target.closest(
    "[data-eliminar]"
  );

  if (botonEditar) {
    editarInsumo(botonEditar.dataset.editar);
  }

  if (botonEliminar) {
    eliminarInsumo(botonEliminar.dataset.eliminar);
  }
});

document.addEventListener("keydown", (evento) => {
  if (
    evento.key === "Escape" &&
    modal.classList.contains("modal--open")
  ) {
    cerrarModal();
  }
});

cargarInsumos();