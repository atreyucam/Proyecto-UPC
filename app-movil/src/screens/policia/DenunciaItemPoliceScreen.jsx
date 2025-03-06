import React, { useState, useEffect, useContext } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    Alert,
    Modal,
    TouchableOpacity,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import {
    Appbar,
    IconButton,
    Card,
    Button,
    TextInput,
} from "react-native-paper";
import { useNavigate, useParams } from "react-router-native";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext"; // Importa el contexto de autenticación
import { API_ENDPOINT } from "@env"; // Importar del .env
// const API_ENDPOINT = "http://192.168.0.14:3000"; // Asegúrate de que esta URL apunte a tu backend

const DenunciaItemPoliceScreen = () => {
    const navigate = useNavigate();
    const { denunciaId } = useParams();
    const { authState } = useContext(AuthContext); // Obtén el estado de autenticación
    const [denuncia, setDenuncia] = useState(null);
    const [initialRegion, setInitialRegion] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalObservacionVisible, setModalObservacionVisible] =
        useState(false);
    const [estadoCierre, setEstadoCierre] = useState("Resuelto");
    const [observacion, setObservacion] = useState("");
    const [observacionNueva, setObservacionNueva] = useState("");

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

    const handleCerrarSolicitud = async () => {
        try {
            await axios.post(`${API_ENDPOINT}/solicitud/cerrarSolicitud`, {
                id_solicitud: denunciaId,
                observacion,
                estado_cierre: estadoCierre,
            });
            Alert.alert("Éxito", "La solicitud se ha cerrado correctamente.");
            setModalVisible(false);
            // Opcional: recargar la denuncia para mostrar la nueva observación
            const response = await axios.get(
                `${API_ENDPOINT}/solicitud/${denunciaId}`
            );
            setDenuncia(response.data);
        } catch (error) {
            console.error("Error al cerrar la solicitud:", error);
            Alert.alert("Error", "No se pudo cerrar la solicitud.");
        }
    };

    const handleAgregarObservacion = async () => {
        console.log("ID Persona:", authState.user);
        try {
            await axios.post(`${API_ENDPOINT}/solicitud/agregarObservacion`, {
                id_solicitud: denunciaId,
                observacion: observacionNueva,
                id_persona: authState.user, // Asegúrate de que este es el ID del policía logueado
            });
            Alert.alert("Éxito", "Observación agregada correctamente.");
            setModalObservacionVisible(false);
            // Opcional: recargar la denuncia para mostrar la nueva observación
            const response = await axios.get(
                `${API_ENDPOINT}/solicitud/${denunciaId}`
            );
            setDenuncia(response.data);
        } catch (error) {
            console.error("Error al agregar la observación:", error);
            Alert.alert("Error", "No se pudo agregar la observación.");
        }
    };

    const getEstadoOptionStyles = (estado) => {
        if (estadoCierre === estado) {
            if (estado === "resuelto") {
                return { ...styles.estadoOption, ...styles.buttonResolved };
            } else if (estado === "falso") {
                return { ...styles.estadoOption, ...styles.buttonFalse };
            }
        }
        return styles.estadoOption;
    };

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

                <View style={styles.seccionContainer}>
                    <Text style={styles.seccionTitulo}>Acciones</Text>
                    {denuncia.estado === "resuelto" ||
                    denuncia.estado === "falso" ? (
                        <Button
                            mode="contained"
                            style={[styles.actionButton]}
                            onPress={() => setModalObservacionVisible(true)}
                        >
                            Agregar Observación
                        </Button>
                    ) : denuncia.estado === "en progreso" ? (
                        <>
                            <Button
                                mode="contained"
                                style={[styles.actionButton]}
                                onPress={() =>
                                    Alert.alert(
                                        "Notificación enviada",
                                        "El policía está en camino."
                                    )
                                }
                            >
                                Notificar en camino
                            </Button>
                            <Button
                                mode="contained"
                                style={[styles.actionButton]}
                                onPress={() => setModalVisible(true)}
                            >
                                Cerrar Solicitud
                            </Button>
                        </>
                    ) : null}
                </View>

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

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Cerrar Solicitud</Text>
                        <View style={styles.estadoContainer}>
                            <TouchableOpacity
                                style={getEstadoOptionStyles("Resuelto")}
                                onPress={() => setEstadoCierre("Resuelto")}
                            >
                                <Text
                                    style={[
                                        styles.estadoText,
                                        estadoCierre === "Resuelto" && {
                                            color: "#155724",
                                        },
                                    ]}
                                >
                                    Resuelto
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={getEstadoOptionStyles("Falso")}
                                onPress={() => setEstadoCierre("Falso")}
                            >
                                <Text
                                    style={[
                                        styles.estadoText,
                                        estadoCierre === "Falso" && {
                                            color: "#721c24",
                                        },
                                    ]}
                                >
                                    Falso
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            label="Observación"
                            value={observacion}
                            onChangeText={(text) => setObservacion(text)}
                            mode="outlined"
                            multiline
                            numberOfLines={4}
                            style={styles.input}
                        />
                        <Button
                            mode="contained"
                            onPress={handleCerrarSolicitud}
                            style={styles.actionButton}
                        >
                            Cerrar Solicitud
                        </Button>
                        <Button
                            mode="text"
                            onPress={() => setModalVisible(false)}
                            style={styles.cancelButton}
                        >
                            Cancelar
                        </Button>
                    </View>
                </View>
            </Modal>

            <Modal
                visible={modalObservacionVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalObservacionVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            Agregar Observación
                        </Text>
                        <TextInput
                            label="Observación"
                            value={observacionNueva}
                            onChangeText={(text) => setObservacionNueva(text)}
                            mode="outlined"
                            multiline
                            numberOfLines={4}
                            style={styles.input}
                        />
                        <Button
                            mode="contained"
                            onPress={handleAgregarObservacion}
                            style={styles.actionButton}
                        >
                            Agregar Observación
                        </Button>
                        <Button
                            mode="text"
                            onPress={() => setModalObservacionVisible(false)}
                            style={styles.cancelButton}
                        >
                            Cancelar
                        </Button>
                    </View>
                </View>
            </Modal>
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
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        width: "80%",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    estadoContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    estadoOption: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#ccc",
        marginHorizontal: 5,
    },
    estadoText: {
        fontSize: 16,
    },
    buttonResolved: {
        backgroundColor: "#d4edda",
        color: "#155724",
    },
    buttonFalse: {
        backgroundColor: "#f8d7da",
        color: "#721c24",
    },
    input: {
        marginBottom: 20,
    },
    actionButton: {
        marginBottom: 10,
    },
    cancelButton: {
        marginTop: 10,
    },
    buttonNotified: {
        backgroundColor: "#e7f3fe",
        color: "#0b73ee",
    },
    buttonClose: {
        backgroundColor: "#f8f9fa",
        color: "#000",
    },
});

export default DenunciaItemPoliceScreen;
