import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  StyleSheet,
} from "react-native";
import { useAuth } from "@/hooks/useAuth";

const RegistroScreen = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");

  const handleLogin = () => {
    login(email, password);
  };

  const handleSignUp = () => {
    // Función para manejar el registro
  };

  const handleForgotPassword = () => {
    // Función para manejar la recuperación de contraseña
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PILICIA APP</Text>

      {/* Aquí puedes ajustar estilos y layout según necesites */}
      <Text style={styles.title}>Inicio de Sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />

      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={apellido}
        onChangeText={setApellido}
      />

      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        value={telefono}
        onChangeText={setTelefono}
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Pressable
        onPress={handleLogin}
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? "#ddd" : "#007BFF",
            padding: 10,
            alignItems: "center",
            marginVertical: 10,
            borderRadius: 5,
          },
        ]}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Ingresar</Text>
      </Pressable>

     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
    height: 40,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  bottomLinks: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  linkText: {
    color: "blue",
  },
});

export default RegistroScreen;
