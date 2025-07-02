// PasswordResetScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig.extra.API_URL;

const PasswordResetScreen = () => {
  const [step, setStep] = useState('forgot'); // 'forgot' o 'reset'
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSendCode = async () => {
    if (!email) {
      Alert.alert('Error', 'Por favor ingresa tu email');
      return;
    }
    try {
      const response = await axios.post(`http://${API_URL}/upc/forgot-password`, { email });
      Alert.alert('Éxito', response.data.message);
      // Cambiamos al paso de reseteo para que el usuario ingrese el código y nueva contraseña
      setStep('reset');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.response?.data?.message || 'Error al enviar el código');
    }
  };

  const handleResetPassword = async () => {
    if (!code || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }
    try {
      const response = await axios.post(`http://${API_URL}/upc/reset-password`, {
        email,
        code,
        newPassword,
      });
      Alert.alert('Éxito', response.data.message);
      // Opcionalmente, puedes reiniciar el formulario o redirigir al usuario al login
      setStep('forgot');
      setEmail('');
      setCode('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.response?.data?.message || 'Error al restablecer la contraseña');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar Contraseña</Text>
      {step === 'forgot' ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Button title="Enviar código" onPress={handleSendCode} />
        </>
      ) : (
        <>
          <Text style={styles.subtitle}>
            Se ha enviado un código a {email}. Ingresa el código y tu nueva contraseña.
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Código de 4 dígitos"
            value={code}
            onChangeText={setCode}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Nueva contraseña"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          <Button title="Restablecer contraseña" onPress={handleResetPassword} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center'
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
    borderRadius: 5
  }
});

export default PasswordResetScreen;
