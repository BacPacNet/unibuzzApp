import { createStackNavigator } from "@react-navigation/stack";
import {
  DrawerActions,
  NavigationContainer,
  useNavigation,
} from "@react-navigation/native";

import { LoginScreen, RegisterScreen } from "@/screens";
import { useTheme } from "@/theme";

import type { RootStackParamList } from "@/types/navigation";
import OnboardingScreen from "@/screens/OnboardingScreen/OnboardingScreen";
import { useCallback, useEffect, useRef, useState } from "react";
import { storage } from "@/App";
import AuthGuard from "@/components/template/AuthGuard/AuthGuard";
import UnauthenticatedGuard from "@/components/template/UnauthenticatedGuard/UnauthenticatedGuard";
import { useAuth } from "@/context/AuthProvider/AuthContext";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Menu } from "iconoir-react-native";
import Notifications from "@/screens/NotificationsScreen";
import Messages from "@/screens/MessagesScreen";
import AI_Assistant from "@/screens/AIAssistantScreen";
import { Animated, Image, Pressable, Text, View } from "react-native";
import { getUserStore, getUserProfileStore } from "@/storage/user";
import { Drawer } from "react-native-drawer-layout";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { SocketProvider } from "@/context/SocketProvider/SocketProvider";
import ConnectionStack from "./ConnectionStack";
import avatar from "@/assets/avatar.png";
import Logo from "@/assets/unibuzz_logo.svg";

