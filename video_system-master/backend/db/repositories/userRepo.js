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
