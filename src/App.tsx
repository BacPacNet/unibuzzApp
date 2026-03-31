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
import MixPanelProvider from "./context/MixPanelProvider/MixPanelProvidex";
import { useForceUpdate } from "@/hooks/useForceUpdate";
import ForceUpdateModal from "@/components/molecules/ForceUpdateModal";

export const queryClient = new QueryClient();
export const storage = new MMKV();

const MIN_REQUIRED_VERSION = "0.1.14";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider storage={storage}>
        <SafeAreaProvider>
          <AuthProvider>
            <UserPasswordResetProvider>
              <MixPanelProvider>
                <InnerApp />
              </MixPanelProvider>
            </UserPasswordResetProvider>
          </AuthProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

function InnerApp() {
  const insets = useSafeAreaInsets();
  const { isOutdated, currentVersion, minRequiredVersion } =
    useForceUpdate(MIN_REQUIRED_VERSION);

  return (
    <ToastProvider offsetTop={insets.top} offsetBottom={insets.bottom}>
      <ForceUpdateModal
        visible={isOutdated}
        currentVersion={currentVersion}
        minRequiredVersion={minRequiredVersion}
      />
      <ApplicationNavigator />
    </ToastProvider>
  );
}

export default App;
