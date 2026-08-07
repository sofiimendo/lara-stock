require("dotenv").config();

const express = require("express");
const cors = require("cors");

const itemsRouter = require("./routes/items.routes");
const userRouter = require("./routes/user.routes");

const movementsRoutes = require(
  "./routes/movements.routes"
);

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/items", itemsRouter);
app.use("/api/users", userRouter);
app.use(
  "/api/movements",
  movementsRoutes
);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;