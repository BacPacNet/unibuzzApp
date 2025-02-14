import { createStackNavigator } from "@react-navigation/stack";
import {
  DrawerActions,
  NavigationContainer,
  useNavigation,
  useNavigationState,
  useRoute,
} from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { Example, LoginScreen, Timeline, RegisterScreen } from "@/screens";
import { useTheme } from "@/theme";

import type { RootStackParamList } from "@/types/navigation";
import OnboardingScreen from "@/screens/OnboardingScreen/OnboardingScreen";
import { useCallback, useEffect, useRef, useState } from "react";
import { storage } from "@/App";
import AuthGuard from "@/components/template/AuthGuard/AuthGuard";
import UnauthenticatedGuard from "@/components/template/UnauthenticatedGuard/UnauthenticatedGuard";
import { useAuth } from "@/context/AuthProvider/AuthContext";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Eye,
  EyeClosed,
  HomeSimpleDoor,
  Group,
  Mail,
  Bell,
  Spark,
  Menu,
  MailSolid,
  BellNotificationSolid,
} from "iconoir-react-native";
import Notifications from "@/screens/NotificationsScreen";
import Connections from "@/screens/ConnectionScreen";
import Messages from "@/screens/MessagesScreen";
import AI_Assistant from "@/screens/AIAssistantScreen";
import {
  Animated,
  Button,
  Image,
  LayoutAnimation,
  Pressable,
  Text,
  View,
} from "react-native";
import { getUserStore } from "@/storage/user";
// import { createDrawerNavigator } from "@react-navigation/drawer";
import { Drawer } from "react-native-drawer-layout";
import { createDrawerNavigator } from "@react-navigation/drawer";
import AllUniversities from "@/screens/AllUniversity";
import University from "@/screens/University";
import { SocketProvider } from "@/context/SocketProvider/SocketProvider";

import NewPost from "@/screens/NewPost";
import ReusableButton from "@/components/atoms/ReusableButton";
import { HeaderProvider, useHeader } from "@/context/HeaderProvider/Header";

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootStackParamList>();

