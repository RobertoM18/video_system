const db = require("../../config/db");

class movieRepo {
  static async getAllMovies() {
    try {
      return await db.any(`
        SELECT * FROM movies
      `);
    } catch (error) {
      console.error("Database error:", error);
      throw new Error(`Error fetching movies: ${error.message}`);
    }
  }
}

module.exports = movieRepo;
