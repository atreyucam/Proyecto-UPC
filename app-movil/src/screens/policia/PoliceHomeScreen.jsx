import React, { useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { Appbar, Card, Title, Paragraph } from "react-native-paper";
import { useNavigate } from "react-router-native";

export default function HomeScreenPolicia() {
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState("");

  const handlePress = (buttonName, route) => {
    setActiveButton(buttonName);
    navigate(route);
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="UPC - Digital" />
        <Appbar.Action icon="bell" onPress={() => {}} />
      </Appbar.Header>

      <View style={styles.cardsContainer}>
        {/* Primera fila */}
        <View style={styles.row}>
          <Card
            style={styles.card}
            onPress={() => handlePress("denunciasAsignadas", "/denunciasAsignadas")}
          >
            <Card.Content style={styles.cardContent}>
              <Title style={styles.cardTitle}>Denuncias asignadas</Title>
              <Image source={require("../../../assets/denuncias.png")} style={styles.image} resizeMode="contain" />
              <Paragraph style={styles.cardText}>Denuncias en curso</Paragraph>
            </Card.Content>
          </Card>

          <Card
            style={styles.card}
            onPress={() => handlePress("resumenActividad", "/resumenActividad")}
          >
            <Card.Content style={styles.cardContent}>
              <Title style={styles.cardTitle}>Resumen de actividad</Title>
              <Image source={require("../../../assets/actividades.png")} style={styles.image} resizeMode="contain" />
              <Paragraph style={styles.cardText}>Actividades recientes</Paragraph>
            </Card.Content>
          </Card>
        </View>

        {/* Segunda fila */}
        <View style={styles.row}>
          <Card
            style={styles.card}
            onPress={() => handlePress("emergencia", "/Emergencia")}
          >
            <Card.Content style={styles.cardContent}>
              <Title style={styles.cardTitle}>Emergencia</Title>
              <Image source={require("../../../assets/sos_home.png")} style={styles.image} resizeMode="contain" />
              <Paragraph style={styles.cardText}>Botón de Seguridad</Paragraph>
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
    backgroundColor: "#f5f5f5",
  },
  cardsContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  card: {
    flex: 1,
    margin: 5,
    borderRadius: 8,
    backgroundColor: "#4a90e2", // Color de fondo
  },
  cardContent: {
    alignItems: "center",
    paddingVertical: 10,
  },
  image: {
    width: "100%",
    height: 100, 
    marginVertical: 10,
  },
  cardTitle: {
    fontSize: 18, 
    fontWeight: "bold",
    textAlign: "center",
    color: "#ffffff",
    marginBottom: 5,
  },
  cardText: {
    fontSize: 14, 
    textAlign: "center",
    color: "#ffffff",
  },
});
