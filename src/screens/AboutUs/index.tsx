import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
} from "react-native";
import SecImage from "@/assets/AboutUs/OnboardingSVG.svg";
import ThirdImage from "@/assets/AboutUs/ThirdOnboardingSVG.svg";
import FourthImage from "@/assets/AboutUs/fourthSvg.svg";
import LandingImage from "@/assets/AboutUs/LandingSVG.svg";
import LandingImagePNG from "@/assets/AboutUs/LandingSVGPNG.png";
import { Discord, MessageText } from "iconoir-react-native";
import ReusableButton from "@/components/atoms/ReusableButton";

const team = [
  {
    name: "Aryan Bansal",
    role: "CEO",
    image:
      "https://unibuzz-uploads.s3.ap-south-1.amazonaws.com/assets/aryan.png",
  },

  {
    name: "Isha Gupta",
    role: "CMO",
    image:
      "https://unibuzz-uploads.s3.ap-south-1.amazonaws.com/assets/isha.png",
  },
  {
    name: "Pratik Yadav",
    role: "CTO, Lead Developer",
    image:
      "https://unibuzz-uploads.s3.ap-south-1.amazonaws.com/assets/pratik.png",
  },
  {
    name: "Aamil",
    role: "Full-Stack Engineer",
    image:
      "https://unibuzz-uploads.s3.ap-south-1.amazonaws.com/assets/aamil.png",
  },
  {
    name: "Robin Park",
    role: "CPO, Lead Designer",
    image:
      "https://unibuzz-uploads.s3.ap-south-1.amazonaws.com/assets/robin.png",
  },
];

