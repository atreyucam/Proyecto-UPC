import React, { useState, useEffect, useContext } from "react";
import { TextInput, Button, Appbar, IconButton } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import * as Location from "expo-location";
import { StyleSheet, View, Image, Alert, ScrollView, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";

import Notificacion from "./components/Notificacion";
import { AuthContext } from "../context/AuthContext"; // Importa tu contexto de autenticación
import { useNavigate } from "react-router-native";
import { API_ENDPOINT } from "@env"; // Importar del .env


export default function DenunciaScreen() {
    const { authState } = useContext(AuthContext); // Obtén la información del usuario desde el contexto
    const [imageSource, setImageSource] = useState(null);
    const [ubicacion, setUbicacion] = useState(null);
    const [marker, setMarker] = useState(null);
    const navigate = useNavigate();

    const [initialRegion, setInitialRegion] = useState(null);
    const [tipos, setTipos] = useState([]);
    const [subtipos, setSubtipos] = useState([]);

    const [formData, setFormData] = useState({
        tipoDenuncia: "",
        subtipoDenuncia: "",
        descripcion: "",
        direccion: "",
    });

    useEffect(() => {
        fetchTipos();
    }, []);

    useEffect(() => {
        if (formData.tipoDenuncia) {
            fetchSubtipos(formData.tipoDenuncia);
        }
    }, [formData.tipoDenuncia]);

    const fetchTipos = async () => {
        try {
            const response = await fetch(`${API_ENDPOINT}/subtipos/tipos`);
            const data = await response.json();
            const filteredTipos = data.filter(
                (tipo) => tipo.id_tipo === 2 || tipo.id_tipo === 3
            );
            setTipos(filteredTipos);
        } catch (error) {
            console.error("Error fetching tipos:", error);
        }
    };

    const fetchSubtipos = async (id_tipo) => {
        try {
            const response = await fetch(
                `${API_ENDPOINT}/subtipos/tipos/${id_tipo}/subtipos`
            );
            const data = await response.json();
            setSubtipos(data);
        } catch (error) {
            console.error("Error fetching subtipos:", error);
        }
    };

    // const handleSelectImage = async (option) => {
    //     let pickerResult;
    //     if (option === "gallery") {
    //         let permissionResult =
    //             await ImagePicker.requestMediaLibraryPermissionsAsync();

    //         if (!permissionResult.granted) {
    //             Alert.alert(
    //                 "Permiso necesario",
    //                 "Se requiere acceso a la galería."
    //             );
    //             return;
    //         }

    //         pickerResult = await ImagePicker.launchImageLibraryAsync({
    //             mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //             allowsEditing: true,
    //             aspect: [4, 3],
    //             quality: 1,
    //         });
    //     } else if (option === "camera") {
    //         let permissionResult =
    //             await ImagePicker.requestCameraPermissionsAsync();

    //         if (!permissionResult.granted) {
    //             Alert.alert(
    //                 "Permiso necesario",
    //                 "Se requiere acceso a la cámara."
    //             );
    //             return;
    //         }

    //         pickerResult = await ImagePicker.launchCameraAsync({
    //             allowsEditing: true,
    //             aspect: [4, 3],
    //             quality: 1,
    //         });
    //     }

    //     if (!pickerResult.canceled) {
    //         const { uri } = pickerResult.assets[0];
    //         setImageSource({ uri });
    //         console.log({ uri }); // Loguea el valor de la imagen seleccionada
    //     }
    // };

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
        } catch (error) {
            console.error("Error al obtener la ubicación:", error);
        }
    };

    useEffect(() => {
        getLocation();
    }, []);

    const handleFormChange = (field, value) => {
        setFormData({
            ...formData,
            [field]: value,
        });
    };

    const handleSubmit = async () => {
        // Validar campos antes de enviar
        if (
            !formData.tipoDenuncia ||
            !formData.subtipoDenuncia ||
            !formData.descripcion
        ) {
            Alert.alert(
                "Faltan datos",
                "Por favor, completa todos los campos obligatorios."
            );
            return;
        }

        const denunciaData = {
            id_persona: authState.user, // Ajustar según sea necesario
            puntoGPS: ubicacion
                ? `${ubicacion.latitude},${ubicacion.longitude}`
                : "",
            direccion: formData.direccion,
            id_subtipo: formData.subtipoDenuncia,
            observacion: formData.descripcion,
        };

        try {
            const response = await fetch(
                `${API_ENDPOINT}/solicitud/nuevaSolicitud`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(denunciaData),
                }
            );

            const result = await response.json();
            if (response.ok) {
                Alert.alert(
                    "Denuncia registrada",
                    "Tu denuncia ha sido registrada con éxito."
                );
                navigate("/misDenuncias");
            } else {
                console.error("Error en la respuesta:", result);
                Alert.alert(
                    "Error",
                    "Hubo un problema al registrar tu denuncia."
                );
            }
        } catch (error) {
            console.error("Error al enviar denuncia:", error);
            Alert.alert(
                "Error",
                "Ocurrió un error inesperado al enviar la denuncia."
            );
        }
    };

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.Content title="Solicitudes" />
                <IconButton
                    icon="clipboard-list"
                    color="white"
                    size={24}
                    onPress={() => navigate("/misDenuncias")} // Navegar a la pantalla "Mis Denuncias"
                />
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
                    <View style={styles.pickerContainer}>
                        <Picker
                            style={styles.picker}
                            selectedValue={formData.tipoDenuncia}
                            onValueChange={(itemValue) =>
                                handleFormChange("tipoDenuncia", itemValue)
                            }
                        >
                            <Picker.Item
                                label="Seleccione tipo de solicitud"
                                value=""
                            />
                            {tipos.map((tipo) => (
                                <Picker.Item
                                    key={tipo.id_tipo}
                                    label={tipo.descripcion}
                                    value={tipo.id_tipo}
                                />
                            ))}
                        </Picker>
                    </View>
                    <View style={styles.pickerContainer}>
                        <Picker
                            style={styles.picker}
                            selectedValue={formData.subtipoDenuncia}
                            onValueChange={(itemValue) =>
                                handleFormChange("subtipoDenuncia", itemValue)
                            }
                            enabled={subtipos.length > 0}
                        >
                            <Picker.Item
                                label="Seleccione subtipo de solicitud"
                                value=""
                            />
                            {subtipos.map((subtipo) => (
                                <Picker.Item
                                    key={subtipo.id_subtipo}
                                    label={subtipo.descripcion}
                                    value={subtipo.id_subtipo}
                                />
                            ))}
                        </Picker>
                    </View>
                    <TextInput
                        label="Agrega una observación o descripción"
                        value={formData.descripcion}
                        onChangeText={(text) =>
                            handleFormChange("descripcion", text)
                        }
                        style={styles.input}
                        multiline
                    />
                    <TextInput
                        label="Referencia de ubicación"
                        value={formData.direccion}
                        onChangeText={(text) =>
                            handleFormChange("direccion", text)
                        }
                        style={styles.input}
                    />
                    
                    <Button
                        mode="contained"
                        onPress={handleSubmit}
                        style={styles.buttonDenuncia}
                    >
                        Emitir solicitud
                    </Button>

                    
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
    imagePreview: {
        width: "100%",
        height: 200,
        marginTop: 20,
    },
    input: {
        marginBottom: 10,
        marginHorizontal: 10,
    },
    inputFoto: {
        marginHorizontal: 10,
        marginVertical: 5,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: "#78288c",
        borderRadius: 4,
        marginBottom: 10,
        marginHorizontal: 10,
    },
    picker: {
        height: 50,
        width: "100%",
        marginBottom: 10,
    },
    buttonDenuncia: {
        marginHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: "red",
    },
    imagePickerContainer: {
        alignItems: "center",
    },
});
