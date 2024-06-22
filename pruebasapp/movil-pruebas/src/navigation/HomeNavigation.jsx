import React, { useContext, useEffect } from "react";
import {
  Provider as PaperProvider,
  BottomNavigation,
  DefaultTheme,
} from "react-native-paper";
import { View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import DenunciaScreen from "../screens/DenunciaScreen";
import AjustesScreen from "../screens/AjustesScreen";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-native";
import EmergenciaScreen from "../screens/Emergencia";
import HomeScreen from "../screens/HomeScreen";

export default function HomeNavigation() {
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (authState.isAuthenticated === false) {
      navigate("/login");
    }
  }, [authState.isAuthenticated]);

  const [index, setIndex] = React.useState(0);
  const routes = [
    { key: "home", title: "Home", icon: "home-outline" },
    { key: "denuncia", title: "Denuncia", icon: "file-document-outline" },
    { key: "emergencia", title: "Emergencia", icon: "car-emergency" },
    { key: "ajustes", title: "Ajustes", icon: "cog" },
  ];

  const renderScene = BottomNavigation.SceneMap({
    home: HomeScreen,
    denuncia: DenunciaScreen,
    emergencia: EmergenciaScreen,
    ajustes: AjustesScreen,
  });

  return (
    <PaperProvider theme={DefaultTheme}>
      <View style={{ flex: 1 }}>
        <BottomNavigation
          navigationState={{ index, routes }}
          onIndexChange={setIndex}
          renderScene={renderScene}
          renderIcon={({ route, color }) => (
            <Icon name={route.icon} color={color} size={24} />
          )}
        />
      </View>
    </PaperProvider>
  );
}
