const { sequelize } = require("./database");
const { QueryTypes } = require("sequelize");
const bcrypt = require("bcrypt");

const initData = async () => {
  try {
    console.log("Verificando si los datos ya están en la base de datos...");

    // Verificar si los eventos ya existen
    const eventosCount = await sequelize.query(
      'SELECT COUNT(*) FROM public."Evento";',
      { type: QueryTypes.SELECT }
    );

    if (parseInt(eventosCount[0].count) > 0) {
      console.log("Los datos ya están en la base de datos. No se requiere inserción.");
      return;
    }

    console.log("Insertando datos iniciales...");

    // Insertar eventos
    await sequelize.query(`
      INSERT INTO public."Evento"(evento) VALUES
        ('Un ciudadano ha presionado el boton de emergencia.'),
        ('Un ciudadano ha creado una denuncia ciudadana.'),
        ('Un ciudadano ha creado una solicitud de servicio comunitario.'),
        ('Una patrulla va a su ubicación.'),
        ('La patrulla ha llegado a su ubicación.'),
        ('Se ha resuelto la solicitud de emergencia.'),
        ('Has sido asignado a la solicitud de emergencia.'),
        ('El policía ha registrado una observación.'),
        ('El botón de emergencia ha sido registrado como falso.'),
        ('Has sido asignado a una solicitud.'),
        ('Se ha asignado a un policía a tu solicitud.'),
        ('Se ha cancelado la solicitud por parte del ciudadano.'),
        ('El policía asignado ha sido retirado de la solicitud por parte del administrador.'),
        ('Se ha resuelto tu solicitud.'),
        ('Tu solicitud ha sido registrada como falsa.'),
        ('Se ha agregado una observacion.');
    `);

    // Insertar TipoSolicitud
    await sequelize.query(`
      INSERT INTO public."TipoSolicitud"(descripcion) VALUES
        ('Botón de emergencia'),
        ('Denuncia Ciudadana'),
        ('Servicios comunitarios');
    `);

    // Insertar Estado
    await sequelize.query(`
      INSERT INTO public."Estado"(descripcion) VALUES
        ('Pendiente'),
        ('En progreso'),
        ('Resuelto'),
        ('Falso');
    `);

    // Insertar Roles
    await sequelize.query(`
      INSERT INTO public."Rol"(descripcion) VALUES
        ('superAdmin'),
        ('Admin'),
        ('Policia'),
        ('Ciudadano');
    `);

    // Insertar Zonas
    await sequelize.query(`
      INSERT INTO public."Zonas" (id_zona, nombre_zona) VALUES (1, 'Zona 2');
    `);

    // Insertar Subzonas
    await sequelize.query(`
      INSERT INTO public."Subzonas" (id_subzona, nombre_subzona, id_zona) VALUES (1, 'Chimborazo', 1);
    `);

    // Insertar Cantones
    await sequelize.query(`
      INSERT INTO public."Cantones" (id_canton, nombre_canton, id_subzona) VALUES (1, 'Riobamba', 1);
    `);

    // Insertar Distritos
    await sequelize.query(`
      INSERT INTO public."Distritos" (id_distrito, nombre_distrito) VALUES (1, 'Riobamba');
    `);

    // Insertar relación Distrito-Cantón
    await sequelize.query(`
      INSERT INTO public."DistritoCanton" (id_distrito, id_canton) VALUES (1, 1);
    `);

    // Insertar Parroquias
    await sequelize.query(`
      INSERT INTO public."Parroquias" (id_parroquia, nombre_parroquia, id_canton, id_distrito) 
      VALUES (1, 'Riobamba', 1, 1);
    `);

    // Insertar Circuitos
    await sequelize.query(`
      INSERT INTO public."Circuitos" (id_circuito, nombre_circuito, id_parroquia, id_distrito) 
      VALUES (1, 'Riobamba', 1, 1);
    `);

    // Insertar Subcircuitos
    await sequelize.query(`
      INSERT INTO public."Subcircuitos" (id_subcircuito, nombre_subcircuito, id_circuito) 
      VALUES (1, 'Riobamba 1', 1);
    `);

  // Insertar Subtipos de Solicitud (según el orden dado)
await sequelize.query(`
  INSERT INTO public."Subtipo" (descripcion, id_tipo) VALUES
    ('botón de emergencia', 1),

    -- Denuncias Ciudadanas
    ('Asesinato', 2), ('Femicidio', 2), ('Homicidio', 2), ('Sicariato', 2),
    ('Robo a personas', 2), ('Robo a bienes, accesorios y autopartes de autos', 2),
    ('Robo a domicilios', 2), ('Robo a autos', 2), ('Robo a unidades económicas', 2),
    ('Robo a motos', 2), ('Robo en ejes viales o carreteras', 2),
    ('Maltrato infantil', 2), ('Maltrato familiar', 2), ('Acoso sexual', 2),
    ('Violación', 2), ('Maltrato animal', 2),

    -- Servicios Comunitarios
    ('Asamblea comunitaria', 3), ('Escuela Segura', 3), ('Local seguro', 3),
    ('Capacitación a la ciudadanía', 3), ('Contacto Ciudadano', 3),
    ('Barrio seguro', 3), ('Espacio público recuperado', 3),
    ('Encargo de domicilio', 3), ('Traslado de valores', 3),
    ('Guía de movilización y enseres', 3), ('Reacción y disuasión', 3);
`);

console.log("Subtipos de solicitud insertados correctamente.");

    // **Insertar el Admin con contraseña cifrada**
    const adminCount = await sequelize.query(
      'SELECT COUNT(*) FROM public."Persona" WHERE email = :email;',
      { type: QueryTypes.SELECT, replacements: { email: "alex.camacho@gmail.com" } }
    );

    if (parseInt(adminCount[0].count) === 0) {
      const hashedPassword = await bcrypt.hash("admin123", 10);

      await sequelize.query(`
        INSERT INTO public."Persona" (cedula, nombres, apellidos, fecha_Nacimiento, telefono, email, password, genero, id_subzona, id_canton, id_distrito)
        VALUES ('1801544872', 'Alex Jonathan', 'Camacho Montenegro','1998-08-11T05:00:00.000Z', '0996126404', 'alex.camacho@gmail.com', :password, 'MASCULINO', 1, 1, 1);
      `, { replacements: { password: hashedPassword } });

      await sequelize.query(`
        INSERT INTO public."PersonaRol" (id_persona, id_rol)
        SELECT id_persona, id_rol FROM public."Persona", public."Rol"
        WHERE email = 'alex.camacho@gmail.com' AND descripcion = 'Admin';
      `);

      console.log("Administrador creado exitosamente con contraseña cifrada.");
    } else {
      console.log("El administrador ya existe, no se requiere creación.");
    }

  } catch (error) {
    console.error("Error al insertar datos iniciales:", error);
  }
};

module.exports = initData;
