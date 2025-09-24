import BulletPoint from "@/components/atoms/BulletPoint";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const UserGuidelinesScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>User Guidelines</Text>
      <Text style={styles.Desc}>Updated: September 20, 2025</Text>

      <View>
        <Text style={styles.sectionTitle}>
          Welcome to the Unibuzz Community
        </Text>
        <Text style={styles.Desc}>
          Unibuzz is a space built by students, for students. Our mission is to
          create an inclusive, empowering environment for students, alumni,
          applicants, and faculty members across universities. We facilitate
          collaboration on projects, seeking advice, and making lifelong
          connections, ensuring you feel safe, respected, and valued. By using
          Unibuzz, you agree to follow these rules.
        </Text>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Respectful Conduct</Text>
        <BulletPoint>
          Treat everyone with kindness. Zero tolerance for harassment, hate
          speech, bullying, or discrimination.
        </BulletPoint>
        <BulletPoint>
          Avoid personal attacks. Disagreements are acceptable, but
          conversations should focus on ideas, not individuals.
        </BulletPoint>
        <BulletPoint>
          Be inclusive. Respect identities, backgrounds, and lived experiences
          of fellow users.
        </BulletPoint>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Authentic Identity</Text>
        <BulletPoint>
          Use your real name and university affiliation to foster trust within
          the community.
        </BulletPoint>
        <BulletPoint>
          Do not impersonate others or misrepresent your background.
        </BulletPoint>
        <BulletPoint>
          Your profile should reflect who you are, both socially and
          academically.
        </BulletPoint>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Privacy and Security</Text>
        <BulletPoint>
          Do not share personal information (e.g., phone numbers, addresses,
          private messages) without consent.
        </BulletPoint>
        <BulletPoint>
          Never engage in doxxing or attempts to expose others' private data.
        </BulletPoint>
        <BulletPoint>
          If you feel unsafe or notice misconduct, report it using the
          platform's built-in tools or contact support.
        </BulletPoint>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>
          Academic and Intellectual Integrity
        </Text>
        <BulletPoint>
          Don’t plagiarize. Always credit the original source when sharing
          materials, notes, or research.
        </BulletPoint>
        <BulletPoint>
          Avoid spreading misinformation. Fact-check before posting, especially
          in academic groups.
        </BulletPoint>
        <BulletPoint>
          Use the platform to learn and grow, not to cheat or bypass educational
          standards.
        </BulletPoint>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Content Standards</Text>
        <BulletPoint>
          Keep content relevant to university life — courses, housing, events,
          clubs, academic resources, etc.
        </BulletPoint>
        <BulletPoint>
          Do not share or promote illegal content, violence, explicit material,
          or age-restricted media.
        </BulletPoint>
        <BulletPoint>
          Refrain from spamming, mass invites, or using bots to artificially
          boost engagement.
        </BulletPoint>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Engagement and Collaboration</Text>
        <BulletPoint>
          Participate actively and meaningfully. Join study sessions, respond to
          posts, and offer support.
        </BulletPoint>
        <BulletPoint>
          Respect group-specific rules in university or course-based
          communities.
        </BulletPoint>
        <BulletPoint>
          Don’t derail conversations or use unrelated threads for
          self-promotion.
        </BulletPoint>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Promotions and Advertisements</Text>
        <BulletPoint>
          Promotional content, including group invites and event links, must be
          approved by Unibuzz moderators.
        </BulletPoint>
        <BulletPoint>
          DM-based unsolicited promotions are strictly prohibited.
        </BulletPoint>
        <BulletPoint>
          Student-run initiatives, startups, or clubs are welcome but must
          follow community promotion policies.
        </BulletPoint>
      </View>

      <View style={[styles.contentContainer, styles.lastPadding]}>
        <Text style={styles.sectionTitle}>Enforcement</Text>
        <BulletPoint>
          Breaking these rules may result in warnings, content removal,
          temporary suspension, or permanent bans.
        </BulletPoint>
        <BulletPoint>
          Our moderators are here to help — but abusive behavior toward them
          will not be tolerated.
        </BulletPoint>
        <BulletPoint>
          False reports or misuse of the reporting system may also result in
          action.
        </BulletPoint>
      </View>
    </ScrollView>
  );
};

export default UserGuidelinesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
  },
  title: {
    fontSize: 28,
    color: "#3A3B3C",
    lineHeight: 32,
    fontWeight: 700,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    color: "#3A3B3C",
    lineHeight: 24,
    marginBottom: 16,
    fontWeight: 600,
  },
  contentContainer: {
    display: "flex",
    flexDirection: "column",
    marginTop: 32,
  },
  Desc: {
    fontSize: 14,
    color: "#3A3B3C",
    lineHeight: 24,
    marginBottom: 16,
    fontWeight: 400,
  },

  lastPadding: {
    paddingBottom: 64,
  },
});
