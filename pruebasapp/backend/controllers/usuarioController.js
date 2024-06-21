import Usuario from "../models/Usuario.js";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { usuarioSchema } from "../utils/validationSchemas.js";

// Controlador para crear un nuevo usuario
async function createUsuario(req, res) {
  console.log(req.body);

  try {
    // Validar datos de entrada
    const { error, value } = usuarioSchema.validate(req.body);
    /* if (error) {
      return res.status(400).json({ message: error.details[0].message });
    } */
    const { nombres, apellidos, cedula, email, password, telefono, genero } =
      req.body;


    // Verificar si el email ya está registrado
    const existingUser = await Usuario.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "El correo electrónico ya está registrado" });
    }

    // Verificar si la cédula ya está registrada
    const existingCedula = await Usuario.findOne({ where: { cedula } });
    if (existingCedula) {
      return res.status(400).json({ message: "La cédula ya está registrada" });
    }

    // Subir imagen de perfil
    /* let rutaImagen = null;
    if (req.file) {
      const imagen = req.file;
      const extension = path.extname(imagen.originalname);
      const nombreArchivo = `${uuidv4()}${extension}`;
      rutaImagen = path.join("uploads", nombreArchivo);
      fs.renameSync(imagen.path, rutaImagen);
    } */

    // Hashear la contraseña antes de guardarla en la base de datos
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el nuevo usuario
    const nuevoUsuario = await Usuario.create({
      nombres,
      apellidos,
      cedula,
      email,
      password: hashedPassword,
      telefono,
      //imagen: rutaImagen ? `${process.env.SERVER_HOST}/${rutaImagen}` : null, // Usar la URL de la imagen si se proporcionó
      //fecha_nacimiento,
      id_rol: 1,
      id_estado_usuario: 2,
      genero,
    });

    res.status(201).json(nuevoUsuario);
  } catch (error) {
    console.error("Error al crear un usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

// Controlador para obtener todos los usuarios
async function getAllUsuarios(req, res) {
  try {
    const usuarios = await Usuario.findAll();
    res.status(200).json(usuarios);
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

// Controlador para obtener un usuario por su ID
async function getUsuarioById(req, res) {
  const { id_usuario } = req.params;
  try {
    const usuario = await Usuario.findByPk(id_usuario);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json(usuario);
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

// Controlador para actualizar un usuario por su ID
async function updateUsuario(req, res) {
  const { id_usuario } = req.params;
  const {
    nombres,
    apellidos,
    cedula,
    email,
    password,
    fecha_nacimiento,
    id_rol,
    id_estado_usuario,
    genero,
  } = req.body;

  try {
    const usuario = await Usuario.findByPk(id_usuario);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Subir imagen de perfil
    let rutaImagen = usuario.imagen;
    if (req.file) {
      const imagen = req.file;
      const extension = path.extname(imagen.originalname);
      const nombreArchivo = `${uuidv4()}${extension}`;
      rutaImagen = path.join("uploads", nombreArchivo);
      fs.renameSync(imagen.path, rutaImagen);

      // Eliminar la imagen anterior si existe
      if (usuario.imagen) {
        fs.unlinkSync(usuario.imagen);
      }
    }

    // Hashear la nueva contraseña si se proporciona
    let hashedPassword = usuario.password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    await usuario.update({
      nombres,
      apellidos,
      cedula,
      email,
      password: hashedPassword,
      imagen: rutaImagen ? `${process.env.HOST}/${rutaImagen}` : null,
      fecha_nacimiento,
      id_rol,
      id_estado_usuario,
      genero,
    });

    res.status(200).json(usuario);
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

// Controlador para eliminar un usuario por su ID
async function deleteUsuario(req, res) {
  const { id_usuario } = req.params;
  try {
    const usuario = await Usuario.findByPk(id_usuario);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Eliminar la imagen del usuario si existe
    if (usuario.imagen) {
      fs.unlinkSync(usuario.imagen);
    }

    await usuario.destroy();
    res.status(204).end();
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

export {
  createUsuario,
  getAllUsuarios,
  getUsuarioById,
  updateUsuario,
  deleteUsuario,
};
