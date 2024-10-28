import React, { useState, useEffect, useContext } from "react";
import { Appbar, Card, Title, Paragraph } from "react-native-paper";
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
import axios from "axios";
import { AuthContext } from "../context/AuthContext"; // Importa tu contexto de autenticación
import { useNavigate } from "react-router-native"; // Importa el hook para la navegación

const API_URL = "http:// 192.168.10.146:3000";

export default function EmergenciaScreen() {
    const { authState } = useContext(AuthContext); // Obtén la información del usuario desde el contexto
    const [ubicacion, setUbicacion] = useState(null);
    const [marker, setMarker] = useState(null);
    const [initialRegion, setInitialRegion] = useState(null);
    const navigate = useNavigate(); // Hook de navegación

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

            console.log("Ubicación obtenida:", { latitude, longitude }); // Loguear ubicación obtenida
        } catch (error) {
            console.error("Error al obtener la ubicación:", error);
            Alert.alert(
                "Error",
                "No se pudo obtener la ubicación. Inténtelo nuevamente."
            );
        }
    };

    useEffect(() => {
        getLocation();
    }, []);

    const handleSubmit = async () => {
        try {
            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Highest,
                maximumAge: 10000,
                timeout: 5000,
            });

            const { latitude, longitude } = location.coords;
            const puntoGPS = `${latitude},${longitude}`;

            const emergenciaData = {
                id_persona: authState.user, // Usa el id_persona desde el estado de autenticación
                puntoGPS: puntoGPS,
            };

            console.log("Datos enviados:", emergenciaData);

            const response = await axios.post(
                `${API_URL}/solicitud/nuevoBotonEmergencia`,
                emergenciaData
            );

            if (response.status === 201) {
                Alert.alert(
                    "Éxito",
                    "La alerta de emergencia ha sido enviada."
                );
            } else {
                Alert.alert("Error", "Hubo un problema al enviar la alerta.");
            }
        } catch (error) {
            console.error("Error al enviar la alerta de emergencia:", error);
            Alert.alert("Error", "No se pudo enviar la alerta de emergencia.");
        }
    };

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigate(-1)} />
                <Appbar.Content title="EMERGENCIA" />
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
                    <Card style={styles.cardsos}>
                        <Card.Content>
                            <Title style={styles.title}>
                                BOTON DE EMERGENCIA
                            </Title>
                            <TouchableOpacity onPress={handleSubmit}>
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
