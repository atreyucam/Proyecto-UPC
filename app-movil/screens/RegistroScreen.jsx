import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TextInput, Button, Appbar } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";

const RegistroScreen = () => {
  const { login } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm();

  const handleLogin = () => {
    login(email, password);
  };

  const onSubmit = (data) => {
    // Aquí puedes manejar la lógica de registro utilizando los datos del formulario (data)
    console.log(data);
  };

  const handleForgotPassword = () => {
    // Función para manejar la recuperación de contraseña
  };

  const password = watch("password", "");

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="PILICIA APP" />
      </Appbar.Header>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Registro</Text>

        <Controller
          control={control}
          name="nombre"
          rules={{ required: "El nombre es obligatorio" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Nombre"
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
            />
          )}
        />
        {errors.nombre && (
          <Text style={styles.errorText}>{errors.nombre.message}</Text>
        )}

        <Controller
          control={control}
          name="apellido"
          rules={{ required: "El apellido es obligatorio" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Apellido"
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
            />
          )}
        />
        {errors.apellido && (
          <Text style={styles.errorText}>{errors.apellido.message}</Text>
        )}

        <Controller
          control={control}
          name="telefono"
          rules={{
            required: "El teléfono es obligatorio",
            pattern: {
              value: /^\d{10}$/,
              message: "Número de teléfono inválido",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Teléfono"
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
              keyboardType="phone-pad"
            />
          )}
        />
        {errors.telefono && (
          <Text style={styles.errorText}>{errors.telefono.message}</Text>
        )}

        <Controller
          control={control}
          name="email"
          rules={{
            required: "El email es obligatorio",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Correo electrónico inválido",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Email"
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
              autoCapitalize="none"
            />
          )}
        />
        {errors.email && (
          <Text style={styles.errorText}>{errors.email.message}</Text>
        )}

        <Controller
          control={control}
          name="password"
          rules={{
            required: "La contraseña es obligatoria",
            minLength: {
              value: 8,
              message: "La contraseña debe tener al menos 8 caracteres",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Contraseña"
              mode="outlined"
              onBlur={onBlur}
              onChangeText={(text) => {
                onChange(text);
                if (text !== password) {
                  setValue("confirmPassword", "");
                }
              }}
              value={value}
              secureTextEntry
              style={styles.input}
            />
          )}
        />
        {errors.password && (
          <Text style={styles.errorText}>{errors.password.message}</Text>
        )}

        <Controller
          control={control}
          name="confirmPassword"
          rules={{
            required: "Debe confirmar la contraseña",
            validate: (value) =>
              value === password || "Las contraseñas no coinciden",
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Confirmar contraseña"
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
              style={styles.input}
            />
          )}
        />
        {errors.confirmPassword && (
          <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
        )}

        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          style={styles.button}
          loading={isSubmitting}
        >
          Registrarse
        </Button>

        <View style={styles.bottomLinks}>
          <Button onPress={handleLogin} color="#007BFF">
            ¿Ya tienes una cuenta? Inicia sesión
          </Button>
          <Button onPress={handleForgotPassword} color="blue">
            ¿Olvidaste tu contraseña?
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    marginBottom: 12,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    marginLeft: 10,
  },
  button: {
    marginTop: 10,
  },
  bottomLinks: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});

export default RegistroScreen;
