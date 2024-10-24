import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { TextInput, Button, Appbar, IconButton } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-native";
import { AuthContext } from "../context/AuthContext";
import { Picker } from "@react-native-picker/picker";
import Notificacion from "./components/Notificacion";
import axios from "axios";

const API_URL = "http://192.168.0.13:3000"; // Asegúrate de que esta URL apunte a tu backend

export default function MiPerfilScreen() {
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();
  const [perfilCargado, setPerfilCargado] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm();

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/personas/${authState.user}`
        );
        const data = response.data;

        setValue("nombres", data.nombres);
        setValue("apellidos", data.apellidos);
        setValue("cedula", data.cedula);
        setValue("telefono", data.telefono);
        setValue("email", data.email);
        setValue("genero", data.genero.toLowerCase());

        setPerfilCargado(true);
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
        Alert.alert("Error", "No se pudo cargar la información del perfil.");
      }
    };

    if (authState.user) {
      cargarPerfil();
    }
  }, [authState.user, setValue]);

  const onSubmit = async (data) => {
    try {
      const actualizacionData = {
        nombres: data.nombres,
        apellidos: data.apellidos,
        telefono: data.telefono,
        email: data.email,
        genero: data.genero,
      };

      // Incluir la contraseña solo si el usuario desea cambiarla
      if (data.password) {
        actualizacionData.password = data.password;
      }

      const response = await axios.put(
        `${API_URL}/personas/${authState.user}`,
        actualizacionData
      );

      if (response.status === 200) {
        Alert.alert("Éxito", "Perfil actualizado correctamente.");
      } else {
        Alert.alert("Error", "Hubo un problema al actualizar el perfil.");
      }
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      Alert.alert("Error", "No se pudo actualizar la información del perfil.");
    }
  };

  const password = watch("password", "");

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <IconButton
          icon="arrow-left"
          color="white"
          size={24}
          onPress={() => navigate("/")}
        />
        <Appbar.Content title="Volver" />
        <IconButton
          icon="home"
          color="white"
          size={30}
          onPress={() => navigate("/")}
        />
      </Appbar.Header>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.formContainer}>
            <Text style={styles.title}>Mi Perfil</Text>
            {perfilCargado ? (
              <>
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
                {errors.nombres && (
                  <Text style={styles.errorText}>{errors.nombres.message}</Text>
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
                {errors.apellidos && (
                  <Text style={styles.errorText}>
                    {errors.apellidos.message}
                  </Text>
                )}

                <Controller
                  control={control}
                  name="cedula"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label="Cédula"
                      mode="outlined"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      style={styles.input}
                      keyboardType="phone-pad"
                      editable={false} // Bloquear edición de cédula
                    />
                  )}
                />

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
                  <Text style={styles.errorText}>
                    {errors.telefono.message}
                  </Text>
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
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label="Nueva Contraseña (opcional)"
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
                  <Text style={styles.errorText}>
                    {errors.password.message}
                  </Text>
                )}

                <Controller
                  control={control}
                  name="confirmPassword"
                  rules={{
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
                  Actualizar
                </Button>
              </>
            ) : (
              <Text>Cargando perfil...</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

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
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#78288c",
    borderRadius: 4,
    marginBottom: 10,
  },

  picker: {
    height: 40,
    width: "100%",
    marginBottom: 10,
  },
  errorText: {
    color: "red",
    marginBottom: 16,
  },
});