function ApplicationNavigator() {
  const { variant, navigationTheme } = useTheme();
  const { isAuthenticated, setAuthenticated, deauthenticate } = useAuth();
  const [isAppFirstLaunched, setIsAppFirstLaunched] = useState(false);

  useEffect(() => {
    const appData = storage.contains("isAppFirstLaunched");
    if (!appData) {
      storage.set("isAppFirstLaunched", true);
      setIsAppFirstLaunched(true);
    } else {
      setIsAppFirstLaunched(false);
    }
    const user: any = getUserStore();

    if (user?._j?.id) {
      setAuthenticated();
    }

    // AsyncStorage.removeItem('isAppFirstLaunched');
  }, []);

  // Discover Stack
  function DiscoverStack() {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Discover" component={AllUniversities} />
        <Stack.Screen
          name="University"
          component={University}
          options={{
            gestureEnabled: true,
            gestureDirection: "horizontal",
          }}
        />
      </Stack.Navigator>
    );
  }

  function StackGroup() {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Timeline" component={Timeline} />
        {/* <Stack.Screen name="New_Post" component={NewPost} /> */}
        <Stack.Screen
          name="New_Post"
          component={NewPost}
          options={{
            gestureEnabled: true,
            gestureDirection: "horizontal",
          }}
        />
        <Stack.Screen name="Example" component={Example} />
      </Stack.Navigator>
    );
  }

  //tabs
  function TabsGroup() {
    return (
      <Tab.Navigator
        screenOptions={({ route, navigation }) => ({
          // headerTitleAlign: "center",

          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "Home") {
              return (iconName = focused ? (
                <HomeSimpleDoor
                  fill={"#6744FF"}
                  height={24}
                  width={24}
                  color={"white"}
                />
              ) : (
                <HomeSimpleDoor
                  color={"white"}
                  fill={"#6B7280"}
                  height={24}
                  width={24}
                />
              ));
            } else if (route.name === "Example") {
              return (iconName = focused ? (
                <Eye height={24} width={24} color={"#6744FF"} />
              ) : (
                <EyeClosed height={24} width={24} />
              ));
            } else if (route.name === "Connections") {
              return (iconName = focused ? (
                <Group
                  height={24}
                  width={24}
                  color={"white"}
                  fill={"#6744FF"}
                />
              ) : (
                <Group
                  height={24}
                  width={24}
                  color={"white"}
                  fill={"#6B7280"}
                />
              ));
            } else if (route.name === "Messages") {
              return (iconName = focused ? (
                <MailSolid height={24} width={24} color={"#6744FF"} />
              ) : (
                <MailSolid height={24} width={24} color={"#6B7280"} />
              ));
            } else if (route.name === "Notifications") {
              return (iconName = focused ? (
                <BellNotificationSolid
                  height={24}
                  width={24}
                  color={"#6744FF"}
                />
              ) : (
                <BellNotificationSolid
                  height={24}
                  width={24}
                  color={"#6B7280"}
                />
              ));
            } else if (route.name === "AI_Assistant") {
              return (iconName = focused ? (
                <Spark height={24} width={24} color={"#6744FF"} />
              ) : (
                <Spark height={24} width={24} />
              ));
            }
          },
          tabBarActiveTintColor: "#6744FF",
          tabBarInactiveTintColor: "black",
          tabBarStyle: {
            backgroundColor: "white",

            height: 60,
            paddingBottom: 10,
            paddingTop: 10,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontStyle: "normal",
            fontWeight: "500",
          },
          headerShown: false,
          tabBarHideOnKeyboard: true,
        })}
      >
        <Tab.Screen name="Home" component={StackGroup} />
        <Tab.Screen name="Connections" component={Connections} />
        <Tab.Screen name="Messages" component={Messages} />
        {/* <Tab.Screen name="Example" component={Example} /> */}
        <Tab.Screen name="Notifications" component={Notifications} />
        <Tab.Screen name="AI_Assistant" component={AI_Assistant} />
        <Tab.Screen
          name="DiscoverStack"
          component={DiscoverStack}
          options={{ tabBarButton: () => null }}
        />
      </Tab.Navigator>
    );
  }

  function AppMenuDrawerContent(props: any) {
    return (
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 20 }}>
          App Menu
        </Text>
        <Pressable
          onPress={() =>
            props.navigation.navigate("tabsGroup", { screen: "Home" })
          }
        >
          <Text style={{ fontSize: 16, marginBottom: 15 }}>Home</Text>
        </Pressable>
        <Pressable
          onPress={() =>
            props.navigation.navigate("tabsGroup", { screen: "DiscoverStack" })
          }
        >
          <Text style={{ fontSize: 16, marginBottom: 15 }}>Discover</Text>
        </Pressable>
        <Pressable onPress={() => props.navigation.navigate("Settings")}>
          <Text style={{ fontSize: 16, marginBottom: 15 }}>Settings</Text>
        </Pressable>
      </View>
    );
  }

  function UserProfileDrawerContent({ navigation, setRightDrawerOpen }: any) {
    const handleClick = (route: string) => {
      navigation.navigate(route);
      setRightDrawerOpen(false);
    };
    return (
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 20 }}>
          User Profile
        </Text>
        <Pressable onPress={() => handleClick("Timeline")}>
          <Text style={{ fontSize: 16, marginBottom: 15 }}>My Profile</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate("Account")}>
          <Text style={{ fontSize: 16, marginBottom: 15 }}>
            Account Settings
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            deauthenticate();
          }}
        >
          <Text style={{ fontSize: 16, marginBottom: 15, color: "red" }}>
            Logout
          </Text>
        </Pressable>
      </View>
    );
  }

  const LeftDrawer = createDrawerNavigator();

  const LeftDrawerScreen = ({ navigation, setRightDrawerOpen }: any) => {
    const { showHeader, currScreen } = useHeader();
    const [headerTranslateY] = useState(new Animated.Value(0));
    const [headerHeight, setHeaderHeight] = useState(60);

    const animateHeader = useCallback(() => {
      LayoutAnimation.configureNext(
        LayoutAnimation.create(
          200,
          LayoutAnimation.Types.linear,
          LayoutAnimation.Properties.opacity
        )
      );

      Animated.timing(headerTranslateY, {
        toValue: showHeader ? 0 : -20,
        duration: 200,
        useNativeDriver: true,
      }).start();

      setHeaderHeight(showHeader ? 60 : 0);
    }, [showHeader, headerTranslateY]);

    useEffect(() => {
      animateHeader();
    }, [showHeader, animateHeader]);
    return (
      <LeftDrawer.Navigator
        screenOptions={{
          drawerPosition: "left",
          headerShown: true,
          headerStyle: {
            backgroundColor: "#fff",
            elevation: 4,
            // shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            transform: [{ translateY: headerTranslateY }],
            height: headerHeight,
          },

          headerLeft: () => (
            <Pressable
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            >
              <Menu
                style={{ marginLeft: 16 }}
                height={24}
                width={24}
                color={"#6744FF"}
              />
            </Pressable>
          ),
          headerRight: () => (
            <View className="flex flex-row gap-4 items-center">
              {currScreen === "timeline" && (
                <Pressable
                  onPress={() => navigation.navigate("New_Post")}
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
              )}
              <Pressable onPress={() => setRightDrawerOpen(true)}>
                <Image
                  source={require("../assets/avatar.png")}
                  style={{
                    width: 40,
                    height: 40,
                    resizeMode: "contain",
                    marginRight: 16,
                  }}
                />
              </Pressable>
            </View>
          ),
          headerTitle: () => (
            <Image
              source={require("../assets/UnibuzzFullLogo.png")}
              style={{ width: 100, height: 40, resizeMode: "contain" }}
            />
          ),
        }}
        drawerContent={(props) => <AppMenuDrawerContent {...props} />}
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
            <RightDrawerScreen />
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
