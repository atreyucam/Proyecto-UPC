import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-native";
import { UserContext } from "../context/UserContext";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig.extra.API_URL;

const RegistroScreen = () => {
    const navigate = useNavigate();
    const { userState, registroUsuario } = useContext(UserContext);
    const [isVerifying, setIsVerifying] = useState(false);
    const [subzonas, setSubzonas] = useState([]);
    const [cantones, setCantones] = useState([]);
    const [parroquias, setParroquias] = useState([]);

    useEffect(() => {
        const fetchSubzonas = async () => {
            try {
                const response = await axios.get(`${API_URL}/circuitos/subzonas`);
                setSubzonas(response.data);
            } catch (error) {
                console.error("❌ Error al obtener subzonas:", error);
            }
        };
        fetchSubzonas();
    }, []);
    const handleSubzonaChange = async (subzonaId) => {
        setValue("id_subzona", subzonaId);
        setCantones([]);
        setParroquias([]);
        setValue("id_canton", "");
        setValue("id_parroquia", "");
    
        try {
            const response = await axios.get(`${API_URL}/circuitos/subzonas/${subzonaId}/cantones`);
            setCantones(response.data);
        } catch (error) {
            console.error("❌ Error al obtener cantones:", error);
        }
    };
    
    const handleCantonChange = async (cantonId) => {
        setValue("id_canton", cantonId);
        setParroquias([]);
        setValue("id_parroquia", "");
    
        try {
            const response = await axios.get(`${API_URL}/circuitos/cantones/${cantonId}/parroquias`);
            setParroquias(response.data);
        } catch (error) {
            console.error("❌ Error al obtener parroquias:", error);
        }
    };
    

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        setValue,
        setError,
    } = useForm();

    const verifyCedula = async () => {
        const cedula = watch("cedula", "").trim();
        console.log(`🔍 Verificando cédula: ${cedula}`);

        if (!/^\d{10}$/.test(cedula)) {
            setError("cedula", { type: "manual", message: "Cédula inválida" });
            console.log("❌ Error: Formato de cédula inválido.");
            return;
        }

        setIsVerifying(true);
        try {
            const response = await axios.get(`${API_URL}/persona/verificarCedula/${cedula}`);
            console.log("✅ Respuesta de la API:", response.data);

            const { nombres, apellidos, fecha_nacimiento, genero } = response.data;

            setValue("nombres", nombres);
            setValue("apellidos", apellidos);
            setValue("fecha_nacimiento", fecha_nacimiento);
            setValue("genero", genero);

            console.log("📝 Datos autocompletados correctamente.");

        } catch (error) {
            console.error("❌ Error verificando cédula:", error.response?.data || error.message);
            Alert.alert("Error", "No se encontró información con esta cédula.");
        }
        setIsVerifying(false);
    };

    const onSubmit = async (data) => {
        try {
            console.log("📤 Enviando datos al backend:", data);
            
            // Enviar solicitud al backend
            const response = await axios.post(`${API_URL}/persona/nuevoCiudadano`, {
                cedula: data.cedula,
                email: data.email,
                password: data.password,
                telefono: data.telefono,
                id_canton: data.id_canton,
                id_subzona: data.id_subzona,
                id_parroquia: data.id_parroquia || null, // Opcional
            });
    
            console.log("✅ Registro exitoso:", response.data);
            
            Alert.alert("Registro Exitoso", "Se ha registrado satisfactoriamente", [
                { text: "OK", onPress: () => navigate("/login") },
            ]);
    
        } catch (error) {
            console.error("❌ Error al registrar usuario:", error.response?.data || error.message);
            Alert.alert("Error", "No se pudo completar el registro. Verifique los datos.");
        }
    };
    
    

    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.formContainer}>
                    <Text style={styles.title}>Registro</Text>

                    {/* Cédula + Verificación */}
                    <View style={styles.row}>
                        <Controller
                            control={control}
                            name="cedula"
                            rules={{
                                required: "La cédula es obligatoria",
                                pattern: { value: /^\d{10}$/, message: "Cédula inválida" },
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    label="Cédula"
                                    mode="outlined"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    style={[styles.input, { flex: 1 }]}
                                    keyboardType="phone-pad"
                                    outlineColor={errors.cedula ? "red" : "#78288c"}
                                />
                            )}
                        />
                        <Button mode="contained" onPress={verifyCedula} disabled={isVerifying} style={styles.verifyButton}>
                            {isVerifying ? "Verificando..." : "Verificar"}
                        </Button>
                    </View>
                    {errors.cedula && <Text style={styles.errorText}>{errors.cedula.message}</Text>}

                    {/* Datos autocompletados */}
                    <Controller control={control} name="nombres" render={({ field: { value } }) => (
                        <TextInput label="Nombres" mode="outlined" value={value} style={styles.input} disabled />
                    )} />
                    <Controller control={control} name="apellidos" render={({ field: { value } }) => (
                        <TextInput label="Apellidos" mode="outlined" value={value} style={styles.input} disabled />
                    )} />
                    <Controller control={control} name="fecha_nacimiento" render={({ field: { value } }) => (
                        <TextInput label="Fecha de nacimiento" mode="outlined" value={value} style={styles.input} disabled />
                    )} />
                    <Controller control={control} name="genero" render={({ field: { value } }) => (
                        <TextInput label="Género" mode="outlined" value={value} style={styles.input} disabled />
                    )} />

                    {/* Subzona */}
