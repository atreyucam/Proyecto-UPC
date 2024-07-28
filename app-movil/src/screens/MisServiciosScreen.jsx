import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Appbar, IconButton } from "react-native-paper";
import { Link, useNavigate } from "react-router-native";
import MenuOpcionNav from "./components/MenuOpcionNav";
import Notificacion from "./components/Notificacion";

const MisServiciosScreen = () => {
  const navigate = useNavigate();

  return (
    <View style={styles.container}>
      <Appbar.Header>
        {/* Botón de navegación con IconButton y Link */}
        <IconButton
          icon="arrow-left"
          color="white"
          size={24}
          onPress={() => navigate("/")} // Navegar a la pantalla "Mis Denuncias"
        />
        <Appbar.Content title="Volver" />
        <IconButton
          icon="home"
          color="white"
          size={30}
          onPress={() => navigate("/")} // Navegar a la pantalla "Mis Denuncias"
        />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Contenido de la pantalla Mis Denuncias */}
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
});
export default MisServiciosScreen;
