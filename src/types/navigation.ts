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
  Connection: any;
  Messages: undefined;
  Notifications: undefined;
  AIAssistant: undefined;
  Discover: undefined;
  DiscoverStack: undefined;
  University: {
    data: any;
  };
  //   YourConnections: undefined;
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
  NewCommunityGroupFilterScreen: any;
  NewGroupPost: any;
  //   University: {

  //       pathUrl: string;

  //   };
};

export type RootScreenProps<
  S extends keyof RootStackParamList = keyof RootStackParamList,
> = StackScreenProps<RootStackParamList, S>;
