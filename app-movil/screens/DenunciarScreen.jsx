import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";

const Denunciar = () => {
  const [direccion, setDireccion] = useState("");
  const [observacion, setObservacion] = useState("");
  const [puntoGPS, setPuntoGPS] = useState("");
  const [tipos, setTipos] = useState([]);
  const [subtipos, setSubtipos] = useState([]);
  const [selectedTipo, setSelectedTipo] = useState("");
  const [selectedSubtipo, setSelectedSubtipo] = useState("");

  useEffect(() => {
    // Fetch tipos de solicitudes
    const fetchTipos = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/tipoSolicitud/"
        );
        setTipos(response.data);
      } catch (error) {
        Alert.alert(
          "Error",
          "Hubo un problema al obtener los tipos de solicitudes"
        );
      }
    };

    fetchTipos();
  }, []);

  useEffect(() => {
    // Fetch subtipos based on selected tipo
    const fetchSubtipos = async () => {
      if (selectedTipo) {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/tipos/${selectedTipo}/subtipos`
          );
          setSubtipos(response.data);
        } catch (error) {
          Alert.alert("Error", "Hubo un problema al obtener los subtiposs");
        }
      }
    };

    fetchSubtipos();
  }, [selectedTipo]);

  const handleSubmit = async () => {
    const data = {
      id_persona: 1, // ID fijo para pruebas
      id_estado: 1, // Estado inicial "Pendiente"
      id_subtipo: selectedSubtipo, // Subtipo seleccionado por el usuario
      puntoGPS: puntoGPS,
      direccion: direccion,
      observacion: observacion,
    };

    try {
      await axios.post(`http://localhost:3000/api/solicitud`, data);
      Alert.alert("Éxito", "Denuncia registrada con éxito");
    } catch (error) {
      if (error.response) {
        // El servidor respondió con un código de estado fuera del rango 2xxss
        Alert.alert(
          "Error",
          `Error del servidor: ${error.response.data.error}`
        );
      } else if (error.request) {
        // La solicitud se hizo pero no se recibió respuesta
        Alert.alert(
          "Error",
          "No se recibió respuesta del servidor. Por favor, intenta nuevamente."
        );
      } else {
        // Algo sucedió al configurar la solicitud
        Alert.alert(
          "Error",
          `Error al configurar la solicitud: ${error.message}`
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tipo de Solicitud</Text>
      <Picker
        selectedValue={selectedTipo}
        onValueChange={(itemValue, itemIndex) => setSelectedTipo(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Seleccione un tipo" value="" />
        {tipos.map((tipo) => (
          <Picker.Item
            key={tipo.id_tipo}
            label={tipo.descripcion}
            value={tipo.id_tipo}
          />
        ))}
      </Picker>

      <Text style={styles.label}>Subtipo</Text>
      <Picker
        selectedValue={selectedSubtipo}
        onValueChange={(itemValue, itemIndex) => setSelectedSubtipo(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Seleccione un subtipo" value="" />
        {subtipos.map((subtipo) => (
          <Picker.Item
            key={subtipo.id_subtipo}
            label={subtipo.descripcion}
            value={subtipo.id_subtipo}
          />
        ))}
      </Picker>

      <Text style={styles.label}>Dirección</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese la dirección"
        value={direccion}
        onChangeText={setDireccion}
      />
      <Text style={styles.label}>Observación</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese una observación"
        value={observacion}
        onChangeText={setObservacion}
      />
      <Text style={styles.label}>Punto GPS</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese el punto GPS"
        value={puntoGPS}
        onChangeText={setPuntoGPS}
      />
      <Button title="Enviar Denuncia" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  picker: {
    height: 50,
    marginBottom: 12,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});

export default Denunciar;
