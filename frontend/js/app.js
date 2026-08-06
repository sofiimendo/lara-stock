const insumos = [
  {
    id: 1,
    nombre: "Harina 000",
    categoria: "Harinas y féculas",
    cantidad: 12,
    unidad: "kg",
    stockMinimo: 5,
  },
  {
    id: 2,
    nombre: "Chocolate semiamargo",
    categoria: "Chocolates y cacao",
    cantidad: 3,
    unidad: "kg",
    stockMinimo: 4,
  },
  {
    id: 3,
    nombre: "Crema de leche",
    categoria: "Refrigerados",
    cantidad: 0,
    unidad: "litros",
    stockMinimo: 2,
  },
  {
    id: 4,
    nombre: "Nueces",
    categoria: "Frutos secos",
    cantidad: 8,
    unidad: "kg",
    stockMinimo: 3,
  },
  {
    id: 5,
    nombre: "Esencia de vainilla",
    categoria: "Saborizantes",
    cantidad: 6,
    unidad: "unidades",
    stockMinimo: 2,
  },
];

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
      <td><strong>${insumo.nombre}</strong></td>

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

function actualizarResumen() {
  const cantidadStockBajo = insumos.filter(
    (insumo) =>
      insumo.cantidad > 0 &&
      insumo.cantidad <= insumo.stockMinimo
  ).length;

  const cantidadSinStock = insumos.filter(
    (insumo) => insumo.cantidad === 0
  ).length;

  totalInsumos.textContent = insumos.length;
  totalStockBajo.textContent = cantidadStockBajo;
  totalSinStock.textContent = cantidadSinStock;
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

function guardarInsumo(evento) {
  evento.preventDefault();

  const nuevoInsumo = {
    id: inputId.value
      ? Number(inputId.value)
      : Date.now(),
    nombre: inputNombre.value.trim(),
    categoria: inputCategoria.value,
    cantidad: Number(inputCantidad.value),
    unidad: inputUnidad.value,
    stockMinimo: Number(inputStockMinimo.value),
  };

  const indice = insumos.findIndex(
    (insumo) => insumo.id === nuevoInsumo.id
  );

  if (indice !== -1) {
    insumos[indice] = nuevoInsumo;
  } else {
    insumos.push(nuevoInsumo);
  }

  actualizarInterfaz();
  cerrarModal();
}

function editarInsumo(id) {
  const insumoEncontrado = insumos.find(
    (insumo) => insumo.id === id
  );

  if (insumoEncontrado) {
    abrirModal(insumoEncontrado);
  }
}

function eliminarInsumo(id) {
  const indice = insumos.findIndex(
    (insumo) => insumo.id === id
  );

  if (indice === -1) {
    return;
  }

  const confirmar = window.confirm(
    `¿Querés eliminar el insumo "${insumos[indice].nombre}"?`
  );

  if (!confirmar) {
    return;
  }

  insumos.splice(indice, 1);
  actualizarInterfaz();
}

function actualizarInterfaz() {
  actualizarResumen();
  filtrarInsumos();
}

botonAbrirModal.addEventListener("click", () => abrirModal());

botonesCerrarModal.forEach((boton) => {
  boton.addEventListener("click", cerrarModal);
});

formulario.addEventListener("submit", guardarInsumo);

buscador.addEventListener("input", filtrarInsumos);
filtroCategoria.addEventListener("change", filtrarInsumos);

listaInsumos.addEventListener("click", (evento) => {
  const botonEditar = evento.target.closest("[data-editar]");
  const botonEliminar = evento.target.closest("[data-eliminar]");

  if (botonEditar) {
    editarInsumo(Number(botonEditar.dataset.editar));
  }

  if (botonEliminar) {
    eliminarInsumo(Number(botonEliminar.dataset.eliminar));
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

actualizarInterfaz();