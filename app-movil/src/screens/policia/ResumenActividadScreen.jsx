import React, { useEffect, useState, useContext } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from "react-native";
import { useNavigate } from "react-router-native";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Card } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig.extra.API_URL;

const ResumenActividadScreen = () => {
    const [policiaData, setPoliciaData] = useState(null);
    const { authState } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPoliciaData = async () => {
            try {
                const response = await axios.get(
                    `${API_URL}/persona/policia/${authState.user}`
                );
                setPoliciaData(response.data);
            } catch (error) {
                Alert.alert("Error", "No se pudo cargar la información");
                console.error("Error fetching data:", error);
            }
        };

        if (authState.user) {
            fetchPoliciaData();
        }
    }, [authState.user]);

    const handleBackPress = () => {
        navigate(-1);
    };

    const handleNavigateToDetail = (denunciaId) => {
        navigate(`/denuncia/${denunciaId}`);
    };

    if (!policiaData) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Cargando datos...</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBackPress}>
                    <MaterialIcons name="arrow-back" size={24} color="#1976D2" />

                </TouchableOpacity>
                <Text style={styles.headerTitle}>Resumen de Actividad</Text>
                <View style={{ width: 24 }} />
            </View>

            <Card style={styles.card}>
                <Card.Title title="Resumen de Solicitudes Asignadas" />
                <Card.Content>
                    {Object.entries(
                        policiaData.resumen_solicitudes_asignadas
                    ).map(([tipo, cantidad]) => (
                        <View key={tipo} style={styles.tableRow}>
                            <Text style={styles.tableCell}>{tipo}</Text>
                            <Text style={styles.tableCell}>{cantidad}</Text>
                        </View>
                    ))}
                </Card.Content>
            </Card>

            <Card style={styles.card}>
                <Card.Title title="Total de Solicitudes" />
                <Card.Content>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCell}>Total</Text>
                        <Text style={styles.tableCell}>
                            {policiaData.total_solicitudes}
                        </Text>
                    </View>
                </Card.Content>
            </Card>

            <Card style={styles.card}>
                <Card.Title title="Solicitud Más Resuelta" />
                <Card.Content>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCell}>
                            {policiaData.solicitud_mas_resuelta}
                        </Text>
                        <Text style={styles.tableCell}>
                            {
                                policiaData.resumen_solicitudes_asignadas[
                                    policiaData.solicitud_mas_resuelta
                                ]
                            }
                        </Text>
                    </View>
                </Card.Content>
            </Card>

            <Card style={styles.card}>
                <Card.Title title="Solicitudes Asignadas" />
                <Card.Content>
                    {policiaData.solicitudes_asignadas.map((solicitud) => (
                        <TouchableOpacity
                            key={solicitud.id_solicitud}
                            onPress={() =>
                                handleNavigateToDetail(solicitud.id_solicitud)
                            }
                        >
                            <View style={styles.tableRow}>
                                <Text style={styles.tableCell}>
                                    {solicitud.id_solicitud}
                                </Text>
                                <Text style={styles.tableCell}>
                                    {solicitud.estado}
                                </Text>
                                <Text style={styles.tableCell}>
                                    {solicitud.subtipo}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </Card.Content>
            </Card>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingTop: 70,
        backgroundColor: "#FFFFFF", // Fondo blanco
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        flex: 1,
        textAlign: "center",
        color: "#1976D2", // Azul para título
    },
   card: {
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    elevation: 3,
    borderWidth: 1.2,
    borderColor: "#BBDEFB", // azul claro
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
},

    tableRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#EEE",
    },
    tableCell: {
        fontSize: 14,
        flex: 1,
        textAlign: "center",
        color: "#444",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
    },
});


export default ResumenActividadScreen;
