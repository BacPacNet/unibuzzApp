import type { StackScreenProps } from "@react-navigation/stack";

export type RootStackParamList = {
  OnboardingScreen: undefined;
  //Startup: undefined;
  Example: undefined;
  LoginScreen: undefined;
  RegisterScreen: undefined;
  ForgetPassword: undefined;
  Timeline: undefined;
  NewPost: undefined;
  ProfileStack: any;
  Profile: {
    userId: string;
  };
  ProfileEdit: undefined;
  Home: undefined;
  Connections: undefined;
  Connection: any;
  Messages: undefined;
  Notifications: undefined;
  AIAssistant: undefined;
  Discover: undefined;
  DiscoverStack: any;
  University: {
    data: any;
  };
  YourConnections: {
    index: any;
    userId: any;
  };
  Community: {
    communityId: any;
  };
  CommunityGroup: {
    communityId: any;
    communityGroupId: any;
  };

  manageGroupStack: any;
  SearchCommunityGroupScreen: {
    communityId: any;
  };
  SearchCommunityGroupFilterScreen: any;
  NewCommunityGroupScreen: any;
  EditCommunityGroupScreen: any;
  NewCommunityGroupFilterScreen: any;
  NewGroupPost: any;
  //   University: {

  SettingsStack: any;
  Settings: undefined;
  UniversityVerification: undefined;
  UserNameChange: undefined;
  UserPasswordChange: undefined;
  UserEmailChange: undefined;
  UserAccountDeactivation: undefined;
  SinglePost: any;
};

export type RootScreenProps<
  S extends keyof RootStackParamList = keyof RootStackParamList,
> = StackScreenProps<RootStackParamList, S>;
