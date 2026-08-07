const { randomUUID } = require("crypto");

const {
  getMovements,
  saveMovements,
} = require("../models/movements.model");

const {
  getItems,
  saveItems,
} = require("../models/items.model");

const createMovement = ({
  itemId,
  tipo,
  cantidad,
  motivo,
}) => {
  const items = getItems();

  const item = items.find(
    (item) => String(item.id) === String(itemId)
  );

  if (!item) {
    throw new Error("El insumo no existe");
  }

  if (
    tipo === "salida" &&
    cantidad > item.cantidad
  ) {
    throw new Error(
      "No hay stock suficiente para realizar la salida"
    );
  }

  if (tipo === "entrada") {
    item.cantidad += cantidad;
  } else {
    item.cantidad -= cantidad;
  }

  item.updatedAt = new Date().toISOString();

  saveItems(items);

  const movements = getMovements();

  const movement = {
    id: randomUUID(),
    itemId,
    tipo,
    cantidad,
    motivo: motivo || "",
    fecha: new Date().toISOString(),
  };

  movements.push(movement);

  saveMovements(movements);

  return movement;
};

const getAllMovements = () => {
  return getMovements();
};

module.exports = {
  createMovement,
  getAllMovements,
};