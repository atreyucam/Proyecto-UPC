import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "@/screens/LoginScreen";
import BottomTabAuthNavigator from "./BottomTabAuthNavigator";

const Stack = createNativeStackNavigator();

const AuthNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Login"
      component={BottomTabAuthNavigator}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

export default AuthNavigator;