import { HeaderProvider, useHeader } from "@/context/HeaderProvider/Header";
import HomeStack from "./HomeStack";
import DiscoverStack from "./DiscoverStack";
import tabIcons from "@/constant/tabIcons";
import RightSideSidebar from "@/components/organism/RightSideSidebar";
import ProfileStack from "./ProfileStack";
import { SafeAreaView } from "react-native-safe-area-context";
import LeftSideSideBar from "@/components/organism/LeftSideSideBar";
import CommunityScreen from "@/screens/CommunityScreen";
import { CommunityProvider } from "@/context/CommunityProvider/CommunityProvider";
import CommunityGroupScreen from "@/screens/CommunityGroupScreen";
import SearchCommunityGroupScreen from "@/screens/SearchCommunityGroupsScreen";
import ManageGroups from "./ManageGroups";
import { CommunityFilterProvider } from "@/context/CommunityFilterProvider/CommunityFilterProvider";
import NewGroupPost from "@/screens/NewGroupPost";
import SettingsStack from "./SettingsStack";
import SinglePost from "@/screens/SinglePost/SinglePost";

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootStackParamList>();
const noHeaderScreens = [];
function ApplicationNavigator() {
  const { variant, navigationTheme } = useTheme();
  const { isAuthenticated, setAuthenticated, deauthenticate } = useAuth();
  const [isAppFirstLaunched, setIsAppFirstLaunched] = useState(false);
  const userProfileStore = getUserProfileStore();
  const user = getUserStore();
  useEffect(() => {
    const appData = storage.contains("isAppFirstLaunched");
    if (!appData) {
      storage.set("isAppFirstLaunched", true);
      setIsAppFirstLaunched(true);
    } else {
      setIsAppFirstLaunched(false);
    }

    if (user?.id) {
      setAuthenticated();
    }
  }, []);

  //tabs
  function TabsGroup() {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => tabIcons[route.name]?.(focused) || <></>,
          tabBarActiveTintColor: "#6744FF",
          tabBarInactiveTintColor: "black",
          tabBarStyle: { backgroundColor: "white" },
          tabBarLabelStyle: { fontSize: 12, fontWeight: "500" },
          headerShown: false,
          tabBarHideOnKeyboard: true,
        })}
      >
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen
          name="Connection"
          component={ConnectionStack}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              navigation.navigate("Connection", {
                screen: "Connections",
              });
            },
          })}
        />
        <Tab.Screen name="Messages" component={Messages} />
        <Tab.Screen name="Notifications" component={Notifications} />
        <Tab.Screen name="AIAssistant" component={AI_Assistant} />
        <Tab.Screen
          name="DiscoverStack"
          component={DiscoverStack}
          options={{ tabBarButton: () => null }}
        />
        <Tab.Screen
          name="ProfileStack"
          component={ProfileStack}
          options={{
            tabBarButton: () => null,
            // unmountOnBlur: true,
          }}
        />
        <Tab.Screen
          name="Community"
          component={CommunityScreen}
          options={{
            tabBarButton: () => null,
          }}
        />
        <Tab.Screen
          name="CommunityGroup"
          component={CommunityGroupScreen}
          options={{
            tabBarButton: () => null,
          }}
        />
        <Tab.Screen
          name="NewGroupPost"
          component={NewGroupPost}
          options={{
            tabBarButton: () => null,
          }}
        />

        <Tab.Screen
          name="manageGroupStack"
          component={ManageGroups}
          options={{ tabBarButton: () => null }}
        />
        {/* <Tab.Screen
          name="SearchCommunityGroupScreen"
          component={SearchCommunityGroupScreen}
          options={{
            tabBarButton: () => null,
          }}
        /> */}

        <Tab.Screen
          name="SettingsStack"
          component={SettingsStack}
          options={{
            tabBarButton: () => null,
            // unmountOnBlur: true,
          }}
        />
        <Tab.Screen
          name="SinglePost"
          component={SinglePost}
          options={{
            tabBarButton: () => null,
            // unmountOnBlur: true,
          }}
        />
      </Tab.Navigator>
    );
  }

  function AppMenuDrawerContent(props: any) {
    return <SafeAreaView style={{ padding: 20 }}></SafeAreaView>;
  }

  function UserProfileDrawerContent({ navigation, setRightDrawerOpen }: any) {
    const handleClick = (route: string) => {
      if (route == "Profile") {
        navigation.navigate("ProfileStack", {
          screen: "Profile",
          params: { userId: user?.id },
        });

        setRightDrawerOpen(false);
      } else if (route == "Settings") {
        navigation.navigate("SettingsStack", {
          screen: "Settings",
        });

        setRightDrawerOpen(false);
      } else {
        navigation.navigate(route);
        setRightDrawerOpen(false);
      }
    };
    return (
      <RightSideSidebar navigation={navigation} handleClick={handleClick} />
    );
  }

  const LeftDrawer = createDrawerNavigator();

  const LeftDrawerScreen = ({ navigation, setRightDrawerOpen }: any) => {
    const { showHeader, currScreen } = useHeader();

    //const animateHeader = useCallback(() => {
    //  LayoutAnimation.configureNext(
    //    LayoutAnimation.create(
    //      200,
    //      LayoutAnimation.Types.linear,
    //      LayoutAnimation.Properties.opacity
    //    )
    //  );

    //  Animated.timing(headerTranslateY, {
    //    toValue: showHeader ? 0 : -20,
    //    duration: 200,
    //    useNativeDriver: true,
    //  }).start();

    //  setHeaderHeight(showHeader ? 60 : 0);
    //}, [showHeader, headerTranslateY]);

    //useEffect(() => {
    //  animateHeader();
    //}, [showHeader, animateHeader]);
    return (
      <LeftDrawer.Navigator
        screenOptions={{
          drawerPosition: "left",
          headerShown: showHeader,
          headerLeftContainerStyle: {
            paddingHorizontal: 16,
          },
          headerRightContainerStyle: {
            paddingHorizontal: 16,
          },
          headerStyle: {
            backgroundColor: "white",
            //elevation: 4,
            //shadowOffset: { width: 0, height: 2 },
            //shadowOpacity: 0.1,
            //shadowRadius: 4,
            //transform: [{ translateY: headerTranslateY }],
            borderBottomWidth: 1,
            borderBottomColor: "#E5E7EB",
            //height: headerHeight,
          },
          drawerStyle: {
            width: "80%",
          },

          headerLeft: () => (
            <View className="flex flex-row gap-4 items-center">
              <Pressable
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
              >
                <Menu height={24} width={24} color={"#6744FF"} />
              </Pressable>

              <Logo style={{ width: 80, height: 32, resizeMode: "contain" }} />
              {/*<Image
                source={require("../assets/UnibuzzFullLogo.png")}
                style={{ width: 80, height: 32, resizeMode: "contain" }}
              />*/}
            </View>
          ),
          headerRight: () => (
            <View className="flex flex-row gap-4 items-center">
              {/*{currScreen === "timeline" && (
                <Pressable
                  onPress={() => navigation.navigate("NewPost")}
                  style={{
                    backgroundColor: "#F3F2FF",
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 8,
                    marginRight: 16,
                  }}
                >
                  <Text style={{ color: "#6744FF" }}>Create</Text>
                </Pressable>
              )}*/}
              <Pressable onPress={() => setRightDrawerOpen(true)}>
                <Image
                  className="w-8 h-8 rounded-full object-cover"
                  source={
                    userProfileStore?.profile_dp?.imageUrl
                      ? { uri: userProfileStore?.profile_dp?.imageUrl }
                      : avatar
                  }
                />
              </Pressable>
            </View>
          ),
          headerTitle: () => <></>,
          //  <Image
          //      source={require("../assets/UnibuzzFullLogo.png")}
          //      style={{ width: 100, height: 40, resizeMode: "contain" }}
          //    />
        }}
        drawerContent={(props) => <LeftSideSideBar />}
      >
        <LeftDrawer.Screen name="tabsGroup" component={TabsGroup} />
      </LeftDrawer.Navigator>
    );
  };

  function RightDrawerScreen() {
    const [rightDrawerOpen, setRightDrawerOpen] = useState(false);

    return (
      <Drawer
        open={rightDrawerOpen}
        onOpen={() => setRightDrawerOpen(true)}
        onClose={() => setRightDrawerOpen(false)}
        drawerPosition="right"
        renderDrawerContent={() => (
          <UserProfileDrawerContent
            navigation={useNavigation()}
            setRightDrawerOpen={setRightDrawerOpen}
          />
        )}
      >
        <LeftDrawerScreen
          navigation={useNavigation()}
          setRightDrawerOpen={setRightDrawerOpen}
        />
      </Drawer>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <AuthGuard>
        {/* <StackGroup/> */}
        {/* <TabsGroup/> */}
        {/* <DrawerGroup/> */}
        <SocketProvider>
          <HeaderProvider>
            <CommunityProvider>
              <CommunityFilterProvider>
                <RightDrawerScreen />
              </CommunityFilterProvider>
            </CommunityProvider>
          </HeaderProvider>
        </SocketProvider>
      </AuthGuard>
      <UnauthenticatedGuard>
        <Stack.Navigator key={variant} screenOptions={{ headerShown: false }}>
          {isAppFirstLaunched && (
            <Stack.Screen
              name="OnboardingScreen"
              component={OnboardingScreen}
            />
          )}
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        </Stack.Navigator>
      </UnauthenticatedGuard>
    </NavigationContainer>
  );
}

export default ApplicationNavigator;
