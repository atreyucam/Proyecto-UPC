import { Input, Button, Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";
const Login = () => {
  return (
    <>
      <section className="m-8 flex gap-4">
        <div className="w-full lg:w-3/5 mt-24">
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
          <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
            <div className="mb-1 flex flex-col gap-6">
              <Typography
                variant="small"
                color="blue-gray"
                className="-mb-3 font-medium"
              >
                Tu email
              </Typography>
              <Input
                size="lg"
                placeholder="name@mail.com"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
              <Typography
                variant="small"
                color="blue-gray"
                className="-mb-3 font-medium"
              >
                Contraseña
              </Typography>
              <Input
                type="password"
                size="lg"
                placeholder="********"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>

            <Button className="mt-6" fullWidth>
              Ingresar
            </Button>

            <div className="text-center mt-5">
              <Typography variant="small" className="font-medium text-gray-900">
                <a href="#">Forgot Password</a>
              </Typography>
            </div>

            <Typography
              variant="paragraph"
              className="text-center text-blue-gray-500 font-medium mt-4"
            >
              No estas registrado?
              <Link to="/auth/sign-up" className="text-gray-900 ml-1">
                REGISTRO
              </Link>
            </Typography>
          </form>
        </div>
        <div className="w-2/5 h-full hidden lg:block">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Escudo_Policia_Nacional_Ecuador.jpg/800px-Escudo_Policia_Nacional_Ecuador.jpg"
            className="h-full w-full object-cover rounded-3xl"
          />
        </div>
      </section>
    </>
  );
};

export default Login;
