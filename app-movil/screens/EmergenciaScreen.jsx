import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import * as Location from "expo-location";
import axios from "axios";

const EmergenciaScreen = () => {
  const [alertVisible, setAlertVisible] = useState(false);
  const handleEmergency = async () => {
    try {
      // Solicitar permisos de ubicación
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permiso denegado",
          "Se necesita el permiso de ubicación para esta funcionalidad."
        );
        return;
      }

      // Obtener la ubicación actual
      let location = await Location.getCurrentPositionAsync({});
      const puntoGPS = `${location.coords.latitude}, ${location.coords.longitude}`;

      const data = {
        id_persona: 1, // ID fijo para pruebas
        id_estado: 1, // Estado inicial "Pendiente"
        id_subtipo: 1, // Subtipo de botón de emergencia
        puntoGPS: puntoGPS,
        direccion: "Ubicación de emergencia", // Puedes mejorar esto si necesitas una dirección más específica
        observacion: "Emergencia activada",
      };

      console.log("Enviando solicitud de emergencia...");

      const response = await axios.post(
        `http://localhost:3000/api/solicitud`,
        data
      );
      console.log("Solicitud de emergencia enviada:", response.data);

      // Mostrar la alerta
      setAlertVisible(true);
    } catch (error) {
      console.log("Error al enviar solicitud de emergencia:", error);
      if (error.response) {
        Alert.alert(
          "Error",
          `Error del servidor: ${error.response.data.error}`
        );
      } else if (error.request) {
        Alert.alert(
          "Error",
          "No se recibió respuesta del servidor. Por favor, intenta nuevamente."
        );
      } else {
        Alert.alert(
          "Error",
          `Error al configurar la solicitud: ${error.message}`
        );
      }
    }
  };
  useEffect(() => {
    if (alertVisible) {
      Alert.alert(
        "Éxito",
        "ACTIVASTE EL BOTON DE EMERGENCIA, UNA UNIDAD IRA EN CAMINO",
        [{ text: "OK", onPress: () => setAlertVisible(false) }]
      );
    }
  }, [alertVisible]);

  return (
    <View style={styles.container}>
      <Button
        title="Emergencia"
        onPress={handleEmergency}
        color="#FF0000" // Rojo para indicar emergencia
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default EmergenciaScreen;
