const express = require("express");

const movementsController = require(
  "../controllers/movements.controller"
);

const validate = require(
  "../middlewares/validate.middleware"
);

const {
  movementSchema,
} = require("../schemas/movements.schema");

const router = express.Router();

router.get(
  "/",
  movementsController.getAll
);

router.post(
  "/",
  validate(movementSchema),
  movementsController.create
);

module.exports = router;