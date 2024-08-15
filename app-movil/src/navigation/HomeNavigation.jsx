import React, { useContext, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import DenunciaScreen from "../screens/DenunciaScreen";
import AjustesScreen from "../screens/AjustesScreen";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-native";
import EmergenciaScreen from "../screens/Emergencia";
import HomeScreen from "../screens/HomeScreen";
import MisDenunciasScreen from "../screens/MisDenunciasScreen";

const Tab = createBottomTabNavigator();

export default function HomeNavigation() {
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (authState.isAuthenticated === false) {
      navigate("/login");
    }
  }, [authState.isAuthenticated]);

  return (
    <PaperProvider theme={DefaultTheme}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName;

              if (route.name === "Home") {
                iconName = "home-outline";
              } else if (route.name === "Denuncia") {
                iconName = "police-station";
              } else if (route.name === "Emergencia") {
                iconName = "car-emergency";
              } else if (route.name === "Ajustes") {
                iconName = "cog";
              }

              return <Icon name={iconName} size={size} color={color} />;
            },
            headerShown: false, // Ocultar el topbar
            tabBarActiveTintColor: "#78288c",
            tabBarInactiveTintColor: "gray",
            tabBarStyle: { backgroundColor: "#f5f5f5" },
            tabBarLabelStyle: { fontWeight: "bold" },
            tabBarHideOnKeyboard: true,
            tabBarAllowFontScaling: false,
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Denuncia" component={DenunciaScreen} />
          <Tab.Screen name="Emergencia" component={EmergenciaScreen} />
          <Tab.Screen name="Ajustes" component={AjustesScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
