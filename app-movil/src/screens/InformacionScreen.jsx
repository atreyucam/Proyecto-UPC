import React from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { Appbar, IconButton, Card, Title, Paragraph } from "react-native-paper";
import { useNavigate } from "react-router-native";

const InformacionScreen = () => {
  const navigate = useNavigate();

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <IconButton
          icon="arrow-left"
          color="white"
          size={24}
          onPress={() => navigate("/")} // Navegar a la pantalla principal
        />
        <Appbar.Content title="Información de la Aplicación" />
        <IconButton
          icon="home"
          color="white"
          size={24}
          onPress={() => navigate("/")} // Navegar a la pantalla principal
        />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          source={require("../../assets/manual.png")}
          style={styles.image}
        ></Image>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Botón de Emergencia</Title>
            <Paragraph>
              Permite acceder rápidamente a funciones de emergencia.
            </Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Panel de Denuncia</Title>
            <Paragraph>
              Permite seleccionar tipo de denuncia, ubicación y adjuntar fotos.
              Envía la denuncia para ser vista por las autoridades.
            </Paragraph>
          </Card.Content>
        </Card>
        <Image
          source={require("../../assets/manual.png")}
          style={styles.image}
        ></Image>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Lista de Denuncias</Title>
            <Paragraph>
              Muestra una lista con filtros para ver y detallar las denuncias
              realizadas.
            </Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Perfil</Title>
            <Paragraph>
              Permite configurar y editar tu perfil de usuario.
            </Paragraph>
          </Card.Content>
        </Card>
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
  },
  card: {
    marginBottom: 10,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: 10,
  },
});

export default InformacionScreen;
