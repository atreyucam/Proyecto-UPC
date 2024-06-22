import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { Link } from "react-router-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text>HOME</Text>
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
