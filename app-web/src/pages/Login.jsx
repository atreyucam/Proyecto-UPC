import React, { useState, useEffect } from "react";
import { Input, Button, Typography } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../context/redux/authSlide";


const Home2 = () => {
  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    console.log("Formulario de inicio de sesión enviado");

    try {
      await dispatch(login(inputEmail, inputPassword));
    } catch (err) {
      setErrorMessage(
        "Contraseña incorrecta o no tienes permiso para ingresar."
      );
    }
  };

  // UseEffect para manejar la navegación después del login
  useEffect(() => {
    if (!loading && isAuthenticated) {
      console.log("Redirigiendo al home después de un login exitoso");
      navigate("/home");
    }
  }, [isAuthenticated, loading, navigate]);

  return (
    <section className="flex justify-center items-center h-screen bg-gray-100 relative">
      <div className="absolute left-7 top-1/2 transform -translate-y-1/2">
        <h2 className="text-black text-6xl font-bold transform -rotate-90 origin-top-center ml-10">
          @UPC DIGITAL
        </h2>
      </div>
      <div className="flex flex-col items-center justify-center h-full w-full">
        <div className="bg-blue-500 w-full max-w-lg h-full absolute right-0" />
        <div className="bg-white rounded-lg p-8 shadow-md w-full max-w-lg relative">
          <div className="text-center">
            <Typography variant="h2" className="font-bold mb-4">
              Inicio de sesión
            </Typography>
            <Typography
              variant="paragraph"
              color="blue-gray"
              className="text-lg font-normal"
            >
              Ingresa tu email y contraseña
            </Typography>
          </div>
          <form className="mt-8" onSubmit={handleLogin}>
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
            {errorMessage && (
              <Typography
                variant="small"
                color="red"
                className="block mb-2 font-medium"
              >
                {errorMessage}
              </Typography>
            )}
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
            >
              Ingresar
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Home2;
