exports.errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.code === "23505") {
    return res.status(400).json({ message: "Este email ya esta registrado" });
  }

  res.status(500).json({
    message: "Server error",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Algo salió mal",
  });
};
