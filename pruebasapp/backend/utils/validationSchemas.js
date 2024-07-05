import Joi from "joi";

export const usuarioSchema = Joi.object({
  nombres: Joi.string().trim().required().messages({
    "any.required": "El campo de nombres es obligatorio",
    "string.empty": "El campo de nombres no puede estar vacío",
    "string.length": "Mínimo 10 caracteres",
  }),
  apellidos: Joi.string().trim().required().messages({
    "any.required": "El campo de apellidos es obligatorio",
    "string.empty": "El campo de apellidos no puede estar vacío",
  }),
  cedula: Joi.string().trim().length(10).pattern(/^\d+$/).required().messages({
    "any.required": "El campo de cedula es obligatorio",
    "string.empty": "El campo de cedula no puede estar vacío",
    "string.length": "La cedula debe tener exactamente 10 caracteres",
    "string.pattern.base": "La cedula solo puede contener números",
  }),
  telefono: Joi.string()
    .trim()
    .length(10)
    .pattern(/^\d+$/)
    .required()
    .messages({
      "any.required": "El campo de telefono es obligatorio",
      "string.empty": "El campo de telefono no puede estar vacío",
      "string.length": "El teléfono debe tener exactamente 10 caracteres",
      "string.pattern.base": "El teléfono solo puede contener números",
    }),
  email: Joi.string().trim().email().required().messages({
    "any.required": "El campo de correo electrónico es obligatorio",
    "string.empty": "El campo de correo electrónico no puede estar vacío",
    "string.email": "El formato del correo electrónico no es válido",
  }),
  password: Joi.string().trim().min(6).required().messages({
    "any.required": "El campo de contraseña es obligatorio",
    "string.empty": "El campo de contraseña no puede estar vacío",
    "string.min": "La contraseña debe tener al menos 6 caracteres",
  }),
  estado_usuario: Joi.string()
    .valid("activo", "inactivo", "suspendido")
    .default("inactivo")
    .messages({
      "any.only": "El estado de usuario debe ser activo, inactivo o suspendido",
    }),
  genero: Joi.string()
    .valid("masculino", "femenino", "otro")
    .required()
    .messages({
      "any.required": "El campo de género es obligatorio",
      "any.only": "El género debe ser masculino, femenino u otro",
    }),

  id_rol: Joi.number().integer().required().messages({
    "any.required": "El campo de rol es obligatorio",
    "number.base": "El campo de rol debe ser un número entero",
  }),
});

export const categoriaSchema = Joi.object({
  nombre: Joi.string().trim().required().messages({
    "any.required": "El campo de nombre es obligatorio",
    "string.empty": "El campo de nombre no puede estar vacío",
  }),
});

export const rolSchema = Joi.object({
  nombre: Joi.string().trim().required().messages({
    "any.required": "El campo de nombre es obligatorio",
    "string.empty": "El campo de nombre no puede estar vacío",
  }),
});

export const publicacionSchema = Joi.object({
  titulo: Joi.string().max(100).required().messages({
    "any.required": "El campo de título es obligatorio",
    "string.empty": "El campo de título no puede estar vacío",
    "string.max": "El campo de título no puede tener más de 100 caracteres",
  }),
  descripcion: Joi.string().max(100).required().messages({
    "any.required": "El campo de descripción es obligatorio",
    "string.empty": "El campo de descripción no puede estar vacío",
    "string.max":
      "El campo de descripción no puede tener más de 100 caracteres",
  }),
  requisitos: Joi.string().allow("").optional().messages({
    "string.base": "El campo de requisitos debe ser un texto",
  }),
  imagen: Joi.string().uri().allow("").optional().messages({
    "string.uri": "El campo de imagen debe ser una URL válida",
  }),
  salario: Joi.number()
    .precision(2)
    .positive()
    .allow(null)
    .optional()
    .messages({
      "number.base": "El campo de salario debe ser un número",
      "number.positive": "El campo de salario debe ser un número positivo",
      "number.precision": "El campo de salario debe tener hasta 2 decimales",
    }),
  estado_publicacion: Joi.string()
    .valid("activo", "inactivo", "suspendido")
    .required()
    .messages({
      "any.required": "El campo de estado de publicación es obligatorio",
      "any.only":
        "El campo de estado de publicación debe ser uno de los siguientes valores: activo, inactivo, suspendido",
    }),
  fecha_publicacion: Joi.date().messages({
    "date.base": "El campo de fecha de publicación debe ser una fecha válida",
  }),
  id_tipo_publicacion: Joi.number()
    .integer()
    .positive()
    .allow(null)
    .optional()
    .messages({
      "number.base":
        "El campo de id_tipo_publicacion debe ser un número entero",
      "number.positive":
        "El campo de id_tipo_publicacion debe ser un número positivo",
    }),
  id_categoria: Joi.number()
    .integer()
    .positive()
    .allow(null)
    .optional()
    .messages({
      "number.base": "El campo de id_categoria debe ser un número entero",
      "number.positive": "El campo de id_categoria debe ser un número positivo",
    }),
  id_ciudad: Joi.number().integer().positive().allow(null).optional().messages({
    "number.base": "El campo de id_ciudad debe ser un número entero",
    "number.positive": "El campo de id_ciudad debe ser un número positivo",
  }),
  id_provincia: Joi.number()
    .integer()
    .positive()
    .allow(null)
    .optional()
    .messages({
      "number.base": "El campo de id_provincia debe ser un número entero",
      "number.positive": "El campo de id_provincia debe ser un número positivo",
    }),
  id_usuario: Joi.number()
    .integer()
    .positive()
    .allow(null)
    .optional()
    .messages({
      "number.base": "El campo de id_usuario debe ser un número entero",
      "number.positive": "El campo de id_usuario debe ser un número positivo",
    }),
});

export const tipoPublicacionSchema = Joi.object({
  nombre: Joi.string().trim().required().messages({
    "any.required": "El campo de nombre es obligatorio",
    "string.empty": "El campo de nombre no puede estar vacío",
  }),
});

export const denunciaSchema = Joi.object({
  id_tipo_denuncia: Joi.number().integer().positive().required().messages({
    "any.required": "El tipo de denuncia es obligatorio",
  }),
  evidencia: Joi.string().max(150).allow(null).trim(),
  descripcion: Joi.string().trim().required().messages({
    "any.required": "La descripción es obligatoria",
    "string.empty": "La descripción no puede estar vacía",
  }),
  latitud: Joi.number().required().messages({
    "any.required": "La latitud es obligatoria",
  }),
  longitud: Joi.number().required().messages({
    "any.required": "La longitud es obligatoria",
  }),
  id_usuario: Joi.number().integer().positive().required().messages({
    "any.required": "El civil es obligatorio",
  }),
  id_gestor: Joi.number().integer().positive().allow(null),
  id_estado_denuncia: Joi.number().integer().positive().required().messages({
    "any.required": "El estado de denuncia es obligatorio",
  }),
});

export const tipoDenunciaSchema = Joi.object({
  nombre: Joi.string().trim().required().messages({
    "any.required": "El nombre es obligatorio",
    "string.empty": "El nombre no puede estar vacío",
  }),
});
