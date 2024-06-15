import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { TextInput, Button, Appbar } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";

const LoginScreen = () => {
  const { login } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    login(data.email, data.password);
  };

  const handleForgotPassword = () => {
    // Función para manejar la recuperación de contraseña
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="PILICIA APP" />
      </Appbar.Header>

      <View style={styles.formContainer}>
        <Image
          source={require("@/assets/images/Escudo_Policia.jpg")}
          style={styles.logo}
        />

        <Text style={styles.title}>Inicio de Sesión</Text>
        <Controller
          control={control}
          name="email"
          rules={{ required: "El email es obligatorio" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Email"
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={[styles.input, errors.email && styles.inputError]}
            />
          )}
        />
        {errors.email && (
          <Text style={styles.errorText}>{errors.email.message}</Text>
        )}

        <Controller
          control={control}
          name="password"
          rules={{ required: "La contraseña es obligatoria" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Contraseña"
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
              style={[styles.input, errors.password && styles.inputError]}
            />
          )}
        />
        {errors.password && (
          <Text style={styles.errorText}>{errors.password.message}</Text>
        )}

        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          style={styles.button}
        >
          Ingresar
        </Button>

        <View style={styles.bottomLinks}>
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
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    marginBottom: 12,
    width: "100%",
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    alignSelf: "flex-start",
    marginBottom: 10,
    marginLeft: 10,
  },
  button: {
    marginTop: 20,
    width: "100%",
  },
  bottomLinks: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    width: "100%",
  },
});

export default LoginScreen;
