import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Denunciar = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Denunciar</Text>
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

export default Denunciar;
