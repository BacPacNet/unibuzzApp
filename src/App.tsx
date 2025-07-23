import "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MMKV } from "react-native-mmkv";

import { ThemeProvider } from "@/theme";

import ApplicationNavigator from "./navigators/Application";
import "./translations";
import "../global.css";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DevToolsBubble } from "react-native-react-query-devtools";
import { ToastProvider } from "react-native-toast-notifications";
import { getToken } from "./storage/token";
import { SafeScreen } from "./components/template";
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
              <ToastProvider>
                <ApplicationNavigator />
                {/* <DevToolsBubble /> */}
              </ToastProvider>
            </UserPasswordResetProvider>
          </AuthProvider>
          {/* </SafeScreen> */}
        </SafeAreaProvider>
      </ThemeProvider>
      {/*<ReactQueryDevtools initialIsOpen={false} />*/}
    </QueryClientProvider>
  );
}

export default App;
