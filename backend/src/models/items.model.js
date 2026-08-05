const fs = require("fs");
const path = require("path");

const itemsPath = path.join(__dirname, "../data/items.json");

const getItems = () => {
    const data = fs.readFileSync(itemsPath, "utf-8");

    return JSON.parse(data);
};

const saveItems = (items) => {
    fs.writeFileSync(
        itemsPath,
        JSON.stringify(items, null, 4)
    );
};

module.exports = {
    getItems,
    saveItems
};