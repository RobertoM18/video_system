const movieModel = require('../db/repositories/movieRepo');

exports.getAllMovies = async (req, res, next) => {
    try {
        const movies = await movieModel.getAllMovies();
        res.status(200).json(movies);
    } catch (error) {
        next(error);
    }
}