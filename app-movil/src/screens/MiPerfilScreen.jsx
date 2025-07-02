import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { TextInput, Button, Appbar, IconButton } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-native";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig.extra.API_URL;
export default function MiPerfilScreen() {
    const { authState } = useContext(AuthContext);
    const navigate = useNavigate();
    const [perfilCargado, setPerfilCargado] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
    } = useForm();

    useEffect(() => {
        const cargarPerfil = async () => {
            try {
                const response = await axios.get(
                    `${API_URL}/persona/ciudadanoUser/${authState.user}`
                );
                const data = response.data;
                console.log("Datos del usuario:", data);

                setValue("cedula", data.cedula);
                setValue("nombres", data.nombres);
                setValue("apellidos", data.apellidos);
                setValue("telefono", data.telefono);
                setValue("email", data.email);
                setValue("genero", data.genero ? data.genero.trim() : "");

                setPerfilCargado(true);
            } catch (error) {
                console.error("Error al cargar el perfil:", error);
                Alert.alert(
                    "Error",
                    "No se pudo cargar la información del perfil."
                );
            }
        };

        if (authState.user) {
            cargarPerfil();
        }
    }, [authState.user, setValue]);

    const onSubmit = async (data) => {
        try {
            const actualizacionData = {
                nombres: data.nombres,
                apellidos: data.apellidos,
                telefono: data.telefono,
                email: data.email,
            };

            if (data.password) {
                actualizacionData.password = data.password;
            }

            const response = await axios.put(
                `${API_URL}/personas/${authState.user}`,
                actualizacionData
            );

            if (response.status === 200) {
                Alert.alert("Éxito", "Perfil actualizado correctamente.");
            } else {
                Alert.alert(
                    "Error",
                    "Hubo un problema al actualizar el perfil."
                );
            }
        } catch (error) {
            console.error("Error al actualizar el perfil:", error);
            Alert.alert(
                "Error",
                "No se pudo actualizar la información del perfil."
            );
        }
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

            <ScrollView>
                <View style={styles.formContainer}>
                    <Text style={styles.title}>Mi Perfil</Text>

                    {!perfilCargado ? (
                        <Text>Cargando perfil...</Text>
                    ) : (
                        <>
                            {/* Campos deshabilitados */}
                            <Controller
                                control={control}
                                name="cedula"
                                render={({ field: { value } }) => (
                                    <TextInput
                                        label="Cédula"
                                        mode="outlined"
                                        value={value}
                                        style={styles.input}
                                        disabled
                                    />
                                )}
                            />
                            <Controller
                                control={control}
                                name="nombres"
                                render={({ field: { value } }) => (
                                    <TextInput
                                        label="Nombres"
                                        mode="outlined"
                                        value={value}
                                        style={styles.input}
                                        disabled
                                    />
                                )}
                            />
                            <Controller
                                control={control}
                                name="apellidos"
                                render={({ field: { value } }) => (
                                    <TextInput
                                        label="Apellidos"
                                        mode="outlined"
                                        value={value}
                                        style={styles.input}
                                        disabled
                                    />
                                )}
                            />
                            <Controller
                                control={control}
                                name="genero"
                                render={({ field: { value } }) => (
                                    <TextInput
                                        label="Género"
                                        mode="outlined"
                                        value={value}
                                        style={styles.input}
                                        disabled
                                    />
                                )}
                            />

                            {/* Campos editables */}
                            <Controller
                                control={control}
                                name="telefono"
                                rules={{
                                    required: "El teléfono es obligatorio",
                                    pattern: {
                                        value: /^\d{10}$/,
                                        message: "Número de teléfono inválido",
                                    },
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        label="Teléfono"
                                        mode="outlined"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        style={styles.input}
                                        keyboardType="phone-pad"
                                    />
                                )}
                            />
                            {errors.telefono && (
                                <Text style={styles.errorText}>{errors.telefono.message}</Text>
                            )}

                            <Controller
                                control={control}
                                name="email"
                                rules={{
                                    required: "El email es obligatorio",
                                    pattern: {
                                        value: /\S+@\S+\.\S+/,
                                        message: "Correo electrónico inválido",
                                    },
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        label="Email"
                                        mode="outlined"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        style={styles.input}
                                        autoCapitalize="none"
                                    />
                                )}
                            />
                            {errors.email && (
                                <Text style={styles.errorText}>{errors.email.message}</Text>
                            )}

                            {/* Botones */}
                            <Button
                                mode="contained"
                                onPress={() => navigate("/actualizarContrasena")}
                                style={styles.button}
                            >
                                Actualizar Contraseña
                            </Button>

                            <Button
                                mode="contained"
                                onPress={handleSubmit(onSubmit)}
                                disabled={isSubmitting}
                                style={styles.button}
                                loading={isSubmitting}
                            >
                                Actualizar
                            </Button>
                        </>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    formContainer: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
    },
    title: {
        marginTop: 30,
        fontSize: 24,
        marginBottom: 20,
        textAlign: "center",
    },
    input: {
        marginBottom: 12,
    },
    errorText: {
        color: "red",
        marginBottom: 10,
        marginLeft: 10,
    },
    button: {
        marginTop: 10,
    },
});

