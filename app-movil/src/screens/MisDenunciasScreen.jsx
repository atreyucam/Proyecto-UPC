import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Appbar, IconButton, TextInput, Button } from "react-native-paper";
import { Link, useNavigate } from "react-router-native";
import Notificacion from "./components/Notificacion";
import MenuOpcionNav from "./components/MenuOpcionNav";

const MisDenunciasScreen = () => {
  const navigate = useNavigate();
  const [denuncias, setDenuncias] = useState([]);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    // Ejemplo ficticio de denuncias con atributos adicionales
    const mockDenuncias = [
      {
        id: 1,
        titulo: "denuncias1d",
        tipo: "Maltrato animal",
        descripcion: "Denuncia de maltrato a un perro callejero.",
        fecha: "2024-07-04T10:30:00Z",
        image:
          "https://cdn.pixabay.com/photo/2017/02/20/18/03/cat-2083492_1280.jpg",
        estado: "Pendiente",
      },
      {
        id: 2,
        titulo: "denuncias1d",
        tipo: "Contaminación ambiental",
        descripcion: "Denuncia de vertido ilegal de residuos.",
        fecha: "2024-07-03T15:45:00Z",
        image:
          "https://cdn.pixabay.com/photo/2017/02/20/18/03/cat-2083492_1280.jpg",
        estado: "Pendiente",
      },
      // Agrega más denuncias según tu estructura de datos
    ];
    setDenuncias(mockDenuncias);
  }, []);

  const aplicarFiltro = () => {
    // Lógica para aplicar el filtro según `filtro`
    // Aquí podrías filtrar por tipo de denuncia o descripción
    // En este ejemplo, se filtra por la descripción de la denuncia
    const filteredDenuncias = denuncias.filter((denuncia) =>
      denuncia.descripcion.toLowerCase().includes(filtro.toLowerCase())
    );
    setDenuncias(filteredDenuncias);
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        {/* Botón de navegación */}
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
          onPress={() => navigate("/")} // Navegar a la pantalla "Mis Denuncias"
        />
      </Appbar.Header>
      {/* Barra y filtros de búsqueda */}
      <View style={styles.searchContainer}>
        <TextInput
          label="Buscar denuncias por descripción"
          value={filtro}
          onChangeText={(text) => setFiltro(text)}
          style={styles.searchInput}
        />
        <Button mode="contained" onPress={aplicarFiltro}>
          Aplicar Filtro
        </Button>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Lista de denuncias */}
        {denuncias.map((denuncia) => (
          <Link key={denuncia.id} to={`/denuncia/${denuncia.id}`}>
            <View style={styles.denunciaItem}>
              <Text style={styles.denunciaTitulo}>{denuncia.tipo}</Text>
              <Text>{denuncia.descripcion}</Text>
              <Text style={styles.fechaText}>
                Fecha y hora: {new Date(denuncia.fecha).toLocaleString()}
              </Text>
            </View>
          </Link>
        ))}
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
  denunciaItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  denunciaTitulo: {
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
});

export default MisDenunciasScreen;
