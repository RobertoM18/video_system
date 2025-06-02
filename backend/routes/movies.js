const express = require("express");
const movieController = require("../controllers/movies");

const router = express.Router();

router.get("/", movieController.getAllMovies);

module.exports = router;