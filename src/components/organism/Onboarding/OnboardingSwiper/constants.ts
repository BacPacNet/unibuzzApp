import OnboardingImage1 from "@/assets/onboarding/Onboarding_image_1.svg";
import OnboardingImage2 from "@/assets/onboarding/Onboarding_image_2.svg";
import OnboardingImage3 from "@/assets/onboarding/Onboarding_image_3.svg";
import OnboardingImage4 from "@/assets/onboarding/Onboarding_image_4.svg";
import { SlideItem } from "./types";

export const SLIDES: SlideItem[] = [
  {
    id: "1",
    SVG: OnboardingImage1 as React.FC<React.SVGProps<SVGSVGElement>>,
    height: 186,
    title: "Welcome to Unibuzz!",
    subtitle:
      "Welcome to Unibuzz, the global university network that caters to your university needs.",
  },
  {
    id: "2",
    SVG: OnboardingImage2 as React.FC<React.SVGProps<SVGSVGElement>>,
    height: 144,
    title: "First, search your university",
    subtitle:
      "Find your university from our database and get ready to join the vibrant community within it!",
  },
  {
    id: "3",
    SVG: OnboardingImage3 as React.FC<React.SVGProps<SVGSVGElement>>,
    height: 126,
    title: "Join the university community",
    subtitle:
      "Join the university community to connect with students and faculty to share insights and build connections!",
  },
  {
    id: "4",
    SVG: OnboardingImage4 as React.FC<React.SVGProps<SVGSVGElement>>,
    height: 250,
    title: "Lastly, enjoy the features",
    subtitle:
      "Enhance your university life with social networking, messaging, and a variety of other features!",
  },
];