<Controller
    control={control}
    name="id_subzona"
    rules={{ required: "La subzona es obligatoria" }}
    render={({ field: { onChange, value } }) => (
        <View style={styles.pickerContainer}>
            <Picker
                selectedValue={value}
                onValueChange={(itemValue) => {
                    onChange(itemValue);
                    handleSubzonaChange(itemValue);
                }}
                style={styles.picker}
            >
                <Picker.Item label="Seleccione una subzona" value="" />
                {subzonas.map((subzona) => (
                    <Picker.Item key={subzona.id_subzona} label={subzona.nombre_subzona} value={subzona.id_subzona} />
                ))}
            </Picker>
        </View>
    )}
/>
{errors.id_subzona && <Text style={styles.errorText}>{errors.id_subzona.message}</Text>}

{/* Cantón */}
<Controller
    control={control}
    name="id_canton"
    rules={{ required: "El cantón es obligatorio" }}
    render={({ field: { onChange, value } }) => (
        <View style={styles.pickerContainer}>
            <Picker
                selectedValue={value}
                onValueChange={(itemValue) => {
                    onChange(itemValue);
                    handleCantonChange(itemValue);
                }}
                style={styles.picker}
            >
                <Picker.Item label="Seleccione un cantón" value="" />
                {cantones.map((canton) => (
                    <Picker.Item key={canton.id_canton} label={canton.nombre_canton} value={canton.id_canton} />
                ))}
            </Picker>
        </View>
    )}
/>
{errors.id_canton && <Text style={styles.errorText}>{errors.id_canton.message}</Text>}

{/* Parroquia (Opcional) */}
<Controller
    control={control}
    name="id_parroquia"
    render={({ field: { onChange, value } }) => (
        <View style={styles.pickerContainer}>
            <Picker selectedValue={value} onValueChange={onChange} style={styles.picker}>
                <Picker.Item label="Seleccione una parroquia (opcional)" value="" />
                {parroquias.map((parroquia) => (
                    <Picker.Item key={parroquia.id_parroquia} label={parroquia.nombre_parroquia} value={parroquia.id_parroquia} />
                ))}
            </Picker>
        </View>
    )}
/>


                    {/* Campos ingresados por el usuario */}
                    <Controller control={control} name="telefono" rules={{ required: "El telefono es obligatorio" }} render={({ field: { onChange, value } }) => (
                        <TextInput label="Telefono" mode="outlined" keyboardType="phone-pad" onChangeText={onChange} value={value} style={styles.input} autoCapitalize="none" />
                    )} />
                    <Controller control={control} name="email" rules={{ required: "El email es obligatorio" }} render={({ field: { onChange, value } }) => (
                        <TextInput label="Email" mode="outlined" onChangeText={onChange} value={value} style={styles.input} autoCapitalize="none" />
                    )} />

                    <Controller control={control} name="password" rules={{ required: "La contraseña es obligatoria" }} render={({ field: { onChange, value } }) => (
                        <TextInput label="Contraseña" mode="outlined"  onChangeText={onChange} value={value} secureTextEntry style={styles.input} />
                    )} />

                    <Controller control={control} name="confirmPassword" rules={{ required: "Debe confirmar la contraseña" }} render={({ field: { onChange, value } }) => (
                        <TextInput label="Confirmar contraseña" mode="outlined" onChangeText={onChange} value={value} secureTextEntry style={styles.input} />
                    )} />

                    {/* Botón de Registro */}
                    <Button mode="contained" onPress={handleSubmit(onSubmit)} disabled={isSubmitting} style={styles.button}>
                        Registrarse
                    </Button>

                    <Button onPress={() => navigate("/login")} color="#007BFF">
                        ¿Ya tienes una cuenta? Inicia sesión
                    </Button>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    formContainer: { padding: 20 },
    title: { fontSize: 24, textAlign: "center", marginBottom: 20 },
    input: { marginBottom: 12 },
    errorText: { color: "red", marginBottom: 10 },
    button: { marginTop: 10 },
    row: { flexDirection: "row", alignItems: "center" },
    verifyButton: { marginLeft: 10 },
    pickerContainer: {
        borderWidth: 1,
        borderColor: "#78288c",
        borderRadius: 4,
        marginBottom: 12,
        backgroundColor: "#fff",
    },
    picker: {
        height: 50,
        width: "100%",
        color: "#000",
    },
    
});

export default RegistroScreen;
