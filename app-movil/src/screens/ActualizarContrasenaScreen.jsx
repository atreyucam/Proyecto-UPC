import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Appbar, IconButton } from "react-native-paper";
import { useNavigate } from "react-router-native";
import axios from "axios";
import { API_ENDPOINT } from "@env";
import { AuthContext } from "../context/AuthContext";

export default function ActualizarContrasenaScreen() {
    const { authState } = useContext(AuthContext);
    const navigate = useNavigate();
    const [contrasenaActual, setContrasenaActual] = useState("");
    const [nuevaContrasena, setNuevaContrasena] = useState("");
    const [confirmarContrasena, setConfirmarContrasena] = useState("");
    const [mostrarCamposNuevos, setMostrarCamposNuevos] = useState(false);

    const verificarContrasena = async () => {
        try {
            console.log("🔹 Enviando solicitud con:", {
                id_persona: authState.user,
                contrasena: contrasenaActual
            });
    
            const response = await axios.post(
                `${API_ENDPOINT}/persona/verificar-contrasena/${authState.user}`,
                {
                    contrasena: contrasenaActual
                }
            );
    
            console.log("🔹 Respuesta del backend:", response.data);
    
            if (response.data.mensaje === "Contraseña correcta") {
                setMostrarCamposNuevos(true);
            } else {
                Alert.alert("Error", "La contraseña actual es incorrecta.");
            }
        } catch (error) {
            Alert.alert("Error", "No se pudo verificar la contraseña.");
        }
    };
    
    

    const actualizarContrasena = async () => {
    if (nuevaContrasena !== confirmarContrasena) {
        Alert.alert("Error", "Las contraseñas no coinciden.");
        return;
    }

    try {
        const response = await axios.put(
            `${API_ENDPOINT}/persona/actualizar-contrasena/${authState.user}`, // <-- Aquí pasamos el ID en la URL
            { nuevaContrasena }, // <-- Solo enviamos la nueva contraseña en el body
            { headers: { "Content-Type": "application/json" } }
        );

        if (response.status === 200) {
            Alert.alert("Éxito", "Contraseña actualizada correctamente.");
            navigate("/miPerfil");
        }
    } catch (error) {
        console.error("Error al actualizar contraseña:", error);
        Alert.alert("Error", "No se pudo actualizar la contraseña.");
    }
};


    return (
        <View style={styles.container}>
            <Appbar.Header>
                <IconButton icon="arrow-left" color="white" size={24} onPress={() => navigate("/miPerfil")} />
                <Appbar.Content title="Actualizar Contraseña" />
            </Appbar.Header>

            <View style={styles.formContainer}>
                <Text style={styles.title}>Actualizar Contraseña</Text>

                <TextInput
                    label="Contraseña Actual"
                    mode="outlined"
                    secureTextEntry
                    value={contrasenaActual}
                    onChangeText={setContrasenaActual}
                    style={styles.input}
                />

                {!mostrarCamposNuevos && (
                    <Button mode="contained" onPress={verificarContrasena} style={styles.button}>
                        Verificar
                    </Button>
                )}

                {mostrarCamposNuevos && (
                    <>
                        <TextInput
                            label="Nueva Contraseña"
                            mode="outlined"
                            secureTextEntry
                            value={nuevaContrasena}
                            onChangeText={setNuevaContrasena}
                            style={styles.input}
                        />

                        <TextInput
                            label="Confirmar Nueva Contraseña"
                            mode="outlined"
                            secureTextEntry
                            value={confirmarContrasena}
                            onChangeText={setConfirmarContrasena}
                            style={styles.input}
                        />

                        <Button mode="contained" onPress={actualizarContrasena} style={styles.button}>
                            Guardar Cambios
                        </Button>
                    </>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    formContainer: { flex: 1, padding: 20 },
    title: { fontSize: 22, textAlign: "center", marginBottom: 20 },
    input: { marginBottom: 12 },
    button: { marginTop: 10 },
});
