// seedData.js
import bcrypt from "bcryptjs";
// utils/initializeDatabase.js
import Rol from "../models/Rol.js";
import Usuario from "../models/Usuario.js";
import Estado_usuario from "../models/Estado_usuario.js";
import Provincia from "../models/Provincia.js";
import Ciudad from "../models/Ciudad.js";
import Zona from "../models/Zona.js";
import Estacion from "../models/Estacion.js";
import Policia from "../models/Policia.js";
import Usuario_rol from "../models/Usuario_rol.js";
import Estado_denuncia from "../models/Estado_denuncia.js";
import TipoDenuncia from "../models/TipoDenuncia.js";
import Denuncia from "../models/Denuncia.js";

const initializeDatabase = async () => {
  try {
    await initializeRoles();
    await initializeZonas();
    await initializeEstaciones();
    await initializeEstadoUsuario();
    await initializeTipoDenuncia();
    await initializeEstadoDenuncia();
    await initializeUsuarios();
    await initializePolicias();
    await initializeUsuariosRoles();
    await initializeDenuncias();
    await initializeProvincias();
    await initializeCiudades();
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

const initializeRoles = async () => {
  const existingRoles = await Rol.findAll();
  if (existingRoles.length === 0) {
    const roles = [
      { id_rol: 1, nombre: "SUPERADMIN" },
      { id_rol: 2, nombre: "ADMIN" },
      { id_rol: 3, nombre: "POLICIA" },
      { id_rol: 4, nombre: "CIVIL" },
    ];
    await Rol.bulkCreate(roles);
    console.log("Roles iniciales creados.");
  } else {
    console.log("Roles ya existen.");
  }
};

const initializeZonas = async () => {
  const existingZonas = await Zona.findAll();
  if (existingZonas.length === 0) {
    const zonas = [
      { id_zona: 1, nombre: "Zona 1" },
      { id_zona: 2, nombre: "Zona 2" },
      { id_zona: 3, nombre: "Zona 3" },
    ];

    await Zona.bulkCreate(zonas);
    console.log("Zonas iniciales creadas.");
  } else {
    console.log("Zonas iniciales ya existen.");
  }
};

const initializeEstaciones = async () => {
  const existingEstaciones = await Estacion.findAll();
  if (existingEstaciones.length === 0) {
    const estaciones = [
      { id_estacion: 1, nombre: "Estación 1", direccion: "Dirección 1" },
      { id_estacion: 2, nombre: "Estación 2", direccion: "Dirección 2" },
      { id_estacion: 3, nombre: "Estación 3", direccion: "Dirección 3" },
    ];

    await Estacion.bulkCreate(estaciones);
    console.log("Estaciones iniciales creadas.");
  } else {
    console.log("Estaciones iniciales ya existen.");
  }
};

const initializeEstadoUsuario = async () => {
  const existingEstadoUsuario = await Estado_usuario.findAll();
  if (existingEstadoUsuario.length === 0) {
    const estados = [
      { id_estado_usuario: 1, nombre: "ACTIVO" },
      { id_estado_usuario: 2, nombre: "INACTIVO" },
    ];
    await Estado_usuario.bulkCreate(estados);
    console.log("Estados de usuario iniciales creados.");
  } else {
    console.log("Estados de usuario ya existen.");
  }
};

const initializeEstadoDenuncia = async () => {
  const existingEstadosDenuncia = await Estado_denuncia.findAll();
  if (existingEstadosDenuncia.length === 0) {
    const estadosDenuncia = [
      { id_estado_denuncia: 1, nombre: "PENDIENTE" },
      { id_estado_denuncia: 2, nombre: "EN PROCESO" },
      { id_estado_denuncia: 3, nombre: "RESUELTA" },
      { id_estado_denuncia: 4, nombre: "CERRADA" },
    ];
    await Estado_denuncia.bulkCreate(estadosDenuncia);
    console.log("Estados de denuncia iniciales creados.");
  } else {
    console.log("Estados de denuncia ya existen.");
  }
};

const initializeTipoDenuncia = async () => {
  const existingTiposDenuncia = await TipoDenuncia.findAll();
  if (existingTiposDenuncia.length === 0) {
    const tiposDenuncia = [
      { id_tipo_denuncia: 1, nombre: "Robo" },
      { id_tipo_denuncia: 2, nombre: "Acoso" },
      { id_tipo_denuncia: 3, nombre: "Fraude" },
      { id_tipo_denuncia: 4, nombre: "Maltrato animal" },
      { id_tipo_denuncia: 5, nombre: "Otros" },
    ];
    await TipoDenuncia.bulkCreate(tiposDenuncia);
    console.log("Tipos de denuncia iniciales creados.");
  } else {
    console.log("Tipos de denuncia ya existen.");
  }
};

const initializeUsuarios = async () => {
  const existingUsuarios = await Usuario.findAll({ limit: 3 }); // Verificar si ya existen usuarios
  if (existingUsuarios.length === 0) {
    const hashedPassword = await bcrypt.hash("123456", 10); // Reemplaza '123456' con la contraseña real

    const usuarios = [
      {
        nombres: "Nombre1",
        apellidos: "Apellidos1",
        cedula: "1234567890",
        genero: "masculino",
        telefono: "1234567890",
        email: "usuario1@example.com",
        password: hashedPassword,
        id_estado_usuario: 1,
      },
      {
        nombres: "Nombre2",
        apellidos: "Apellidos2",
        cedula: "0987654321",
        genero: "femenino",
        telefono: "1234567891",
        email: "usuario2@example.com",
        password: hashedPassword,
        id_estado_usuario: 1,
      },
      {
        nombres: "Nombre3",
        apellidos: "Apellidos3",
        cedula: "1357924680",
        telefono: "1234567893",
        genero: "masculino",
        email: "usuario3@example.com",
        password: hashedPassword,
        id_estado_usuario: 1,
      },
      {
        nombres: "Nombre4",
        apellidos: "Apellidos4",
        cedula: "2468135790",
        genero: "masculino",
        telefono: "1234567894",
        email: "usuario4@example.com",
        password: hashedPassword,
        id_estado_usuario: 1,
      },
      {
        nombres: "Nombre5",
        apellidos: "Apellidos5",
        cedula: "2568135790",
        genero: "masculino",
        telefono: "1235567895",
        email: "usuario5@example.com",
        password: hashedPassword,
        id_estado_usuario: 1,
      },
      {
        nombres: "Nombre6",
        apellidos: "Apellidos6",
        cedula: "2668135790",
        genero: "masculino",
        telefono: "1236567896",
        email: "usuario6@example.com",
        password: hashedPassword,
        id_estado_usuario: 1,
      },
    ];

    await Usuario.bulkCreate(usuarios);
    console.log("Usuarios iniciales creados.");
  } else {
    console.log("Usuarios iniciales ya existen.");
  }
};

const initializePolicias = async () => {
  const existingPolicias = await Policia.findAll({ limit: 3 });
  if (existingPolicias.length === 0) {
    const policias = [
      {
        id_usuario: 1,
        rango: "Sargento",
        placa: "ABC123",
        id_estacion: 1,
        id_zona: 1,
      },
      {
        id_usuario: 2,
        rango: "Teniente",
        placa: "XYZ789",
        id_estacion: 2,
        id_zona: 2,
      },
      {
        id_usuario: 3,
        rango: "Capitán",
        placa: "LMN456",
        id_estacion: 3,
        id_zona: 3,
      },
    ];

    await Policia.bulkCreate(policias);
    console.log("Policías iniciales creados.");
  } else {
    console.log("Policías iniciales ya existen.");
  }
};

const initializeUsuariosRoles = async () => {
  const existingUsuariosRoles = await Usuario_rol.findAll();
  if (existingUsuariosRoles.length === 0) {
    const usuariosRoles = [
      { id_usuario: 1, id_rol: 1 },
      { id_usuario: 2, id_rol: 2 },
      { id_usuario: 2, id_rol: 3 },
      { id_usuario: 2, id_rol: 4 },
      { id_usuario: 3, id_rol: 3 },
      { id_usuario: 3, id_rol: 4 },
      { id_usuario: 4, id_rol: 4 },
      { id_usuario: 5, id_rol: 4 },
      { id_usuario: 6, id_rol: 4 },
    ];

    await Usuario_rol.bulkCreate(usuariosRoles);
    console.log("Usuarios_Roles iniciales creados.");
  } else {
    console.log("Usuarios_Roles iniciales ya existen.");
  }
};

const initializeDenuncias = async () => {
  const existingDenuncias = await Denuncia.findAll();
  if (existingDenuncias.length === 0) {
    const denuncias = [
      {
        id_tipo_denuncia: 1,
        evidencia: "https://ejemplo.com/evidencia1.jpg",
        descripcion: "Robo reportado en la calle principal.",
        latitud: 40.7128,
        longitud: -74.006,
        id_usuario: 1,
        id_estado_denuncia: 1,
      },
      {
        id_tipo_denuncia: 2,
        evidencia: "https://ejemplo.com/evidencia2.jpg",
        descripcion: "Acoso verbal en el parque central.",
        latitud: 34.0522,
        longitud: -118.2437,
        id_usuario: 2,
        id_estado_denuncia: 2,
      },
      {
        id_tipo_denuncia: 3,
        evidencia: "https://ejemplo.com/evidencia3.jpg",
        descripcion: "Fraude bancario reportado por teléfono.",
        latitud: 51.5074,
        longitud: -0.1278,
        id_usuario: 3,
        id_estado_denuncia: 1,
      },
    ];

    await Denuncia.bulkCreate(denuncias);
    console.log("Denuncias iniciales creadas.");
  } else {
    console.log("Denuncias iniciales ya existen.");
  }
};

const initializeProvincias = async () => {
  try {
    const existingProvincias = await Provincia.findAll();
    if (existingProvincias.length === 0) {
      const provincias = [
        { id_provincia: 1, nombre: "Azuay" },
        { id_provincia: 2, nombre: "Bolívar" },
        { id_provincia: 3, nombre: "Cañar" },
        { id_provincia: 4, nombre: "Carchi" },
        { id_provincia: 5, nombre: "Cotopaxi" },
        { id_provincia: 6, nombre: "Chimborazo" },
        { id_provincia: 7, nombre: "El Oro" },
        { id_provincia: 8, nombre: "Esmeraldas" },
        { id_provincia: 9, nombre: "Guayas" },
        { id_provincia: 10, nombre: "Imbabura" },
        { id_provincia: 11, nombre: "Loja" },
        { id_provincia: 12, nombre: "Los Rios" },
        { id_provincia: 13, nombre: "Manabí" },
        { id_provincia: 14, nombre: "Morona Santiago" },
        { id_provincia: 15, nombre: "Napo" },
        { id_provincia: 16, nombre: "Pastaza" },
        { id_provincia: 17, nombre: "Pichincha" },
        { id_provincia: 18, nombre: "Tungurahua" },
        { id_provincia: 19, nombre: "Zamora Chinchipe" },
        { id_provincia: 20, nombre: "Galápagos" },
        { id_provincia: 21, nombre: "Sucumbíos" },
        { id_provincia: 22, nombre: "Orellana" },
        { id_provincia: 23, nombre: "Santo Domingo de Los Tsáchilas" },
        { id_provincia: 24, nombre: "Santa Elena" },
        { id_provincia: 25, nombre: "Zonas No Delimitadas" },
      ];
      await Provincia.bulkCreate(provincias);
      console.log("Provincias iniciales creadas.");
    } else {
      console.log("Las provincias iniciales ya existen.");
    }
  } catch (error) {
    console.error("Error al inicializar provincias:", error);
  }
};

const initializeCiudades = async () => {
  try {
    const existingCiudades = await Ciudad.findAll();
    if (existingCiudades.length === 0) {
      const ciudades = [
        { id_ciudad: 1, nombre: "Cuenca", id_provincia: 1 },
        { id_ciudad: 2, nombre: "Girón", id_provincia: 1 },
        { id_ciudad: 3, nombre: "Gualaceo", id_provincia: 1 },
        { id_ciudad: 4, nombre: "Nabón", id_provincia: 1 },
        { id_ciudad: 5, nombre: "Paute", id_provincia: 1 },
        { id_ciudad: 6, nombre: "Pucara", id_provincia: 1 },
        { id_ciudad: 7, nombre: "San Fernando", id_provincia: 1 },
        { id_ciudad: 8, nombre: "Santa Isabel", id_provincia: 1 },
        { id_ciudad: 9, nombre: "Sigsig", id_provincia: 1 },
        { id_ciudad: 10, nombre: "Oña", id_provincia: 1 },
        { id_ciudad: 11, nombre: "Chordeleg", id_provincia: 1 },
        { id_ciudad: 12, nombre: "El Pan", id_provincia: 1 },
        { id_ciudad: 13, nombre: "Sevilla de Oro", id_provincia: 1 },
        { id_ciudad: 14, nombre: "Guachapala", id_provincia: 1 },
        { id_ciudad: 15, nombre: "Camilo Ponce Enríquez", id_provincia: 1 },
        { id_ciudad: 16, nombre: "Guaranda", id_provincia: 2 },
        { id_ciudad: 17, nombre: "Chillanes", id_provincia: 2 },
        { id_ciudad: 18, nombre: "Chimbo", id_provincia: 2 },
        { id_ciudad: 19, nombre: "Echeandía", id_provincia: 2 },
        { id_ciudad: 20, nombre: "San Miguel", id_provincia: 2 },
        { id_ciudad: 21, nombre: "Caluma", id_provincia: 2 },
        { id_ciudad: 22, nombre: "Las Naves", id_provincia: 2 },
        { id_ciudad: 23, nombre: "Azogues", id_provincia: 3 },
        { id_ciudad: 24, nombre: "Biblián", id_provincia: 3 },
        { id_ciudad: 25, nombre: "Cañar", id_provincia: 3 },
        { id_ciudad: 26, nombre: "La Troncal", id_provincia: 3 },
        { id_ciudad: 27, nombre: "El Tambo", id_provincia: 3 },
        { id_ciudad: 28, nombre: "Déleg", id_provincia: 3 },
        { id_ciudad: 29, nombre: "Suscal", id_provincia: 3 },
        { id_ciudad: 30, nombre: "Tulcán", id_provincia: 4 },
        { id_ciudad: 31, nombre: "Bolívar", id_provincia: 4 },
        { id_ciudad: 32, nombre: "Espejo", id_provincia: 4 },
        { id_ciudad: 33, nombre: "Mira", id_provincia: 4 },
        { id_ciudad: 34, nombre: "Montúfar", id_provincia: 4 },
        { id_ciudad: 35, nombre: "San Pedro de Huaca", id_provincia: 4 },
        { id_ciudad: 36, nombre: "Latacunga", id_provincia: 5 },
        { id_ciudad: 37, nombre: "La Maná", id_provincia: 5 },
        { id_ciudad: 38, nombre: "Pangua", id_provincia: 5 },
        { id_ciudad: 39, nombre: "Pujilí", id_provincia: 5 },
        { id_ciudad: 40, nombre: "Salcedo", id_provincia: 5 },
        { id_ciudad: 41, nombre: "Saquisilí", id_provincia: 5 },
        { id_ciudad: 42, nombre: "Sigchos", id_provincia: 5 },
        { id_ciudad: 43, nombre: "Riobamba", id_provincia: 6 },
        { id_ciudad: 44, nombre: "Alausí", id_provincia: 6 },
        { id_ciudad: 45, nombre: "Colta", id_provincia: 6 },
        { id_ciudad: 46, nombre: "Chambo", id_provincia: 6 },
        { id_ciudad: 47, nombre: "Chunchi", id_provincia: 6 },
        { id_ciudad: 48, nombre: "Guamote", id_provincia: 6 },
        { id_ciudad: 49, nombre: "Guano", id_provincia: 6 },
        { id_ciudad: 50, nombre: "Pallatanga", id_provincia: 6 },
        { id_ciudad: 51, nombre: "Penipe", id_provincia: 6 },
        { id_ciudad: 52, nombre: "Cumandá", id_provincia: 6 },
        { id_ciudad: 53, nombre: "Machala", id_provincia: 7 },
        { id_ciudad: 54, nombre: "Arenillas", id_provincia: 7 },
        { id_ciudad: 55, nombre: "Atahualpa", id_provincia: 7 },
        { id_ciudad: 56, nombre: "Balsas", id_provincia: 7 },
        { id_ciudad: 57, nombre: "Chilla", id_provincia: 7 },
        { id_ciudad: 58, nombre: "El Guabo", id_provincia: 7 },
        { id_ciudad: 59, nombre: "Huaquillas", id_provincia: 7 },
        { id_ciudad: 60, nombre: "Marcabelí", id_provincia: 7 },
        { id_ciudad: 61, nombre: "Pasaje", id_provincia: 7 },
        { id_ciudad: 62, nombre: "Piñas", id_provincia: 7 },
        { id_ciudad: 63, nombre: "Portovelo", id_provincia: 7 },
        { id_ciudad: 64, nombre: "Santa Rosa", id_provincia: 7 },
        { id_ciudad: 65, nombre: "Zaruma", id_provincia: 7 },
        { id_ciudad: 66, nombre: "Las Lajas", id_provincia: 7 },
        { id_ciudad: 67, nombre: "Esmeraldas", id_provincia: 8 },
        { id_ciudad: 68, nombre: "Eloy Alfaro", id_provincia: 8 },
        { id_ciudad: 69, nombre: "Muisne", id_provincia: 8 },
        { id_ciudad: 70, nombre: "Quinindé", id_provincia: 8 },
        { id_ciudad: 71, nombre: "San Lorenzo", id_provincia: 8 },
        { id_ciudad: 72, nombre: "Atacames", id_provincia: 8 },
        { id_ciudad: 73, nombre: "Rioverde", id_provincia: 8 },
        { id_ciudad: 74, nombre: "La Concordia", id_provincia: 8 },
        { id_ciudad: 75, nombre: "Guayaquil", id_provincia: 9 },
        {
          id_ciudad: 76,
          nombre: "Alfredo Baquerizo Moreno (Juján)",
          id_provincia: 9,
        },
        { id_ciudad: 77, nombre: "Balao", id_provincia: 9 },
        { id_ciudad: 78, nombre: "Balzar", id_provincia: 9 },
        { id_ciudad: 79, nombre: "Colimes", id_provincia: 9 },
        { id_ciudad: 80, nombre: "Daule", id_provincia: 9 },
        { id_ciudad: 81, nombre: "Durán", id_provincia: 9 },
        { id_ciudad: 82, nombre: "El Empalme", id_provincia: 9 },
        { id_ciudad: 83, nombre: "El Triunfo", id_provincia: 9 },
        { id_ciudad: 84, nombre: "Milagro", id_provincia: 9 },
        { id_ciudad: 85, nombre: "Naranjal", id_provincia: 9 },
        { id_ciudad: 86, nombre: "Naranjito", id_provincia: 9 },
        { id_ciudad: 87, nombre: "Palestina", id_provincia: 9 },
        { id_ciudad: 88, nombre: "Pedro Carbo", id_provincia: 9 },
        { id_ciudad: 89, nombre: "Samborondón", id_provincia: 9 },
        { id_ciudad: 90, nombre: "Santa Lucía", id_provincia: 9 },
        { id_ciudad: 91, nombre: "Salitre (Urbina Jado)", id_provincia: 9 },
        { id_ciudad: 92, nombre: "San Jacinto de Yaguachi", id_provincia: 9 },
        { id_ciudad: 93, nombre: "Playas", id_provincia: 9 },
        { id_ciudad: 94, nombre: "Simón Bolívar", id_provincia: 9 },
        {
          id_ciudad: 95,
          nombre: "Coronel Marcelino Maridueña",
          id_provincia: 9,
        },
        { id_ciudad: 96, nombre: "Lomas de Sargentillo", id_provincia: 9 },
        { id_ciudad: 97, nombre: "Nobol", id_provincia: 9 },
        { id_ciudad: 98, nombre: "General Antonio Elizalde", id_provincia: 9 },
        { id_ciudad: 99, nombre: "Isidro Ayora", id_provincia: 9 },
        { id_ciudad: 100, nombre: "Ibarra", id_provincia: 10 },
        { id_ciudad: 101, nombre: "Antonio Ante", id_provincia: 10 },
        { id_ciudad: 102, nombre: "Cotacachi", id_provincia: 10 },
        { id_ciudad: 103, nombre: "Otavalo", id_provincia: 10 },
        { id_ciudad: 104, nombre: "Pimampiro", id_provincia: 10 },
        { id_ciudad: 105, nombre: "San Miguel de Urcuquí", id_provincia: 10 },
        { id_ciudad: 106, nombre: "Loja", id_provincia: 11 },
        { id_ciudad: 107, nombre: "Calvas", id_provincia: 11 },
        { id_ciudad: 108, nombre: "Catamayo", id_provincia: 11 },
        { id_ciudad: 109, nombre: "Celica", id_provincia: 11 },
        { id_ciudad: 110, nombre: "Chaguarpamba", id_provincia: 11 },
        { id_ciudad: 111, nombre: "Espíndola", id_provincia: 11 },
        { id_ciudad: 112, nombre: "Gonzanamá", id_provincia: 11 },
        { id_ciudad: 113, nombre: "Macará", id_provincia: 11 },
        { id_ciudad: 114, nombre: "Paltas", id_provincia: 11 },
        { id_ciudad: 115, nombre: "Puyango", id_provincia: 11 },
        { id_ciudad: 116, nombre: "Saraguro", id_provincia: 11 },
        { id_ciudad: 117, nombre: "Sozoranga", id_provincia: 11 },
        { id_ciudad: 118, nombre: "Zapotillo", id_provincia: 11 },
        { id_ciudad: 119, nombre: "Pindal", id_provincia: 11 },
        { id_ciudad: 120, nombre: "Quilanga", id_provincia: 11 },
        { id_ciudad: 121, nombre: "Olmedo", id_provincia: 11 },
        { id_ciudad: 122, nombre: "Babahoyo", id_provincia: 12 },
        { id_ciudad: 123, nombre: "Baba", id_provincia: 12 },
        { id_ciudad: 124, nombre: "Montalvo", id_provincia: 12 },
        { id_ciudad: 125, nombre: "Puebloviejo", id_provincia: 12 },
        { id_ciudad: 126, nombre: "Quevedo", id_provincia: 12 },
        { id_ciudad: 127, nombre: "Urdaneta", id_provincia: 12 },
        { id_ciudad: 128, nombre: "Ventanas", id_provincia: 12 },
        { id_ciudad: 129, nombre: "Vínces", id_provincia: 12 },
        { id_ciudad: 130, nombre: "Palenque", id_provincia: 12 },
        { id_ciudad: 131, nombre: "Buena Fé", id_provincia: 12 },
        { id_ciudad: 132, nombre: "Valencia", id_provincia: 12 },
        { id_ciudad: 133, nombre: "Mocache", id_provincia: 12 },
        { id_ciudad: 134, nombre: "Quinsaloma", id_provincia: 12 },
        { id_ciudad: 135, nombre: "Portoviejo", id_provincia: 13 },
        { id_ciudad: 136, nombre: "Bolívar", id_provincia: 13 },
        { id_ciudad: 137, nombre: "Chone", id_provincia: 13 },
        { id_ciudad: 138, nombre: "El Carmen", id_provincia: 13 },
        { id_ciudad: 139, nombre: "Flavio Alfaro", id_provincia: 13 },
        { id_ciudad: 140, nombre: "Jipijapa", id_provincia: 13 },
        { id_ciudad: 141, nombre: "Junín", id_provincia: 13 },
        { id_ciudad: 142, nombre: "Manta", id_provincia: 13 },
        { id_ciudad: 143, nombre: "Montecristi", id_provincia: 13 },
        { id_ciudad: 144, nombre: "Paján", id_provincia: 13 },
        { id_ciudad: 145, nombre: "Pichincha", id_provincia: 13 },
        { id_ciudad: 146, nombre: "Rocafuerte", id_provincia: 13 },
        { id_ciudad: 147, nombre: "Santa Ana", id_provincia: 13 },
        { id_ciudad: 148, nombre: "Sucre", id_provincia: 13 },
        { id_ciudad: 149, nombre: "Tosagua", id_provincia: 13 },
        { id_ciudad: 150, nombre: "24 de Mayo", id_provincia: 13 },
        { id_ciudad: 151, nombre: "Pedernales", id_provincia: 13 },
        { id_ciudad: 152, nombre: "Olmedo", id_provincia: 13 },
        { id_ciudad: 153, nombre: "Puerto López", id_provincia: 13 },
        { id_ciudad: 154, nombre: "Jama", id_provincia: 13 },
        { id_ciudad: 155, nombre: "Jaramijó", id_provincia: 13 },
        { id_ciudad: 156, nombre: "San Vicente", id_provincia: 13 },
        { id_ciudad: 157, nombre: "Morona", id_provincia: 14 },
        { id_ciudad: 158, nombre: "Gualaquiza", id_provincia: 14 },
        { id_ciudad: 159, nombre: "Limón Indanza", id_provincia: 14 },
        { id_ciudad: 160, nombre: "Palora", id_provincia: 14 },
        { id_ciudad: 161, nombre: "Santiago", id_provincia: 14 },
        { id_ciudad: 162, nombre: "Sucúa", id_provincia: 14 },
        { id_ciudad: 163, nombre: "Huamboya", id_provincia: 14 },
        { id_ciudad: 164, nombre: "San Juan Bosco", id_provincia: 14 },
        { id_ciudad: 165, nombre: "Taisha", id_provincia: 14 },
        { id_ciudad: 166, nombre: "Logroño", id_provincia: 14 },
        { id_ciudad: 167, nombre: "Pablo Sexto", id_provincia: 14 },
        { id_ciudad: 168, nombre: "Tiwintza", id_provincia: 14 },
        { id_ciudad: 169, nombre: "Tena", id_provincia: 15 },
        { id_ciudad: 170, nombre: "Archidona", id_provincia: 15 },
        { id_ciudad: 171, nombre: "El Chaco", id_provincia: 15 },
        { id_ciudad: 172, nombre: "Quijos", id_provincia: 15 },
        {
          id_ciudad: 173,
          nombre: "Carlos Julio Arosemena Tola",
          id_provincia: 15,
        },
        { id_ciudad: 174, nombre: "Pastaza", id_provincia: 16 },
        { id_ciudad: 175, nombre: "Mera", id_provincia: 16 },
        { id_ciudad: 176, nombre: "Santa Clara", id_provincia: 16 },
        { id_ciudad: 177, nombre: "Arajuno", id_provincia: 16 },
        { id_ciudad: 178, nombre: "Quito", id_provincia: 17 },
        { id_ciudad: 179, nombre: "Cayambe", id_provincia: 17 },
        { id_ciudad: 180, nombre: "Mejia", id_provincia: 17 },
        { id_ciudad: 181, nombre: "Pedro Moncayo", id_provincia: 17 },
        { id_ciudad: 182, nombre: "Rumiñahui", id_provincia: 17 },
        {
          id_ciudad: 183,
          nombre: "San Miguel de Los Bancos",
          id_provincia: 17,
        },
        { id_ciudad: 184, nombre: "Pedro Vicente Maldonado", id_provincia: 17 },
        { id_ciudad: 185, nombre: "Puerto Quito", id_provincia: 17 },
        { id_ciudad: 186, nombre: "Ambato", id_provincia: 18 },
        { id_ciudad: 187, nombre: "Baños de Agua Santa", id_provincia: 18 },
        { id_ciudad: 188, nombre: "Cevallos", id_provincia: 18 },
        { id_ciudad: 189, nombre: "Mocha", id_provincia: 18 },
        { id_ciudad: 190, nombre: "Patate", id_provincia: 18 },
        { id_ciudad: 191, nombre: "Quero", id_provincia: 18 },
        { id_ciudad: 192, nombre: "San Pedro de Pelileo", id_provincia: 18 },
        { id_ciudad: 193, nombre: "Santiago de Píllaro", id_provincia: 18 },
        { id_ciudad: 194, nombre: "Tisaleo", id_provincia: 18 },
        { id_ciudad: 195, nombre: "Zamora", id_provincia: 19 },
        { id_ciudad: 196, nombre: "Chinchipe", id_provincia: 19 },
        { id_ciudad: 197, nombre: "Nangaritza", id_provincia: 19 },
        { id_ciudad: 198, nombre: "Yacuambi", id_provincia: 19 },
        { id_ciudad: 199, nombre: "Yantzaza (Yanzatza)", id_provincia: 19 },
        { id_ciudad: 200, nombre: "El Pangui", id_provincia: 19 },
        { id_ciudad: 201, nombre: "Centinela del Cóndor", id_provincia: 19 },
        { id_ciudad: 202, nombre: "Palanda", id_provincia: 19 },
        { id_ciudad: 203, nombre: "Paquisha", id_provincia: 19 },
        { id_ciudad: 204, nombre: "San Cristóbal", id_provincia: 20 },
        { id_ciudad: 205, nombre: "Isabela", id_provincia: 20 },
        { id_ciudad: 206, nombre: "Santa Cruz", id_provincia: 20 },
        { id_ciudad: 207, nombre: "Lago Agrio", id_provincia: 21 },
        { id_ciudad: 208, nombre: "Gonzalo Pizarro", id_provincia: 21 },
        { id_ciudad: 209, nombre: "Putumayo", id_provincia: 21 },
        { id_ciudad: 210, nombre: "Shushufindi", id_provincia: 21 },
        { id_ciudad: 211, nombre: "Sucumbíos", id_provincia: 21 },
        { id_ciudad: 212, nombre: "Cascales", id_provincia: 21 },
        { id_ciudad: 213, nombre: "Cuyabeno", id_provincia: 21 },
        { id_ciudad: 214, nombre: "Orellana", id_provincia: 22 },
        { id_ciudad: 215, nombre: "Aguarico", id_provincia: 22 },
        { id_ciudad: 216, nombre: "La Joya de Los Sachas", id_provincia: 22 },
        { id_ciudad: 217, nombre: "Loreto", id_provincia: 22 },
        { id_ciudad: 218, nombre: "Santo Domingo", id_provincia: 23 },
        { id_ciudad: 219, nombre: "Santa Elena", id_provincia: 24 },
        { id_ciudad: 220, nombre: "La Libertad", id_provincia: 24 },
        { id_ciudad: 221, nombre: "Salinas", id_provincia: 24 },
        { id_ciudad: 222, nombre: "Las Golondrinas", id_provincia: 25 },
        { id_ciudad: 223, nombre: "Manga del Cura", id_provincia: 25 },
        { id_ciudad: 224, nombre: "El Piedrero", id_provincia: 25 },
      ];
      await Ciudad.bulkCreate(ciudades);
      console.log("Ciudades iniciales creadas.");
    } else {
      console.log("Las ciudades iniciales ya existen.");
    }
  } catch (error) {
    console.error("Error al inicializar ciudades:", error);
  }
};

export default initializeDatabase;
