import React, { useState, useEffect, useContext } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from "react-native";
import { Appbar, IconButton, TextInput, Button } from "react-native-paper";
import { useNavigate } from "react-router-native";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { API_ENDPOINT } from "@env"; // Importar del .env
// const API_ENDPOINT = "http://192.168.0.14:3000"; // Asegúrate de que esta URL apunte a tu backend

const SolicitudesAsignadasScreen = () => {
    const { authState } = useContext(AuthContext); // Obtener el estado de autenticación
    const navigate = useNavigate();
    const [solicitudes, setSolicitudes] = useState([]);
    const [filtro, setFiltro] = useState("");

    useEffect(() => {
        const obtenerSolicitudesAsignadas = async () => {
            try {
                const response = await axios.get(
                    `${API_ENDPOINT}/persona/policia/${authState.user}`
                );
                const solicitudesEnProgreso =
                    response.data.solicitudes_asignadas.filter(
                        (solicitud) => solicitud.estado === "en progreso"
                    );
                setSolicitudes(solicitudesEnProgreso);
            } catch (error) {
                console.error(
                    "Error al obtener las solicitudes asignadas:",
                    error
                );
            }
        };

        if (authState.user) {
            obtenerSolicitudesAsignadas();
        }
    }, [authState.user]);

    const aplicarFiltro = () => {
        const filteredSolicitudes = solicitudes.filter(
            (solicitud) =>
                solicitud.subtipo
                    .toLowerCase()
                    .includes(filtro.toLowerCase()) ||
                solicitud.tipo_solicitud
                    .toLowerCase()
                    .includes(filtro.toLowerCase())
        );
        setSolicitudes(filteredSolicitudes);
    };

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
            <View style={styles.searchContainer}>
                <TextInput
                    label="Buscar por subtipo o tipo"
                    value={filtro}
                    onChangeText={(text) => setFiltro(text)}
                    style={styles.searchInput}
                />
                <Button mode="contained" onPress={aplicarFiltro}>
                    Aplicar Filtro
                </Button>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {solicitudes.length > 0 ? (
                    solicitudes.map((solicitud) => (
                        <TouchableOpacity
                            key={solicitud.id_solicitud}
                            style={styles.solicitudItem}
                            onPress={() =>
                                navigate(`/denuncia/${solicitud.id_solicitud}`)
                            }
                        >
                            <Text style={styles.solicitudTitulo}>
                                {solicitud.subtipo}
                            </Text>
                            <Text>{solicitud.tipo_solicitud}</Text>
                            <Text>{solicitud.estado}</Text>
                            <Text style={styles.fechaText}>
                                Fecha de creación:{" "}
                                {new Date(
                                    solicitud.fecha_creacion
                                ).toLocaleString()}
                            </Text>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text style={styles.noSolicitudesText}>
                        No hay solicitudes asignadas.
                    </Text>
                )}
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
    solicitudItem: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: "#f0f0f0",
        borderRadius: 8,
    },
    solicitudTitulo: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
    },
    fechaText: {
        fontStyle: "italic",
        color: "#888",
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10,
        marginBottom: 10,
        backgroundColor: "#fff",
    },
    searchInput: {
        flex: 1,
        marginRight: 10,
    },
    noSolicitudesText: {
        textAlign: "center",
        marginTop: 20,
        fontSize: 16,
        color: "#888",
    },
});

export default SolicitudesAsignadasScreen;
