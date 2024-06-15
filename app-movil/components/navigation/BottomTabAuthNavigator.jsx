import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";

import LoginScreen from "@/screens/LoginScreen";
import RegistroScreen from "@/screens/RegistroScreen";

const Tab = createBottomTabNavigator();

const BottomTabAuthNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === "Login") {
          iconName = focused ? "person-circle" : "person-circle-outline";
        } else if (route.name === "Registro") {
          iconName = focused ? "keypad" : "keypad-outline";
        }

        // Devuelve el componente de icono con el nombre y estilo apropiados
        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: "blue",
      tabBarInactiveTintColor: "gray",
    })}
  >
    <Tab.Screen name="Login" component={LoginScreen} />
    <Tab.Screen name="Registro" component={RegistroScreen} />
  </Tab.Navigator>
);

export default BottomTabAuthNavigator;
