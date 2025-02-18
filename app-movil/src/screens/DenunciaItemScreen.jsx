import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Text, View, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Appbar, IconButton, Card } from "react-native-paper";
import { useNavigate, useParams } from "react-router-native";
import axios from "axios";
import { API_ENDPOINT } from "@env"; // Importar del .env
// const API_ENDPOINT = "http://192.168.0.14:3000"; // Asegúrate de que esta URL apunte a tu backend

const DenunciaItemScreen = () => {
    const navigate = useNavigate();
    const { denunciaId } = useParams();
    const [denuncia, setDenuncia] = useState(null);
    const [initialRegion, setInitialRegion] = useState(null);

    useEffect(() => {
        const obtenerDetalleDenuncia = async () => {
            try {
                const response = await axios.get(
                    `${API_ENDPOINT}/solicitud/${denunciaId}`
                );
                const data = response.data;
                setDenuncia(data);

                if (data.puntoGPS) {
                    const [latitude, longitude] = data.puntoGPS
                        .split(",")
                        .map(Number);
                    setInitialRegion({
                        latitude,
                        longitude,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005,
                    });
                }
            } catch (error) {
                console.error(
                    "Error al obtener el detalle de la denuncia:",
                    error
                );
                Alert.alert(
                    "Error",
                    "No se pudo obtener el detalle de la denuncia."
                );
            }
        };

        obtenerDetalleDenuncia();
    }, [denunciaId]);

    if (!denuncia) {
        return (
            <View style={styles.container}>
                <Text>Cargando detalle de la denuncia...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <IconButton
                    icon="arrow-left"
                    color="white"
                    size={24}
                    onPress={() => navigate("/misDenuncias")}
                />
                <Appbar.Content title="Detalle de Denuncia" />
                <IconButton
                    icon="home"
                    color="white"
                    size={30}
                    onPress={() => navigate("/")}
                />
            </Appbar.Header>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Card style={styles.card}>
                    <Card.Title
                        title={denuncia.subtipo}
                        subtitle={`Estado: ${denuncia.estado}`}
                    />
                    <Card.Content>
                        <Text style={styles.fechaText}>
                            Fecha de creación:{" "}
                            {new Date(denuncia.fecha_creacion).toLocaleString()}
                        </Text>
                        <Text>{`Tipo: ${denuncia.tipo}`}</Text>
                        <Text>
                            {denuncia.direccion || "Dirección no especificada"}
                        </Text>
                    </Card.Content>
                </Card>

                <View style={styles.mapContainer}>
                    {initialRegion && (
                        <MapView style={styles.map} region={initialRegion}>
                            <Marker
                                coordinate={initialRegion}
                                title="Ubicación del incidente"
                                description={
                                    denuncia.direccion || "Ubicación aproximada"
                                }
                            />
                        </MapView>
                    )}
                </View>

                {/* Sección para eventos relacionados */}
                <View style={styles.seccionContainer}>
                    <Text style={styles.seccionTitulo}>
                        Eventos Relacionados
                    </Text>
                    {denuncia.SolicitudEventoPersonas.length > 0 ? (
                        denuncia.SolicitudEventoPersonas.map(
                            (evento, index) => (
                                <Card key={index} style={styles.eventoCard}>
                                    <Card.Content>
                                        <Text style={styles.eventoText}>
                                            {evento.id_evento}
                                        </Text>
                                        <Text style={styles.eventoAutor}>
                                            Modificado por:{" "}
                                            {evento.persona.nombres}{" "}
                                            {evento.persona.apellidos}
                                        </Text>
                                        <Text style={styles.fechaText}>
                                            {new Date(
                                                evento.fecha_creacion
                                            ).toLocaleString()}
                                        </Text>
                                    </Card.Content>
                                </Card>
                            )
                        )
                    ) : (
                        <Text>No existen eventos registrados.</Text>
                    )}
                </View>

                {/* Sección para observaciones */}
                <View style={styles.seccionContainer}>
                    <Text style={styles.seccionTitulo}>Observaciones</Text>
                    {denuncia.Observacions.length > 0 ? (
                        denuncia.Observacions.map((observacion, index) => (
                            <Card key={index} style={styles.observacionCard}>
                                <Card.Content>
                                    <Text style={styles.observacionText}>
                                        {observacion.observacion}
                                    </Text>
                                    <Text style={styles.observacionAutor}>
                                        Modificado por:{" "}
                                        {observacion.persona.nombres}{" "}
                                        {observacion.persona.apellidos}
                                    </Text>
                                    <Text style={styles.fechaText}>
                                        {new Date(
                                            observacion.fecha
                                        ).toLocaleString()}
                                    </Text>
                                </Card.Content>
                            </Card>
                        ))
                    ) : (
                        <Text>No hay observaciones registradas.</Text>
                    )}
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
    seccionContainer: {
        marginVertical: 20,
    },
    seccionTitulo: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    eventoCard: {
        marginVertical: 5,
        elevation: 2,
    },
    eventoText: {
        marginBottom: 5,
    },
    eventoAutor: {
        fontWeight: "bold",
    },
    observacionCard: {
        marginVertical: 5,
        elevation: 2,
    },
    observacionText: {
        marginBottom: 5,
    },
    observacionAutor: {
        fontWeight: "bold",
    },
});

export default DenunciaItemScreen;
