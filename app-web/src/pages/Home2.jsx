import React, { useState } from "react";
import { Input, Button, Typography, Dialog, DialogHeader, DialogBody, DialogFooter, Select, Option } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";

const RegistrationModal = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} handler={onClose}>
      <DialogHeader>Registro</DialogHeader>
      <DialogBody divider>
        <form className="flex flex-col gap-4">
          <Input label="Nombre" size="lg" />
          <Input label="Apellido" size="lg" />
          <Select label="Tipo de Ciudadano" size="lg">
            <Option value="ciudadano">Ciudadano</Option>
            <Option value="policia">Policia</Option>
            <Option value="admin">Admin</Option>
          </Select>
          <Input label="Cédula" size="lg" />
          <Input label="Dirección" size="lg" />
          <Input label="Teléfono" size="lg" />
        </form>
      </DialogBody>
      <DialogFooter>
        <Button variant="text" color="red" onClick={onClose} className="mr-1">
          <span>Cancelar</span>
        </Button>
        <Button variant="gradient" color="green" onClick={onClose}>
          <span>Registrarse</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

const Home2 = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false); // Estado para controlar si se está registrando o iniciando sesión
  const navigate = useNavigate();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const email = "Luisinsuasti501@gmail.com";
    const password = "12345678";

    // Verificación de credenciales
    if (inputEmail === email && inputPassword === password) {
      console.log("Usuario registrado:", { email, password });
      navigate("/");
    } else {
      alert("Credenciales incorrectas. Inténtalo de nuevo.");
    }
  };

  const handleToggleForm = () => {
    setIsRegistering(!isRegistering); // Alternar entre iniciar sesión y registrarse
  };

  const handleSubmitRegistration = (e) => {
    e.preventDefault();
    // Lógica para procesar el registro
    console.log("Registro completado");
    setIsModalOpen(false); // Cerrar el modal después de registrar
  };

  return (
    <section className="flex justify-center items-center h-screen bg-gray-100 relative">
      {/* Texto vertical al lado izquierdo */}
      <div className="absolute left-7 top-1/2 transform -translate-y-1/2">
        <h2 className="text-black text-6xl font-bold transform -rotate-90 origin-top-center ml-10">
          @UPC DIGITAL
        </h2>
      </div>

      {/* Contenedor principal */}
      <div className="flex flex-col items-center justify-center h-full w-full">
        <div className="bg-blue-500 w-full max-w-lg h-full absolute right-0" />

        <div className="bg-white rounded-lg p-8 shadow-md w-full max-w-lg relative">
          <div className="text-center">
            <Typography variant="h2" className="font-bold mb-4">
              {isRegistering ? "Registro" : "Inicio de sesión"}
            </Typography>
            <Typography
              variant="paragraph"
              color="blue-gray"
              className="text-lg font-normal"
            >
              {isRegistering
                ? "Completa los datos para registrarte"
                : "Ingresa tu email y contraseña"}
            </Typography>
          </div>
          <form className="mt-8" onSubmit={isRegistering ? handleSubmitRegistration : handleLogin}>
            {isRegistering ? (
              <>
                <div className="mb-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="block mb-2 font-medium"
                  >
                    Nombre
                  </Typography>
                  <Input
                    size="lg"
                    placeholder="Nombre"
                    className="w-full border-gray-300 border rounded-lg py-2 px-3 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="block mb-2 font-medium"
                  >
                    Apellido
                  </Typography>
                  <Input
                    size="lg"
                    placeholder="Apellido"
                    className="w-full border-gray-300 border rounded-lg py-2 px-3 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <Select label="Tipo de Ciudadano" size="lg" className="mb-4">
                  <Option value="ciudadano">Ciudadano</Option>
                  <Option value="policia">Policia</Option>
                  <Option value="admin">Admin</Option>
                </Select>
                <div className="mb-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="block mb-2 font-medium"
                  >
                    Cédula
                  </Typography>
                  <Input
                    size="lg"
                    placeholder="Cédula"
                    className="w-full border-gray-300 border rounded-lg py-2 px-3 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="block mb-2 font-medium"
                  >
                    Dirección
                  </Typography>
                  <Input
                    size="lg"
                    placeholder="Dirección"
                    className="w-full border-gray-300 border rounded-lg py-2 px-3 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="block mb-2 font-medium"
                  >
                    Teléfono
                  </Typography>
                  <Input
                    size="lg"
                    placeholder="Teléfono"
                    className="w-full border-gray-300 border rounded-lg py-2 px-3 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg">
                  Registrarse
                </Button>
              </>
            ) : (
              <>
                <div className="mb-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="block mb-2 font-medium"
                  >
                    Tu email
                  </Typography>
                  <Input
                    size="lg"
                    placeholder="name@mail.com"
                    value={inputEmail}
                    onChange={(e) => setInputEmail(e.target.value)}
                    className="w-full border-gray-300 border rounded-lg py-2 px-3 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="block mb-2 font-medium"
                  >
                    Contraseña
                  </Typography>
                  <Input
                    type="password"
                    size="lg"
                    placeholder="********"
                    value={inputPassword}
                    onChange={(e) => setInputPassword(e.target.value)}
                    className="w-full border-gray-300 border rounded-lg py-2 px-3 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg">
                  Ingresar
                </Button>
              </>
            )}
          </form>
          <div className="text-center mt-4">
            <Typography variant="small" className="text-blue-500 font-medium">
              <a href="#">¿Olvidaste tu contraseña?</a>
            </Typography>
            <Typography
              variant="paragraph"
              className="text-blue-gray-500 font-medium mt-4"
            >
              {isRegistering
                ? "¿Ya tienes una cuenta?"
                : "¿No tienes una cuenta?"}
              <span onClick={handleToggleForm} className="cursor-pointer text-blue-500 ml-1">
                {isRegistering ? "Iniciar sesión" : "Regístrate"}
              </span>
            </Typography>
          </div>
        </div>
      </div>
      <RegistrationModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </section>
  );
};

export default Home2;
