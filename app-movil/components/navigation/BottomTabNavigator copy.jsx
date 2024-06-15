import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";

import HomeScreen from "@/screens/HomeScreen";
import Denunciar from "@/screens/DenunciarScreen";
import MisDenunciasScreen from "@/screens/MisDenunciasScreen";
import EmergenciaScreen from "@/screens/EmergenciaScreen";
import NotificacionesScreen from "@/screens/NotificacionesScreen";
import PerfilScreen from "@/screens/PerfilScreen";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        switch (route.name) {
          case "Perfil":
            iconName = focused ? "person-circle" : "person-circle-outline";
            break;
          case "Notificaciones":
            iconName = focused ? "notifications" : "notifications-outline";
            break;
          case "Emergencia":
            iconName = focused ? "alert-circle" : "alert-circle-outline";
            break;
          case "Mis Denuncias":
            iconName = focused ? "document-text" : "document-text-outline";
            break;
          case "Denunciar":
            iconName = focused ? "add-circle" : "add-circle-outline";
            break;
          case "Inicio":
            iconName = focused ? "home" : "home-outline";
            break;
          default:
            iconName = "help-circle";
            break;
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
    })}
    tabBarOptions={{
      activeTintColor: "blue",
      inactiveTintColor: "gray",
    }}
  >
    <Tab.Screen name="Perfil" component={PerfilScreen} />
    <Tab.Screen name="Notificaciones" component={NotificacionesScreen} />
    <Tab.Screen name="Emergencia" component={EmergenciaScreen} />
    <Tab.Screen name="Mis Denuncias" component={MisDenunciasScreen} />
    <Tab.Screen name="Denunciar" component={Denunciar} />
    <Tab.Screen name="Inicio" component={HomeScreen} />
  </Tab.Navigator>
);

export default BottomTabNavigator;
