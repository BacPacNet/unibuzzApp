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
import { useFirebaseMessaging } from "./hooks/useFirebaseMessaging";

export const queryClient = new QueryClient();

export const storage = new MMKV();

function App() {
  // useFirebaseMessaging();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider storage={storage}>
        <SafeAreaProvider>
          {/* <SafeScreen> */}
          <AuthProvider>
            <UserPasswordResetProvider>
              <InnerApp />
            </UserPasswordResetProvider>
          </AuthProvider>
          {/* </SafeScreen> */}
        </SafeAreaProvider>
      </ThemeProvider>
      {/*<ReactQueryDevtools initialIsOpen={false} />*/}
    </QueryClientProvider>
  );
}

function InnerApp() {
  const insets = useSafeAreaInsets();

  return (
    <ToastProvider offsetTop={insets.top} offsetBottom={insets.bottom}>
      <ApplicationNavigator />
      {/* <DevToolsBubble /> */}
    </ToastProvider>
  );
}

export default App;
