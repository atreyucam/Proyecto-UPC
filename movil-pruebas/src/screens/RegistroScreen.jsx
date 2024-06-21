import React, { useContext } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-native";
import { UserContext } from "../context/UserContext";
import { Picker } from "@react-native-picker/picker";

const RegistroScreen = () => {
  const navigate = useNavigate();
  const { userState, registroUsuario } = useContext(UserContext);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm();

  const onSubmit = async (data) => {
    await registroUsuario(data);
    if (userState.isRegistered) {
      navigate("/login");
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };
  const handleForgotPassword = () => {
    navigate("/recuperar-cuenta");
  };

  const password = watch("password", "");

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Registro</Text>
          {userState.errorNewUser && (
            <Text style={styles.errorText}>{userState.errorNewUser}</Text>
          )}
          <Controller
            control={control}
            name="nombres"
            rules={{ required: "El nombre es obligatorio" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Nombres"
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
            name="apellidos"
            rules={{ required: "El apellido es obligatorio" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Apellidos"
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
            name="cedula"
            rules={{
              required: "La cedula es obligatorio",
              pattern: {
                value: /^\d{10}$/,
                message: "Cedula inválida",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Cedula"
                mode="outlined"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={styles.input}
                keyboardType="phone-pad"
              />
            )}
          />
          {errors.cedula && (
            <Text style={styles.errorText}>{errors.cedula.message}</Text>
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
            name="genero"
            rules={{ required: "El género es obligatorio" }}
            render={({ field: { onChange, value } }) => (
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={value}
                  onValueChange={onChange}
                  style={styles.picker}
                >
                  <Picker.Item label="Seleccione su género" value="" />
                  <Picker.Item label="Masculino" value="masculino" />
                  <Picker.Item label="Femenino" value="femenino" />
                  <Picker.Item label="Otro" value="otro" />
                </Picker>
              </View>
            )}
          />
          {errors.genero && (
            <Text style={styles.errorText}>{errors.genero.message}</Text>
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
            <Text style={styles.errorText}>
              {errors.confirmPassword.message}
            </Text>
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
          </View>
        </View>
      </View>
    </ScrollView>
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
    marginTop: 30,
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
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 10,
  },
  errorText: {
    color: "red",
    marginBottom: 16,
    fontSize: "20px",
    textAlign: "center",
  },
});

export default RegistroScreen;
