import PrivacyPolicy from "@/screens/PrivacyPolicy";
import TermAndConditionScreen from "@/screens/TermAndConditionScreen";
import UserGuidelinesScreen from "@/screens/UserGuidelinesScreen";
import FeedBackScreen from "@/screens/FeedBackScreen";
import BugReportScreen from "@/screens/BugReportScreen";
import { createStackNavigator } from "@react-navigation/stack";

const InfoStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <Stack.Screen
        name="TermsAndConditions"
        component={TermAndConditionScreen}
      />
      <Stack.Screen name="UserGuidelines" component={UserGuidelinesScreen} />
      <Stack.Screen name="FeedBackScreen" component={FeedBackScreen} />
      <Stack.Screen name="BugReportScreen" component={BugReportScreen} />
    </Stack.Navigator>
  );
};

export default InfoStack;
