import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Appbar, Card } from "react-native-paper";
import { useNavigate } from "react-router-native";

export default function HomeScreenPolicia() {
  const navigate = useNavigate();

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="UPC - Digital" />
        <Appbar.Action icon="bell" onPress={() => {}} />
      </Appbar.Header>

      <View style={styles.content}>
        <Card
          style={styles.card}
          onPress={() => navigate("/denunciasAsignadas")}
        >
          <Card.Content style={styles.cardContent}>
            <Text style={styles.cardTitle}>Denuncias asignadas</Text>
          </Card.Content>
        </Card>

        <Card style={styles.card} onPress={() => navigate("/resumenActividad")}>
          <Card.Content style={styles.cardContent}>
            <Text style={styles.cardTitle}>Resumen de actividad</Text>
          </Card.Content>
        </Card>

        <Card style={styles.card} onPress={() => navigate("/Emergencia")}>
          <Card.Content style={styles.cardContent}>
            <Text style={styles.cardTitle}>Botón de emergencia</Text>
          </Card.Content>
        </Card>

        <Card
          style={styles.card}
          onPress={() => navigate("/informacionPolicias")}
        >
          <Card.Content style={styles.cardContent}>
            <Text style={styles.cardTitle}>Información policías</Text>
          </Card.Content>
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  card: {
    marginVertical: 10,
    borderRadius: 8,
  },
  cardContent: {
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
