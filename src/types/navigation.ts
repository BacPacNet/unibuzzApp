import type { StackScreenProps } from "@react-navigation/stack";

export type RootStackParamList = {
  OnboardingScreen: undefined;
  //Startup: undefined;
  Example: undefined;
  LoginScreen: undefined;
  RegisterScreen: undefined;
  Timeline: undefined;
  Home: undefined;
  Connections: undefined;
  Messages: undefined;
  Notifications: undefined;
  AI_Assistant: undefined;
  Discover: undefined;
  University: {
    data: any;
  };
  //   University: {

  //       pathUrl: string;

  //   };
};

export type RootScreenProps<
  S extends keyof RootStackParamList = keyof RootStackParamList,
> = StackScreenProps<RootStackParamList, S>;
