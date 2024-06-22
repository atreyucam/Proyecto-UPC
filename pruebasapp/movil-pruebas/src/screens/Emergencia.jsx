import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function EmergenciaScreen() {
  return (
    <View style={styles.container}>
      <Text>Emergencia</Text>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
}); 