import React from "react";
import { View, Text, StyleSheet } from "react-native";

const AlertasScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Pantalla para alertas</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
  },
});

export default AlertasScreen;
