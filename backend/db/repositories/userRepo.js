const db = require('../../config/db');

exports.create = async (userData) => {
  const { name, lastname, email, password, phone } = userData;
  
  return db.one(
    'INSERT INTO users (name, lastname, email, password, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, phone',
    [name, lastname, email, password, phone]
  );
};

exports.findByEmail = async (email) => {
  return db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);
};

exports.findById = async (id) => {
  return db.oneOrNone('SELECT id, username, email FROM users WHERE id = $1', [id]);
};

exports.addToFavorites = async (userId, movieId) => {
  return db.none(
    'INSERT INTO user_favorites (id_user, id_movie) VALUES ($1, $2)',
    [userId, movieId]
  );
};

exports.removeFromFavorites = async (userId, movieId) => {
  return db.none(
    'DELETE FROM user_favorites WHERE id_user = $1 AND id_movie = $2',
    [userId, movieId]
  );
};

exports.getFavoriteByUserAndMovie = async (userId, movieId) => {
  return db.oneOrNone(
    'SELECT * FROM user_favorites WHERE id_user = $1 AND id_movie = $2',
    [userId, movieId]
  );
};

exports.getFavoriteMovies = async (userId) => {
  return db.manyOrNone(`
    SELECT m.*, uf.id_user 
    FROM movies m 
    INNER JOIN user_favorites uf ON m.id = uf.id_movie 
    WHERE uf.id_user = $1
    ORDER BY m.title
  `, [userId]);
};
