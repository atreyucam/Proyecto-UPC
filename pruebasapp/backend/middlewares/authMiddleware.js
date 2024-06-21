import jwt from "jsonwebtoken";
import { secret } from "../config/config.js";

export default (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "No autorizado" });
  }
 
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id_usuario: verified.id_usuario,
      id_rol: verified.id_rol
    };
    
    next();
  } catch (error) {
    console.error("Error al verificar JWT:", error);
    return res.status(401).json({ message: "No autorizado" });
  }
};
