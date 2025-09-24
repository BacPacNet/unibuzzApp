import BulletPoint from "@/components/atoms/BulletPoint";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const PrivacyPolicy = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Privacy Policy</Text>
      <View>
        <Text style={styles.Desc}>Updated: September 20, 2025</Text>
        <Text style={styles.Desc}>
          Welcome to Unibuzz. At Unibuzz Networks, we are committed to
          protecting your privacy and handling your data in an open,
          responsible, and transparent manner.
        </Text>

        <Text style={styles.Desc}>
          This Privacy Policy outlines how Unibuzz collects, uses, processes,
          and shares personal information when you interact with our websites,
          mobile application, and related services (collectively, the
          &quot;Service&quot;).
        </Text>
        <Text style={styles.Desc}>
          By using Unibuzz, you consent to the collection and use of information
          in accordance with this policy.
        </Text>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Information We Collect</Text>
        <Text style={styles.DescHeading}>Directly Provided Information</Text>
        <Text style={styles.Desc}>
          We collect information you provide directly to us when you create an
          account, use our Service, or communicate with us. This may include:
        </Text>
        <BulletPoint>
          Your name, email address (including university-affiliated email),
          phone number, and other information you provide.
        </BulletPoint>
        <BulletPoint>
          Content you submit, such as profile data, messages, photos, posts, or
          responses.
        </BulletPoint>
        <BulletPoint>
          Academic or university affiliation details, if you choose to verify
          your identity to access university communities.
        </BulletPoint>

        <Text style={styles.DescHeading}>
          Automatically Collected Usage Information
        </Text>
        <Text style={styles.Desc}>
          We also automatically collect certain usage information, including:
        </Text>
        <BulletPoint>
          Log information such as IP address, browser type, pages visited, and
          access times.
        </BulletPoint>
        <BulletPoint>
          Device details such as operating system, device type, and unique
          identifiers.
        </BulletPoint>
        <BulletPoint>
          Metadata associated with your content (e.g., timestamp, geolocation if
          enabled).
        </BulletPoint>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>How We Use Your Information</Text>
        <Text style={styles.Desc}>We use the information we collect to:</Text>
        <BulletPoint>
          Provide, personalize, and maintain the Service.
        </BulletPoint>
        <BulletPoint>Set up and manage your account.</BulletPoint>
        <BulletPoint>
          Verify your university affiliation where applicable.
        </BulletPoint>
        <BulletPoint>
          Respond to inquiries and provide customer support.
        </BulletPoint>
        <BulletPoint>
          Send transactional and promotional communications (you can opt-out).
        </BulletPoint>
        <BulletPoint>
          Monitor activity and ensure safety and policy compliance.
        </BulletPoint>
        <BulletPoint>
          Improve our features based on usage trends and feedback.
        </BulletPoint>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Sharing of Information</Text>
        <Text style={styles.Desc}>
          We may share personal information as follows:
        </Text>
        <BulletPoint>
          With vendors, consultants, and other service providers who need access
          to such information to carry out work on our behalf.
        </BulletPoint>
        <BulletPoint>
          In response to a request for information if we believe disclosure is
          in accordance with any applicable law, regulation, or legal process.
        </BulletPoint>
        <BulletPoint>
          If we believe your actions are inconsistent with our user agreements
          or policies, or to protect the rights, property, and safety of UniBuzz
          Networks or others.
        </BulletPoint>
        <BulletPoint>
          In connection with, or during negotiations of, any merger, sale of
          company assets, financing, or acquisition of all or a portion of our
          business by another company.
        </BulletPoint>
        <BulletPoint>
          Between and among UniBuzz Networks and our current and future parents,
          affiliates, subsidiaries, and other companies under common control and
          ownership.
        </BulletPoint>
        <BulletPoint>With your consent or at your direction.</BulletPoint>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>International Data Transfers</Text>
        <Text style={styles.Desc}>
          We are based in India, and your data will be processed in accordance
          with Indian laws. If you access Unibuzz from outside India, your data
          may be transferred and processed in jurisdictions that may not offer
          the same level of data protection as your home country.
        </Text>
        <Text style={styles.Desc}>
          {" "}
          By using our services, you consent to these transfers.{" "}
        </Text>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Your Rights</Text>
        <Text style={styles.Desc}>You have the right to:</Text>
        <BulletPoint>Access the personal data we hold about you.</BulletPoint>
        <BulletPoint>Request correction or deletion of your data.</BulletPoint>
        <BulletPoint>
          Restrict or object to certain processing activities.
        </BulletPoint>
        <BulletPoint>
          Withdraw consent at any time (where applicable).
        </BulletPoint>
        <Text style={styles.Desc}>
          You can make these requests by contacting us through the Contact Us
          form. If you believe your rights are not respected, you may also lodge
          a complaint with a data protection authority in your country.
        </Text>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Data Retention</Text>
        <Text style={styles.Desc}>
          We retain your information as long as your account is active or as
          needed to provide the Service. We may also retain data to comply with
          legal obligations, resolve disputes, and enforce agreements.
        </Text>
        <Text style={styles.Desc}>
          You can request account deletion via the settings or contact form.
        </Text>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Security</Text>
        <Text style={styles.Desc}>
          We take the security of your personal data seriously and use
          industry-standard measures to protect it. These include encryption,
          firewalls, and secure access controls.
        </Text>
        <Text style={styles.Desc}>
          However, no system is completely secure. We cannot guarantee the
          absolute security of your information, and you use the Service at your
          own risk.
        </Text>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Changes to This Policy</Text>
        <Text style={styles.Desc}>
          We may update this Privacy Policy from time to time. If we make
          material changes, we will notify you through the Service, by email, or
          through other reasonable means.
        </Text>
        <Text style={styles.Desc}>
          The date at the top of this document reflects the latest revision.
        </Text>
      </View>

      <View style={[styles.contentContainer, styles.lastPadding]}>
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <Text style={styles.Desc}>
          If you have any questions or concerns about this Privacy Policy or
          your data, please contact us through the Contact Us form on our
          website or email us at privacy@unibuzz.com.
        </Text>
      </View>
    </ScrollView>
  );
};

export default PrivacyPolicy;

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
  DescHeading: {
    fontSize: 16,
    color: "#3A3B3C",
    lineHeight: 24,
    marginVertical: 16,
    fontWeight: 500,
  },

  lastPadding: {
    paddingBottom: 64,
  },
});
