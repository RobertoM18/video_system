const jwt = require("jsonwebtoken");
const config = require("../config/server");

exports.protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Ingrse sesion por favor."
    });
  }
  
  try {
    const token = authHeader.split(" ")[1];
    
    const decoded = jwt.verify(token, config.jwtSecret);
    
    req.user = decoded;
    
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Por favor inica sesion nuevamente. Su token ha expirado."
      });
    }
    
    return res.status(401).json({
      message: "Por favor inica sesion nuevamente. Su token es invalido."
    });
  }
};
