const express = require("express");

const itemsController = require("../controllers/items.controller");
const validate = require("../middlewares/validate.middleware");

const {
    createItemSchema,
    updateItemSchema
} = require("../schemas/items.schema");

const router = express.Router();

router.get("/", itemsController.getAllItems);

// 👇 ESTA RUTA TIENE QUE IR ANTES DE "/:id"
router.get("/resumen", itemsController.getItemsSummary);

router.post(
    "/",
    validate(createItemSchema),
    itemsController.createItem
);

router.put(
    "/:id",
    validate(updateItemSchema),
    itemsController.updateItem
);

router.delete("/:id", itemsController.deleteItem);

module.exports = router;