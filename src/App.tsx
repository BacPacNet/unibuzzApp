import "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MMKV } from "react-native-mmkv";

import { ThemeProvider } from "@/theme";

import ApplicationNavigator from "./navigators/Application";
import "./translations";
import "../global.css";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { ToastProvider } from "react-native-toast-notifications";
import AuthProvider from "./context/AuthProvider/AuthProvider";
import { UserPasswordResetProvider } from "./context/UserPasswordResetProvider/UserPasswordResetProvider";

export const queryClient = new QueryClient();
export const storage = new MMKV();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider storage={storage}>
        <SafeAreaProvider>
          <AuthProvider>
            <UserPasswordResetProvider>
              <InnerApp />
            </UserPasswordResetProvider>
          </AuthProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

function InnerApp() {
  const insets = useSafeAreaInsets();

  return (
    <ToastProvider offsetTop={insets.top} offsetBottom={insets.bottom}>
      <ApplicationNavigator />
    </ToastProvider>
  );
}

export default App;
