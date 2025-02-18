import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Link, useNavigate } from "react-router-native";
import { useNavigation } from "@react-navigation/native";

import {
  Appbar,
  IconButton,
  Menu,
  Card,
  Title,
  Paragraph,
} from "react-native-paper";
import Notificacion from "./components/Notificacion";
import MenuOpcionNav from "./components/MenuOpcionNav";

export default function HomeScreen() {
  const [visible, setVisible] = React.useState(false);
  const navigate = useNavigate();
  const navigation = useNavigation();
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="UPC - Digital" />
        <Notificacion />
      </Appbar.Header>
      <View style={styles.cardsContainer}>
        {/* 2 primeras */}
        <View style={styles.row}>
          <Card
            style={styles.card}
            onPress={() => {
              navigate("/misDenuncias");
            }}
          >
            <Card.Content>
              <Title>Mis denuncias</Title>
              <Image
                source={require("../../assets/escudo_home.png")}
                style={styles.image}
                resizeMode="contain"
              />
              <Paragraph>Denuncias realizadas</Paragraph>
            </Card.Content>
          </Card>
          <Card
            style={styles.card}
            onPress={() => {
              navigation.navigate("Denuncia");
            }}
          >
            <Card.Content>
              <Title>Realizar solicitud</Title>
              <Image
                source={require("../../assets/personsa_home.png")}
                style={styles.image}
                resizeMode="contain"
              />
              <Paragraph>Denuncias y servicios</Paragraph>
            </Card.Content>
          </Card>
        </View>
        {/* 2 segundas */}
        <View style={styles.row}>
          <Card
            style={styles.card}
            onPress={() => {
              navigation.navigate("Emergencia");
            }}
          >
            <Card.Content>
              <Title>Emergencia</Title>
              <Image
                source={require("../../assets/sos_home.png")}
                style={styles.image}
                resizeMode="contain"
              />
              <Paragraph>Boton de Seguridad</Paragraph>
            </Card.Content>
          </Card>

          {/* <Card
            style={styles.card}
            onPress={() => {
              navigate("/informacion");
            }}
          >
            <Card.Content>
              <Title>Informacion</Title>
              <Image
                source={require("../../assets/informacion_home.png")}
                style={styles.image}
                resizeMode="contain"
              />
              <Paragraph>Ayuda</Paragraph>
            </Card.Content>
          </Card> */}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  cardsContainer: {
    flex: 1,
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  card: {
    flex: 1,
    margin: 5,
  },
  cardsos: {
    flex: 1,
    margin: 5,
    textAlign: "center",
    marginHorizontal: "auto",
    paddingHorizontal: 50,
  },
  image: {
    width: "100%",
    height: 100, // Ajusta la altura según tus necesidades
    marginVertical: 10,
  },
  link: {
    textAlign: "center",
    marginTop: 20,
    color: "blue",
  },
});
