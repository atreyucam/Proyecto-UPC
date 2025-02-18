import { React } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NativeRouter } from "react-router-native";
import AppNavigator from "./src/navigation/AppNavigator.jsx";
import { AuthProvider } from "./src/context/AuthContext.jsx";
import { UserProvider } from "./src/context/UserContext.jsx";

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <UserProvider>
          <NativeRouter>
            <AppNavigator />
          </NativeRouter>
        </UserProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
