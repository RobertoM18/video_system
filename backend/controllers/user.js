const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRepo = require( "../db/repositories/userRepo");
const config = require("../config/server");

exports.register = async (req, res, next) => {
  try {
    const { name, lastname, email, password, phone } = req.body;

    const existingUser = await userRepo.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await userRepo.create({
      name,
      lastname,
      email,
      password: hashedPassword,
      phone
    });

    // Generate token
    const token = jwt.sign({ id: newUser.id }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        lastname: newUser.lastname,
        email: newUser.email,
        phone: newUser.phone,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await userRepo.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign({ id: user.id }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.addToFavorites = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { movieId } = req.body;

    const existingFavorite = await userRepo.getFavoriteByUserAndMovie(userId, movieId);
    if (existingFavorite) {
      return res.status(400).json({ message: "La película ya está en favoritos" });
    }

    await userRepo.addToFavorites(userId, movieId);
    res.status(200).json({ message: "Película agregada a favoritos" });
  } catch (error) {
    next(error);
  }
};

exports.removeFromFavorites = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { movieId } = req.params;

    await userRepo.removeFromFavorites(userId, movieId);
    res.status(200).json({ message: "Película eliminada de favoritos" });
  } catch (error) {
    next(error);
  }
};

exports.getFavorites = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const favorites = await userRepo.getFavoriteMovies(userId);
    res.status(200).json(favorites);
  } catch (error) {
    next(error);
  }
};
