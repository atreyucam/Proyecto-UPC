import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View, Image, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Appbar, IconButton, Card } from "react-native-paper";
import { useNavigate, useParams } from "react-router-native";

const DenunciaItemScreen = () => {
  const navigate = useNavigate();
  const { denunciaId } = useParams();

  Alert.alert(denunciaId);
  const denuncia = {
    id: 1,
    titulo: "Denuncia 1",
    estado: "Pendiente",
    fecha: "2022-01-01",
    imagen: "https://picsum.photos/200/300",
    ubicacion: {
      latitud: 0,
      lngitud: 0,
    },
  };
  const [initialRegion, setInitialRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.005, // Reduce para hacer zoom
    longitudeDelta: 0.005, // Reduce para hacer zoom
  });

  const [marker, setMarker] = useState({
    latitude: denuncia.ubicacion.latitud,
    longitude: denuncia.ubicacion.lngitud,
  });

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <IconButton
          icon="arrow-left"
          color="white"
          size={24}
          onPress={() => navigate("/misDenuncias")} // Navegar a la pantalla "Mis Denuncias"
        />
        <Appbar.Content title="Volver" />
        <IconButton
          icon="home"
          color="white"
          size={30}
          onPress={() => navigate("/")} // Navegar a la pantalla principal
        />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Card.Title
            title={denuncia.titulo}
            subtitle={`Estado: ${denuncia.estado}`}
          />
          <Card.Content>
            <Text style={styles.fechaText}>{`Fecha: ${denuncia.fecha}`}</Text>
            <Text>{denuncia.descripcion}</Text>
          </Card.Content>
          <Card.Cover source={{ uri: denuncia.imagen }} />
        </Card>

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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 10,
    flexGrow: 1,
  },
  card: {
    marginVertical: 10,
    elevation: 3,
  },
  fechaText: {
    fontStyle: "italic",
    color: "#888",
    marginBottom: 5,
  },
  mapContainer: {
    height: 270,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    height: 250,
  },
});

export default DenunciaItemScreen;
