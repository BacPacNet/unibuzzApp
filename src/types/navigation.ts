import type { StackScreenProps } from "@react-navigation/stack";

export type RootStackParamList = {
  OnboardingScreen: undefined;
  //Startup: undefined;
  Example: undefined;
  LoginScreen: undefined;
  RegisterScreen: undefined;
  Timeline: undefined;
  NewPost: undefined;
  ProfileStack: any;
  Profile: {
    userId: string;
  };
  ProfileEdit: undefined;
  Home: undefined;
  Connections: undefined;
  Connection: undefined;
  Messages: undefined;
  Notifications: undefined;
  AIAssistant: undefined;
  Discover: undefined;
  DiscoverStack: undefined;
  University: {
    data: any;
  };
  YourConnections: undefined;
  //   University: {

  //       pathUrl: string;

  //   };
};

export type RootScreenProps<
  S extends keyof RootStackParamList = keyof RootStackParamList,
> = StackScreenProps<RootStackParamList, S>;
