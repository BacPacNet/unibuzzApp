import type { StackScreenProps } from "@react-navigation/stack";

export type RootStackParamList = {
  OnboardingScreen: undefined;
  //Startup: undefined;
  Example: undefined;
  LoginScreen: undefined;
  RegisterScreen: undefined;
  ForgetPassword: any;
  Rewards: undefined;
  Timeline: undefined;
  NewPost: undefined;
  ProfileStack: any;
  Profile: any;
  ProfileEdit: undefined;
  Home: undefined;
  Connections: any;
  Connection: any;
  ConnectionsFilter: any;
  Messages: any;
  MessagesStack: any;
  NewChatScreen: any;
  EditChatScreen: any;
  ChatMembersScreen: any;
  Notifications: undefined;
  BuzzBot: undefined;
  Discover: any;
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
    from: string;
    filterPostBy?: string;
  };

  //   manageGroupStack: any;
  Groups: any;
  SearchCommunityGroupScreen: {
    communityId: any;
  };
  SearchCommunityGroupFilterScreen: any;
  NewCommunityGroupScreen: any;
  EditCommunityGroupScreen: any;
  NewCommunityGroupFilterScreen: any;
  NewCommunityGroupUsersSelectScreen: any;
  NewGroupPost: any;
  //   University: {

  SettingsStack: any;
  Settings: undefined;
  UniversityVerification: undefined;
  UserNameChange: undefined;
  UserPasswordChange: undefined;
  UserEmailChange: undefined;
  UserAccountDeactivation: undefined;
  DeleteAccount: undefined;
  BlockUsers: undefined;
  Referral: undefined;
  SinglePost: any;
  UsersScreen: any;
  MembersScreen: any;
  InfoStackScreen: any;
  AboutUs: undefined;
};

export type RootScreenProps<
  S extends keyof RootStackParamList = keyof RootStackParamList,
> = StackScreenProps<RootStackParamList, S>;
