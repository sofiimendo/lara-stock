const {
  createMovement,
  getAllMovements,
} = require("../services/movements.service");

const create = (req, res) => {
  try {
    const movement = createMovement(req.body);

    res.status(201).json({
      mensaje: "Movimiento registrado correctamente",
      movimiento: movement,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

const getAll = (req, res) => {
  try {
    const movements = getAllMovements();

    res.json(movements);
  } catch (error) {
    res.status(500).json({
      mensaje: error.message,
    });
  }
};

module.exports = {
  create,
  getAll,
};