import React from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { Appbar, IconButton, Card, Title, Paragraph } from "react-native-paper";
import { useNavigate } from "react-router-native";
const developerImages = [
  require("../../assets/develop1.png"),
  require("../../assets/develop2.png"),
  require("../../assets/develop3.png"),
  require("../../assets/develop4.png"),
];

const DevsScreen = () => {
  const navigate = useNavigate();

  const developers = [
    {
      id: 1,
      name: "Desarrollador 1",
      email: "dev1@example.com",
      role: "Frontend",
    },
    {
      id: 2,
      name: "Desarrollador 2",
      email: "dev2@example.com",
      role: "Backend",
    },
    {
      id: 3,
      name: "Desarrollador 3",
      email: "dev3@example.com",
      role: "Móvil",
    },
    {
      id: 4,
      name: "Desarrollador 4",
      email: "dev4@example.com",
      role: "Fullstack",
    },
  ];
  return (
    <View style={styles.container}>
      <Appbar.Header>
        <IconButton
          icon="arrow-left"
          color="white"
          size={24}
          onPress={() => navigate("/")} // Navegar a la pantalla principal
        />
        <Appbar.Content title="Información de Desarrolladores" />
        <IconButton
          icon="home"
          color="white"
          size={24}
          onPress={() => navigate("/")} // Navegar a la pantalla principal
        />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Información sobre la Escuela Superior Politécnica de Chimborazo */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>
              Escuela Superior Politécnica de Chimborazo
            </Title>
            console.log("Otro image source:", variableImagen);
            <Image
              source={require("../../assets/logoEspoch.png")}
              style={styles.logo}
            />
            <Paragraph style={styles.paragraph}>
              Facultad de Informática y Electrónica{" "}
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              Ingenieria de softare
            </Paragraph>
            console.log("Otro image source:", variableImagen);
            <Image
            
              source={require("../../assets/logoFie.png")}
              style={styles.logo}
            />
          </Card.Content>
        </Card>


        {/* Tarjetas de información de los desarrolladores */}
        <Title style={styles.title}>DESARROLADORES</Title>
        <View style={styles.developersContainer}>
          {developers.map((developer, index) => (
            <Card key={developer.id} style={styles.cardDev}>
              <Card.Content style={styles.cardContent}>
              console.log("Image source:", developerImages[index]);
              <Image source={typeof developerImages[index] === "number" ? require("../../assets/devs.png"): developerImages[index]} style={styles.avatar} />                <Title style={styles.title}>{developer.name}</Title>
                <Paragraph style={styles.paragraph}>
                  {developer.email}
                </Paragraph>
                <Paragraph style={styles.paragraph}>{developer.role}</Paragraph>
              </Card.Content>
            </Card>
          ))}
        </View>
        {/* Información sobre la Policía Nacional del Ecuador (Riobamba) */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Policía Nacional del Ecuador (Riobamba)</Title>
            {/* Puedes agregar detalles específicos sobre la Policía Nacional aquí */}
            <Paragraph>
              Información relevante sobre la colaboración o relación con la
              Policía Nacional en Riobamba.
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
  cardDev: {
    width: "48%", // Ancho de cada tarjeta, ajustable según diseño
    marginBottom: 10,
    elevation: 3,
  },
  cardContent: {
    alignItems: "center", // Centra los elementos hijos horizontalmente
  },
  title: {
    textAlign: "center", // Centra el título horizontalmente
    marginBottom: 10, // Espacio inferior entre el título y el contenido siguiente
  },
  paragraph: {
    textAlign: "center", // Centra el párrafo horizontalmente
    marginBottom: 10, // Espacio inferior entre el párrafo y el siguiente elemento
  },
  logo: {
    width: 200, // Ajusta el ancho según tu diseño
    height: 100, // Ajusta el alto según tu diseño
    resizeMode: "contain", // Ajusta el modo de redimensionamiento según tus necesidades
    alignSelf: "center", // Centra la imagen horizontalmente
    marginVertical: 10, // Espacio vertical alrededor de la imagen
  },
  developersContainer: {
    flexDirection: "row", // Distribuye las tarjetas en fila
    flexWrap: "wrap", // Permite envolver las tarjetas si no caben en una sola línea
    justifyContent: "space-between", // Distribuye el espacio horizontalmente
  },
  avatar: {
    width: 100, // Ancho de la imagen del avatar
    height: 100, // Alto de la imagen del avatar
    borderRadius: 50, // Hace que la imagen sea circular (ajustable según diseño)
    marginBottom: 10, // Espacio inferior bajo la imagen
  },
});

export default DevsScreen;
