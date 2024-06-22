import React, { useState, useEffect } from "react";
import { TextInput, Button } from "react-native-paper"; // Importa componentes necesarios de react-native-paper
import { Picker } from "@react-native-picker/picker";
import {
  StyleSheet,
  View,
  PermissionsAndroid,
  Platform,
  Image,
  Alert,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import * as ImagePicker from "expo-image-picker";

export default function DebunciaScreen() {
  const [imageSource, setImageSource] = useState(null);

  const handleSelectImage = async (option) => {
    let pickerResult;
    if (option === "gallery") {
      let permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

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

    if (!pickerResult.cancelled) {
      setImageSource({ uri: pickerResult.uri });
    }
  };

  const [marker, setMarker] = useState(null);
  const [initialRegion, setInitialRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [formData, setFormData] = useState({
    tipoDenuncia: "",
    descripcion: "",
  });

  const handleFormChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Permiso de ubicacion",
            message: "Necesitamos permiso para obtener tu ubicación",
            buttonNeutral: "Preguntar despues",
            buttonNegative: "Cancelar",
            buttonPositive: "OK",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          locateCurrentPosition();
        } else {
          console.log("Permiso de ubicacion denegado");
        }
      } else {
        locateCurrentPosition();
      }
    };

    requestLocationPermission();
  }, []);

  const locateCurrentPosition = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newRegion = {
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };
        setInitialRegion(newRegion);
        setMarker({ latitude, longitude });
      },
      (error) => console.log(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  const handleSubmit = () => {
    console.log(formData); // Aquí podrías enviar los datos del formulario a tu backend u otro manejo
    // Lógica para enviar la denuncia
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView style={styles.map} initialRegion={initialRegion}>
          {marker && (
            <Marker
              coordinate={marker}
              title="Current Location"
              description="This is your current location"
            />
          )}
        </MapView>
      </View>

      {/* FORMULARIO */}
      <View style={styles.container}>
        <View style={styles.pickerContainer}>
          <Picker
            style={styles.picker}
            selectedValue={formData.tipoDenuncia}
            onValueChange={(itemValue) =>
              handleFormChange("tipoDenuncia", itemValue)
            }
          >
            <Picker.Item label="Seleccione tipo de denuncia" value="" />
            <Picker.Item label="Denuncia 1" value="denuncia1" />
            <Picker.Item label="Denuncia 2" value="denuncia2" />
            {/* Agrega más tipos de denuncia según necesites */}
          </Picker>
        </View>
        <TextInput
          label="Descripción de la denuncia"
          value={formData.descripcion}
          onChangeText={(text) => handleFormChange("descripcion", text)}
          style={styles.input}
          multiline
        />

        {/* IMAGENS */}
        <View>
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

          {imageSource && (
            <Image
              source={{ uri: imageSource.uri }}
              style={{ width: 200, height: 200, marginTop: 20 }}
            />
          )}
        </View>

        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.buttonDenuncia}
        >
          Emitir Denuncia
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  formContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  input: {
    marginBottom: 10,
    marginHorizontal: 10,
  },
  button: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  inputFoto: {
    marginHorizontal: 50,
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
    marginTop: 20,
    paddingVertical: 10,
  },
});
