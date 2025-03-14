import NewCommunityGroupFilterScreen from "@/screens/NewCommunityGroupFIltersScreen";
import NewCommunityGroupScreen from "@/screens/NewCommunityGroupScreen";
import SearchCommunityGroupFilterScreen from "@/screens/SearchCommunityGroupFilterScreen";
import SearchCommunityGroupScreen from "@/screens/SearchCommunityGroupsScreen";
import { createStackNavigator } from "@react-navigation/stack";

const ManageGroups = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="SearchCommunityGroupScreen"
        component={SearchCommunityGroupScreen}
      />
      <Stack.Screen
        name="SearchCommunityGroupFilterScreen"
        component={SearchCommunityGroupFilterScreen}
      />
      <Stack.Screen
        name="NewCommunityGroupScreen"
        component={NewCommunityGroupScreen}
      />
      <Stack.Screen
        name="NewCommunityGroupFilterScreen"
        component={NewCommunityGroupFilterScreen}
      />
    </Stack.Navigator>
  );
};

export default ManageGroups;
