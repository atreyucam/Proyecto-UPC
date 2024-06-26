import React from "react";
import { StyleSheet, Text, View } from "react-native";

const SettingsScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Pantalla de ajustes</Text>
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

export default SettingsScreen;
