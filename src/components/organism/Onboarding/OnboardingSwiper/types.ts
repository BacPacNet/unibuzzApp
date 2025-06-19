import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";

export interface SlideItem {
  id: string;
  SVG: React.FC<React.SVGProps<SVGSVGElement>>;
  title: string;
  subtitle: string;
  height: number;
}

export type OnboardingScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "OnboardingScreen"
>;
