import React, { useState, useEffect } from "react";
import { Button, Appbar, Card, Title, Paragraph } from "react-native-paper";
import * as Location from "expo-location";
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import Notificacion from "./components/Notificacion";
import { useNavigate } from "react-router-native";
import MenuOpcionNav from "./components/MenuOpcionNav";

export default function EmergenciaScreen() {
  const [ubicacion, setUbicacion] = useState(null);
  const [marker, setMarker] = useState(null);
  const navigate = useNavigate();

  const [initialRegion, setInitialRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.005, // Reduce para hacer zoom
    longitudeDelta: 0.005, // Reduce para hacer zoom
  });

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
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setUbicacion({ latitude, longitude });
      setMarker({ latitude, longitude });
      setInitialRegion((prevRegion) => ({
        ...prevRegion,
        latitude,
        longitude,
      }));
    } catch (error) {
      console.error("Error al obtener la ubicación:", error);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  const handleSubmit = () => {
    const emergenciaData = {
      ubicacion: ubicacion
        ? {
            latitude: ubicacion.latitude,
            longitude: ubicacion.longitude,
          }
        : null,
    };

    console.log(emergenciaData);
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="EMERGENCIA" />
        <Notificacion />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.mapContainer}>
          <MapView style={styles.map} region={initialRegion}>
            {marker && (
              <Marker
                coordinate={marker}
                title="Ubicación Actual"
                description="Esta es tu ubicación actual"
              />
            )}
          </MapView>
        </View>
        <View style={styles.formContainer}>
          <Card style={styles.cardsos}>
            <Card.Content>
              <Title style={styles.title}>BOTON DE EMERGENCIA</Title>
              <TouchableOpacity
                onPress={() => Alert.alert("BOTON DE EMERGENCIA")}
              >
                <Image
                  source={require("../../assets/sos_home.png")}
                  style={styles.image}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <Paragraph style={styles.paragraph}>
                Pulsa para emitir una alerta de emergencia
              </Paragraph>
            </Card.Content>
          </Card>
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
  cardsos: {
    width: "90%",
    margin: "auto",
    marginVertical: 10,
    paddingHorizontal: 50,
    borderWidth: 1,
  },
  title: {
    textAlign: "center",
  },
  paragraph: {
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: 150,
    marginVertical: 10,
  },
});
