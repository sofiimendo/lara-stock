const itemsService = require("../services/items.service");

const getAllItems = (req, res) => {
    try {
        const items = itemsService.getAllItems(req.query);

        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener los insumos"
        });
    }
};
const getItemsSummary = (req, res) => {
    try {
        const summary = itemsService.getItemsSummary();

        res.status(200).json(summary);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener el resumen del stock"
        });
    }
};
const createItem = (req, res) => {
    try {
        const newItem = itemsService.createItem(req.body);

        res.status(201).json({
            mensaje: "Insumo creado correctamente",
            item: newItem
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al crear el insumo"
        });
    }
};

const updateItem = (req, res) => {
    try {
        const { id } = req.params;

        const updatedItem = itemsService.updateItem(id, req.body);

        if (!updatedItem) {
            return res.status(404).json({
                mensaje: "Insumo no encontrado"
            });
        }

        res.status(200).json({
            mensaje: "Insumo actualizado correctamente",
            item: updatedItem
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al actualizar el insumo"
        });
    }
};
const deleteItem = (req, res) => {
    try {
        const { id } = req.params;

        const deletedItem = itemsService.deleteItem(id);

        if (!deletedItem) {
            return res.status(404).json({
                mensaje: "Insumo no encontrado"
            });
        }

        res.status(200).json({
            mensaje: "Insumo eliminado correctamente",
            item: deletedItem
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar el insumo"
        });
    }
};
module.exports = {
    getAllItems,
    getItemsSummary,
    createItem,
    updateItem,
    deleteItem
};