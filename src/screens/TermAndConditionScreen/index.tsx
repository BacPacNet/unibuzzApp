import BulletPoint from "@/components/atoms/BulletPoint";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const TermAndConditionScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Terms and Conditions</Text>

      <View>
        <Text style={styles.sectionTitle}>Welcome to Unibuzz</Text>
        <Text style={styles.Desc}>
          Unibuzz is a platform designed for students, university applicants,
          alumni, and faculty to connect, collaborate, and share. These Terms of
          Service ("Terms") form a legal agreement between you ("you" or "User")
          and Unibuzz Networks Pty Ltd ("Unibuzz Networks", "we", "us", or
          "our").
        </Text>
        <Text style={styles.Desc}>
          By using Unibuzz, you agree to these Terms, our Privacy Policy, and
          any community guidelines or policies we publish.
        </Text>
        <Text style={styles.Desc}>
          If you do not agree, please do not use the Service.
        </Text>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Who Can Use Unibuzz</Text>
        <BulletPoint>
          You must be at least 13 years old (or the minimum legal age in your
          jurisdiction).
        </BulletPoint>
        <BulletPoint>
          To access university communities, you must verify a valid
          university-affiliated email (e.g., .edu, .ac.in, etc.).
        </BulletPoint>
        <BulletPoint>
          If you do not have a university-affiliated email and/or are unable to
          verify your university, please let us know using the Contact Us form.
        </BulletPoint>
        <BulletPoint>
          If you are using Unibuzz on behalf of a university or organization,
          you represent that you have authority to bind them to these Terms.
        </BulletPoint>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Changes to These Terms</Text>
        <Text style={styles.Desc}>
          We may update these Terms from time to time. If we make material
          changes, we will notify you via the platform or email before they take
          effect.
        </Text>
        <Text style={styles.Desc}>
          Your continued use of Unibuzz after changes means you agree to the new
          Terms.
        </Text>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Your Account</Text>
        <Text style={styles.Desc}>
          You are responsible for your account and the information associated
          with it.
        </Text>
        <BulletPoint>Keep your password secure.</BulletPoint>
        <BulletPoint>Don’t share your login credentials.</BulletPoint>
        <BulletPoint>Notify us of any unauthorized use.</BulletPoint>
        <BulletPoint>
          You may close your account anytime from your settings.
        </BulletPoint>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>
          Content and Intellectual Property
        </Text>
        <Text style={styles.Desc}>
          1. <Text style={{ fontWeight: "bold" }}>Your Content</Text>
          {"\n"}
          You own the content you post (photos, messages, links, etc). By
          posting on Unibuzz, you grant us a worldwide, royalty-free license to
          use, display, reproduce, and distribute it as necessary to operate and
          improve the Service.
        </Text>
        <Text style={styles.Desc}>
          2. <Text style={{ fontWeight: "bold" }}>Our Content</Text>
          {"\n"}
          All software, code, and branding associated with Unibuzz is owned by
          Unibuzz Networks or its licensors and is protected by copyright and
          trademark laws.
        </Text>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Acceptable Use Policy</Text>
        <Text style={styles.Desc}>You agree not to use Unibuzz to:</Text>
        <BulletPoint>Post illegal, harmful, or abusive content.</BulletPoint>
        <BulletPoint>Harass, impersonate, or threaten others.</BulletPoint>
        <BulletPoint>
          Share false, misleading, or confidential information.
        </BulletPoint>
        <BulletPoint>
          Access data or systems you're not authorized to access.
        </BulletPoint>
        <BulletPoint>Upload viruses or spam.</BulletPoint>
        <BulletPoint>
          Use bots or automated tools to scrape or manipulate content.
        </BulletPoint>
        <BulletPoint>
          Bypass access restrictions, such as email verification.
        </BulletPoint>
        <Text style={styles.Desc}>
          We may remove content or suspend users for violating these rules.
        </Text>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Enforcement and Termination</Text>
        <Text style={styles.Desc}>
          We may suspend or terminate your account, without notice, if:
        </Text>
        <BulletPoint>You violate these Terms or our policies.</BulletPoint>
        <BulletPoint>
          Your actions threaten the integrity, safety, or reputation of the
          platform.
        </BulletPoint>
        <Text style={styles.Desc}>
          You may also delete your account at any time. Termination does not
          affect rights and obligations that arose before.
        </Text>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Feedback and Suggestions</Text>
        <Text style={styles.Desc}>
          If you have an idea you’d like us to consider, please share it through
          the Contact Us form or on our official Discord server. While we can’t
          implement every suggestion, we carefully review all feedback.
        </Text>
        <Text style={styles.Desc}>
          You can send us feedback, ideas, or feature requests. By submitting
          feedback, you grant us the right to use it freely and without
          obligation.
        </Text>
        <Text style={styles.Desc}>
          Unibuzz is a user-friendly platform built with students in mind. We
          take feedback and suggestions seriously and aim to continuously
          improve the experience by adding helpful and innovative features.
        </Text>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Third-Party Services</Text>
        <Text style={styles.Desc}>
          Unibuzz may include links to third-party websites or tools. We do not
          control them and are not responsible for their content, practices, or
          availability. Your use of third-party services is governed by their
          terms, not ours.
        </Text>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Copyright Complaints (DMCA)</Text>
        <Text style={styles.Desc}>
          If you believe your copyrighted work was posted on Unibuzz without
          permission:
        </Text>
        <Text style={styles.Desc}>
          Please email us at legal@unibuzz.com with:
        </Text>
        <BulletPoint>A description of the work</BulletPoint>
        <BulletPoint>The URL of the infringing content</BulletPoint>
        <BulletPoint>Your contact information</BulletPoint>
        <BulletPoint>
          A statement that you believe in good faith that the use is
          unauthorized
        </BulletPoint>
        <BulletPoint>Your signature (physical or digital)</BulletPoint>
        <Text style={styles.Desc}>
          We will review and, if necessary, remove the content in accordance
          with applicable laws.
        </Text>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Data and Privacy</Text>
        <Text style={styles.Desc}>
          We take your privacy seriously. Please review our Privacy Policy to
          understand what data we collect, how we use it, and your choices. By
          using Unibuzz, you consent to our data practices.
        </Text>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Security</Text>
        <Text style={styles.Desc}>
          We take data security seriously and implement reasonable
          administrative, technical, and physical safeguards to protect your
          information. We regularly update our systems and monitor for threats
          to maintain a safe environment for our users.
        </Text>
        <Text style={styles.Desc}>
          However, no method of data transmission or storage is 100% secure. By
          using the platform, you acknowledge that you provide your personal
          information at your own risk and we cannot guarantee absolute
          protection against unauthorized access or breaches.
        </Text>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Disclaimers</Text>
        <BulletPoint>
          We provide Unibuzz "as is" and "as available."
        </BulletPoint>
        <BulletPoint>
          We do not make warranties about uptime, accuracy, or performance.
        </BulletPoint>
        <BulletPoint>
          We are not liable for losses due to outages, unauthorized access, or
          data loss.
        </BulletPoint>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Limitation of Liability</Text>
        <Text style={styles.Desc}>
          To the fullest extent permitted by law, Unibuzz is not liable for:
        </Text>
        <BulletPoint>
          Indirect, incidental, or consequential damages.
        </BulletPoint>
        <BulletPoint>Lost profits or loss of data.</BulletPoint>
        <BulletPoint>Unauthorized access or use of your account.</BulletPoint>
        <Text style={styles.Desc}>
          Our total liability under these Terms is limited to the amount you
          paid us (if any) in the last 12 months.
        </Text>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>
          Governing Laws and Dispute Resolution
        </Text>
        <Text style={styles.Desc}>
          To the extent permitted by law, you waive your right to participate in
          class actions or jury trials in such disputes.
        </Text>
        <Text style={styles.Desc}>
          <Text style={{ fontWeight: "bold" }}>Dispute Resolution:</Text> We
          encourage users to first reach out to us via the Contact Us form for
          any disputes or concerns. We will do our best to address and resolve
          your issue informally. If a resolution cannot be reached, then the
          dispute shall be resolved under the jurisdiction of competent courts
          located in India, in accordance with applicable laws.
        </Text>
        <Text style={styles.Desc}>
          These Terms are governed by the laws of India. If you reside outside
          India, you are responsible for complying with your local laws when
          accessing or using the Service.
        </Text>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Export Control</Text>
        <Text style={styles.Desc}>
          You may not use or export Unibuzz in violation of applicable export
          control laws. You agree to comply with all local laws regarding online
          conduct and content.
        </Text>
      </View>

      <View style={[styles.contentContainer, styles.lastPadding]}>
        <Text style={styles.sectionTitle}>Entire Agreement</Text>
        <Text style={styles.Desc}>
          These Terms, our Privacy Policy, and any supplemental agreements you
          enter into with us (e.g., for university partnerships) constitute the
          entire agreement between you and Unibuzz.
        </Text>
        <Text style={styles.Desc}>
          If any part is found unenforceable, the rest still applies.
        </Text>
      </View>
    </ScrollView>
  );
};

export default TermAndConditionScreen;

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
