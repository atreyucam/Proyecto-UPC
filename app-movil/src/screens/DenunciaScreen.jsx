import React, { useState, useEffect } from "react";
import { TextInput, Button, Appbar, IconButton } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import * as Location from "expo-location";
import { StyleSheet, View, Image, Alert, ScrollView, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as ImagePicker from "expo-image-picker";
import Notificacion from "./components/Notificacion";
import { useNavigate } from "react-router-native";

export default function DenunciaScreen() {
  const [imageSource, setImageSource] = useState(null);
  const [ubicacion, setUbicacion] = useState(null);
  const [marker, setMarker] = useState(null);
  const navigate = useNavigate();

  const [initialRegion, setInitialRegion] = useState(null);
  
  const [formData, setFormData] = useState({
    tipoDenuncia: "",
    descripcion: "",
  });

  const handleSelectImage = async (option) => {
    let pickerResult;
    if (option === "gallery") {
      let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert("Permiso necesario", "Se requiere acceso a la galería.");
        return;
      }

      pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    } else if (option === "camera") {
      let permissionResult = await ImagePicker.requestCameraPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert("Permiso necesario", "Se requiere acceso a la cámara.");
        return;
      }

      pickerResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    }

    if (!pickerResult.canceled) {
      const { uri } = pickerResult.assets[0];
      setImageSource({ uri });
      console.log({ uri }); // Loguea el valor de la imagen seleccionada
    }
  };

  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permiso denegado",
          "Se necesita el permiso de ubicación para esta funcionalidad."
        );
        return;
      }
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest, // Alta precisión
        maximumAge: 10000, // No más de 10 segundos en caché
        timeout: 5000, // Tiempo de espera máximo de 5 segundos
      });
      const { latitude, longitude } = location.coords;
      setUbicacion({ latitude, longitude });
      setMarker({ latitude, longitude });
      setInitialRegion({
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    } catch (error) {
      console.error("Error al obtener la ubicación:", error);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  const handleFormChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = () => {
    const denunciaData = {
      ...formData,
      ubicacion: ubicacion
        ? {
            latitude: ubicacion.latitude,
            longitude: ubicacion.longitude,
          }
        : null,
      imagen: imageSource ? imageSource.uri : null,
    };

    console.log(denunciaData);
    // Aquí puedes enviar denunciaData al backend según sea necesario
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="DENUNCIAS" />
        <IconButton
          icon="clipboard-list"
          color="white"
          size={24}
          onPress={() => navigate("/misDenuncias")} // Navegar a la pantalla "Mis Denuncias"
        />
        <Notificacion />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.mapContainer}>
          {initialRegion && (
            <MapView style={styles.map} region={initialRegion}>
              {marker && (
                <Marker
                  coordinate={marker}
                  title="Ubicación Actual"
                  description="Esta es tu ubicación actual"
                />
              )}
            </MapView>
          )}
        </View>
        <View style={styles.formContainer}>
          <View style={styles.pickerContainer}>
            <Picker
              style={styles.picker}
              selectedValue={formData.tipoDenuncia}
              onValueChange={(itemValue) =>
                handleFormChange("tipoDenuncia", itemValue)
              }
            >
              <Picker.Item label="Seleccione tipo de denuncia" value="" />
              <Picker.Item label="Robo" value="robo" />
              <Picker.Item label="Asalto" value="asalto" />
              <Picker.Item
                label="Violencia doméstica"
                value="violencia_domestica"
              />
              <Picker.Item label="Acoso" value="acoso" />
              <Picker.Item label="Vandalismo" value="vandalismo" />
              <Picker.Item label="Tráfico de drogas" value="trafico_drogas" />
              <Picker.Item
                label="Accidente de tráfico"
                value="accidente_trafico"
              />
              <Picker.Item
                label="Disturbio público"
                value="disturbio_publico"
              />
              <Picker.Item label="Fraude" value="fraude" />
              <Picker.Item label="Secuestro" value="secuestro" />
              <Picker.Item label="Desaparición" value="desaparicion" />
              <Picker.Item label="Amenaza" value="amenaza" />
              <Picker.Item label="Hurto" value="hurto" />
              <Picker.Item label="Violación" value="violacion" />
              <Picker.Item label="Homicidio" value="homicidio" />
              <Picker.Item label="Corrupción" value="corrupcion" />
              <Picker.Item label="Otros" value="otros" />
            </Picker>
          </View>
          <TextInput
            label="Descripción de la denuncia"
            value={formData.descripcion}
            onChangeText={(text) => handleFormChange("descripcion", text)}
            style={styles.input}
            multiline
          />
          <View style={styles.imagePickerContainer}>
            <Button
              icon="camera"
              mode="contained"
              onPress={() => handleSelectImage("gallery")}
              style={styles.inputFoto}
            >
              Seleccionar Imagen
            </Button>

            <Button
              icon="camera"
              mode="contained"
              onPress={() => handleSelectImage("camera")}
              style={styles.inputFoto}
            >
              Tomar Foto
            </Button>
          </View>
          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.buttonDenuncia}
          >
            Emitir Denuncia
          </Button>

          <View style={{ alignItems: "center", marginTop: 20 }}>
            <Text style={{ textAlign: "center" }}>Tu Evidencia</Text>
            {imageSource && (
              <Image
                source={{ uri: imageSource.uri }}
                style={styles.imagePreview}
              />
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
  scrollContent: {
    padding: 10,
    flexGrow: 1,
  },
  mapContainer: {
    height: 270,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    height: 250,
  },
  formContainer: {
    paddingBottom: 20,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    marginTop: 20,
  },
  input: {
    marginBottom: 10,
    marginHorizontal: 10,
  },
  inputFoto: {
    marginHorizontal: 10,
    marginVertical: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#78288c",
    borderRadius: 4,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 10,
  },
  buttonDenuncia: {
    marginHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "red",
  },
  imagePickerContainer: {
    alignItems: "center",
  },
});
