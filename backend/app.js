const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/user");
const movieRoutes = require("./routes/movies");
const { errorHandler } = require("./utils/errors");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);
app.use("/api/movies", movieRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use(errorHandler);

module.exports = app;
