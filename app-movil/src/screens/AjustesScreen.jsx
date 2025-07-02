import React, { useContext } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useNavigate } from "react-router-native";
import { useNavigation } from "@react-navigation/native";
import { Appbar, Card } from "react-native-paper";
import Notificacion from "./components/Notificacion";
import { AuthContext } from "../context/AuthContext"; // Importa el AuthContext

export default function AjustesScreen() {
    const navigate = useNavigate();
    const navigation = useNavigation();
    const { logout } = useContext(AuthContext); // Obtén la función logout del contexto

    const handleLogout = () => {
        try {
            logout(); // Llama a la función logout para cerrar sesión
            navigate("/login"); // Navega a la pantalla de inicio de sesión
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.Content title="AJUSTES" />
                <Notificacion />
            </Appbar.Header>
            <View style={styles.cardsContainer}>
                {/* 2 primeras */}
                <View style={styles.row}>
                    <Card style={styles.card} onPress={handleLogout}>
                        <Card.Content>
                            <Text style={styles.title}>Cerrar Sesión</Text>
                            <Image
                                source={require("../../assets/logOut_icono.png")}
                                style={styles.image}
                                resizeMode="contain"
                            />
                            <Text style={styles.paragraph}>
                                Salir de la aplicación
                            </Text>
                        </Card.Content>
                    </Card>
                    <Card
                        style={styles.card}
                        onPress={() => {
                            navigate("/miPerfil");
                        }}
                    >
                        <Card.Content>
                            <Text style={styles.title}>Perfil</Text>
                            <Image
                                source={require("../../assets/perfil.png")}
                                style={styles.image}
                                resizeMode="contain"
                            />
                            <Text style={styles.paragraph}>
                                Ajustes en mi perfil
                            </Text>
                        </Card.Content>
                    </Card>
                </View>
                {/* 2 segundas */}
                <View style={styles.row}>
                    {/* <Card
                        style={styles.card}
                        onPress={() => {
                            navigate("/devs");
                        }}
                    >
                        <Card.Content>
                            <Text style={styles.title}>DEVS</Text>
                            <Image
                                source={require("../../assets/devs.png")}
                                style={styles.image}
                                resizeMode="contain"
                            />
                            <Text style={styles.paragraph}>
                                Equipo de desarrollo
                            </Text>
                        </Card.Content>
                    </Card> */}

                    <Card
                        style={styles.card}
                        onPress={() => {
                            navigate("/informacion");
                        }}
                    >
                        <Card.Content>
                            <Text style={styles.title}>Información</Text>
                            <Image
                                source={require("../../assets/informacion_home.png")}
                                style={styles.image}
                                resizeMode="contain"
                            />
                            <Text style={styles.paragraph}>Ayuda</Text>
                        </Card.Content>
                    </Card>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
    },
    cardsContainer: {
        flex: 1,
        justifyContent: "center",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    card: {
        flex: 1,
        margin: 5,
    },
    image: {
        width: "100%",
        height: 100, // Ajusta la altura según tus necesidades
        marginVertical: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
    paragraph: {
        fontSize: 14,
    },
});