const AboutUs = () => {
  return (
    <ScrollView
      contentContainerStyle={[{ rowGap: 128 }]}
      contentContainerClassName="items-center"
      style={styles.container}
    >
      <View style={styles.sectionContainer}>
        <View style={styles.landingImageContainer}>
          {/* <LandingImage width={"100%"} height={356} /> */}
          <Image
            source={LandingImagePNG}
            style={styles.titleImage}
            resizeMode="cover"
          />
        </View>
        <Text style={styles.title}>Welcome to Unibuzz!</Text>
        <Text style={styles.description}>
          At UniBuzz, we believe that university life is more than just lectures
          and exams—it’s about connections, collaborations, and opportunities
          that shape your experience.
        </Text>
      </View>
      <View style={styles.sectionContainer}>
        <View style={styles.imageContainer}>
          <SecImage width={"100%"} height={200} />
        </View>
        <View style={styles.subTitleContainer}>
          <Text style={styles.subTitle}>Discover & Explore Universities</Text>
          <Text style={styles.description}>
            Search for any university and find all essential details in one
            place—fees, funding, deadlines, scholarships, and more. Stay
            informed and make well-informed decisions about your academic
            journey.
          </Text>
        </View>
      </View>

      {/* sec  */}
      <View style={styles.sectionContainer}>
        <View style={styles.imageContainer}>
          <ThirdImage width={"100%"} height={200} />
        </View>
        <View style={styles.subTitleContainer}>
          <Text style={styles.subTitle}>Join your Community</Text>
          <Text style={styles.description}>
            Gain access to the university community to communicate with current,
            past, and future students! Join university clubs, collaborate on
            projects, discuss assignments, and engage beyond the classroom.
          </Text>
        </View>
      </View>
      {/* third  */}
      <View style={styles.sectionContainer}>
        <View style={styles.imageContainer}>
          <FourthImage width={"100%"} height={200} />
        </View>
        <View style={styles.subTitleContainer}>
          <Text style={styles.subTitle}>Level Up Your Campus Life</Text>
          <Text style={styles.description}>
            With a wide range of social networking features, messaging, and an
            AI powered assistant, we will make your university life a blast.
            Download our mobile app for syncing!
          </Text>
        </View>
      </View>

      <View style={styles.VMContainer}>
        {/* vision sec  */}
        <View style={styles.visionContainer}>
          <Text style={styles.title}>Vision</Text>
          <Text style={styles.visionDescription}>
            To create a global student community where learning, collaboration,
            and meaningful connections thrive beyond classrooms. We envision a
            space where students can share knowledge, support each other, and
            make the most of their university life through engaging discussions,
            academic resources, and student-led initiatives.
          </Text>
        </View>
        {/* mission sec  */}
        <View style={styles.visionContainer}>
          <Text style={styles.title}>Mission</Text>
          <Text style={styles.visionDescription}>
            Our mission is to empower students by providing a dynamic space
            where they can learn, grow, and build lasting relationships. Whether
            you're looking for academic support, extracurricular engagement, or
            just a place to share your university experience, UniBuzz is here to
            make it happen.
          </Text>
        </View>
      </View>

      {/* meet the team sec  */}
      <View>
        <Text style={styles.teamTitle}>Meet our team</Text>

        <View style={styles.teamContainer}>
          {team.map((item, index) => (
            <View key={index} style={styles.teamItem}>
              <Image source={{ uri: item.image }} style={styles.teamImage} />
              <Text style={styles.teamName}>{item.name}</Text>
              <Text style={styles.teamRole}>{item.role}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* contact sec  */}
      <View style={[styles.contactSection, styles.bottomPadding]}>
        <View style={styles.contactContainer}>
          <View style={styles.contactIconContainer}>
            <Discord height={24} width={24} color="#ffff" />
          </View>
          <Text style={styles.contactIconText}>Join our Discord Community</Text>
          <Text style={styles.description}>
            Keep up with the latest updates, send us your thoughts or personal
            feedback, and take part in the development process.
          </Text>

          <ReusableButton
            buttonText="Join Discord"
            onPress={() => {}}
            variant="primary"
            isRounded={false}
            height="large"
            size={127}
          />
        </View>
        <View style={[styles.contactContainer]}>
          <View style={styles.contactIconContainer}>
            <MessageText height={24} width={24} color="#ffff" />
          </View>
          <Text style={styles.contactIconText}>Contact customer support</Text>
          <Text style={styles.description}>
            Do you have any issues while using Unibuzz? Contact us through
            customer support and we will get back to you asap.
          </Text>

          <ReusableButton
            buttonText="Contact Support"
            onPress={() => {}}
            variant="primary"
            isRounded={false}
            height="large"
            size={160}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default AboutUs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",

    flexGrow: 1,
  },
  landingImageContainer: {
    width: "100%",
    height: 356,
  },
  titleImage: {
    width: "100%",
    height: 356,
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 16,
    color: "#3A3B3C",
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 600,

    color: "#3A3B3C",
  },
  description: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
  sectionContainer: {
    flex: 1,
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    padding: 16,
  },
  subTitleContainer: {
    flex: 1,
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  imageContainer: {
    width: "100%",
    height: 200,
    marginBottom: 16,
  },
  VMContainer: {
    width: "100%",
    display: "flex",
  },
  visionContainer: {
    flex: 1,
    width: "100%",
    display: "flex",
    gap: 12,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  visionDescription: {
    fontSize: 16,
    color: "#6B7280",
  },
  contactContainer: {
    flex: 1,
    width: Dimensions.get("window").width - 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    backgroundColor: "#F3F2FF",
    paddingHorizontal: 48,
    paddingVertical: 64,
    borderRadius: 16,
  },
  contactSection: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 32,
  },
  contactIconContainer: {
    backgroundColor: "#7289DA",
    padding: 12,
    borderRadius: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  contactIconText: {
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 16,
    color: "#3A3B3C",
    textAlign: "center",
  },
  bottomPadding: {
    paddingBottom: 64,
  },
  teamContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  teamTitle: {
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 16,
    color: "#3A3B3C",
    textAlign: "center",
  },
  teamItem: {
    width: 112,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  teamImage: {
    width: 112,
    height: 112,
    borderRadius: 100,
  },
  teamName: {
    fontSize: 14,
    fontWeight: 500,
    color: "#3A3B3C",
  },
  teamRole: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
});
