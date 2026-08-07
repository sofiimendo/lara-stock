const fs = require("fs");
const path = require("path");

const dataPath = path.join(
  __dirname,
  "../data/movements.json"
);

const getMovements = () => {
  try {
    const data = fs.readFileSync(dataPath, "utf-8");

    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const saveMovements = (movements) => {
  fs.writeFileSync(
    dataPath,
    JSON.stringify(movements, null, 2)
  );
};

module.exports = {
  getMovements,
  saveMovements,
};