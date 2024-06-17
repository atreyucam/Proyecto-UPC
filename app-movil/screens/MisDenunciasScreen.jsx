import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, Alert } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import axios from "axios";

const MisDenunciasScreen = () => {
  const [denuncias, setDenuncias] = useState([]);

  const fetchDenuncias = async () => {
    try {
      const response = await axios.get("http://192.168.0.6:3000/api/solicitudPersona", {
        params: {
          id_persona: 1  // ID fijo para pruebas
        }
      });
      setDenuncias(response.data);
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al obtener las denuncias");
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDenuncias();
    }, [])
  );

  const renderItem = ({ item }) => {
    let tipoDenuncia = "";
    if (item.SolicitudEventoPersonas.length > 0) {
      const evento = item.SolicitudEventoPersonas[0].Evento;
      if (evento.id_evento === 1) {
        tipoDenuncia = `Botón de seguridad (${item.Subtipo.descripcion})`;
      } else if (evento.id_evento === 2) {
        tipoDenuncia = `Denuncia ciudadana (${item.Subtipo.descripcion})`;
      } else if (evento.id_evento === 3) {
        tipoDenuncia = `Servicio comunitario (${item.Subtipo.descripcion})`;
      }
    }

    return (
      <View style={styles.item}>
        <Text style={styles.title}>{tipoDenuncia}</Text>
        <Text>Estado: {item.Estado.descripcion}</Text>
        <Text>{item.observacion}</Text>
        <Text>{item.direccion}</Text>
        <Text>{item.puntoGPS}</Text>
        <Text>{new Date(item.fecha_creacion).toLocaleString()}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mis Denuncias</Text>
      <FlatList
        data={denuncias}
        renderItem={renderItem}
        keyExtractor={item => item.id_solicitud.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff'
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center'
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold'
  }
});

export default MisDenunciasScreen;
