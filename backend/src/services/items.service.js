const { v4: uuidv4 } = require("uuid");

const itemsModel = require("../models/items.model");

const getAllItems = (filters = {}) => {
    const items = itemsModel.getItems();

    const {
        nombre,
        categoria,
        stock
    } = filters;

    return items.filter((item) => {
        const matchesNombre =
            !nombre ||
            item.nombre
                .toLowerCase()
                .includes(nombre.toLowerCase());

        const matchesCategoria =
            !categoria ||
            item.categoria.toLowerCase() === categoria.toLowerCase();

        const matchesStock =
            !stock ||
            (stock.toLowerCase() === "bajo" &&
                item.cantidad > 0 &&
                item.cantidad <= item.stockMinimo) ||
            (stock.toLowerCase() === "disponible" &&
                item.cantidad > item.stockMinimo) ||
            (stock.toLowerCase() === "agotado" &&
                item.cantidad === 0);

        return (
            matchesNombre &&
            matchesCategoria &&
            matchesStock
        );
    });
};
const getItemsSummary = () => {
    const items = itemsModel.getItems();

    const totalInsumos = items.length;

    const sinStock = items.filter(
        (item) => item.cantidad === 0
    ).length;

    const stockBajo = items.filter(
        (item) =>
            item.cantidad > 0 &&
            item.cantidad <= item.stockMinimo
    ).length;

    const disponibles = items.filter(
        (item) => item.cantidad > item.stockMinimo
    ).length;

    return {
        totalInsumos,
        stockBajo,
        sinStock,
        disponibles
    };
};
const createItem = (itemData) => {
    const items = itemsModel.getItems();

    const newItem = {
        id: uuidv4(),
        ...itemData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    items.push(newItem);
    itemsModel.saveItems(items);

    return newItem;
};

const updateItem = (id, itemData) => {
    const items = itemsModel.getItems();

    const index = items.findIndex((item) => String(item.id) === String(id));

    if (index === -1) {
        return null;
    }

    items[index] = {
        ...items[index],
        ...itemData,
        id: items[index].id,
        updatedAt: new Date().toISOString()
    };

    itemsModel.saveItems(items);

    return items[index];
};
const deleteItem = (id) => {
    const items = itemsModel.getItems();

    const itemExists = items.find((item) => item.id === id);

    if (!itemExists) {
        return null;
    }

    const filteredItems = items.filter((item) => item.id !== id);

    itemsModel.saveItems(filteredItems);

    return itemExists;
};

module.exports = {
    getAllItems,
    getItemsSummary,
    createItem,
    updateItem,
    deleteItem
};