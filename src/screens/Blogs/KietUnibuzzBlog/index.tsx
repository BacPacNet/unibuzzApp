import React from "react";
import { View, Text, StyleSheet } from "react-native";
import BlogPostLayout from "@/components/molecules/Blogs/BlogPostLayout";
import {
  BlogBulletItem,
  BlogBulletList,
  BlogCta,
  BlogParagraph,
  BlogSection,
} from "@/components/molecules/Blogs/BlogContent";
import { FONTS } from "@/constants/fonts";

const TITLE =
  "KIET Ghaziabad × Unibuzz: Building a More Connected Digital Campus for Student Life";

const Bold = ({ children }: { children: React.ReactNode }) => (
  <Text style={styles.bold}>{children}</Text>
);

const KietUnibuzzBlog = () => {
  return (
    <BlogPostLayout title={TITLE} date="July 29, 2026">
      <View style={styles.content}>
        <BlogSection
          title="KIET Ghaziabad: A Quick Introduction"
          image="https://unibuzz-uploads.s3.ap-south-1.amazonaws.com/uploads/timeline/68e8e63d799d9b0a2790f8da/3-a-6f611e73-f9e9-4003-b355-45d602d28057.png"
          imageAlt="KIET Ghaziabad introduction"
        >
          <BlogParagraph>
            KIET Deemed to be University is located on Ghaziabad-Meerut Road,
            Ghaziabad, in the Delhi-NCR region. It was established in 1998 and
            has grown into a professional education institution covering
            Engineering, Computer Applications, Management, Pharmacy, and allied
            disciplines.
          </BlogParagraph>
          <BlogParagraph>
            According to KIET's official overview, the university currently has
            10,000+ students, a 26,000+ global alumni network, 240+ startups
            incubated through TBI-KIET, and 2,100+ recruiters that have visited
            the campus since inception. KIET also states that its highest
            international placement secured by a KIETian has reached ₹1.78 crore.
          </BlogParagraph>
        </BlogSection>

        <BlogSection title="Campus, Infrastructure and Everyday Student Life">
          <BlogParagraph>
            For applicants, KIET's campus appeal is not only about buildings. It
            is about whether the campus can support daily learning, sports,
            clubs, events, hostel life and peer interaction.
          </BlogParagraph>
          <BlogParagraph>
            KIET describes its campus as <Bold>21.56-acre </Bold>
            campus with academic and residential blocks, modern laboratories,
            digitally enabled classrooms, an auditorium, seminar halls and
            hostels. Its infrastructure page also highlights a central library
            connected with eight departmental libraries, about{" "}
            <Bold>1.90 lakh</Bold> books, more than <Bold>11,822</Bold> titles,
            over <Bold>121</Bold> periodicals, e-resources, KOHA automation and
            RFID, plus a separate Book-Bank facility with more than{" "}
            <Bold>1.25 lakh</Bold> books.
          </BlogParagraph>
          <BlogParagraph>
            For sports and recreation, KIET lists outdoor grounds for{" "}
            <Bold>cricket, football, volleyball and basketball</Bold>, courts for{" "}
            <Bold>badminton and lawn tennis</Bold>, indoor sports facilities and
            equipped gymnasiums. Hostel facilities are described as fully
            furnished, Wi-Fi enabled, with reading rooms, recreation lounges,
            indoor sports zones, mess committees, 24×7 security and CCTV
            surveillance.
          </BlogParagraph>
        </BlogSection>

        <BlogSection
          image="https://unibuzz-uploads.s3.ap-south-1.amazonaws.com/uploads/timeline/68e8e63d799d9b0a2790f8da/3-b-5b792730-864d-4a52-9322-7203dd2e190a.png"
          imageAlt="KIET campus infrastructure"
          title="Academics: Engineering, Management, Computer Applications and Pharmacy"
        >
          <BlogParagraph>
            KIET is positioned as an academics-first institution, but not in a
            narrow classroom-only sense. Its schools cover Computer Science and
            Artificial Intelligence, Engineering and Technology, Management,
            Computer Applications, Pharmacy, and Applied Science and Humanities.
          </BlogParagraph>
          <BlogParagraph>
            On the undergraduate side, KIET lists B.Tech programmes across
            Computer Science & Engineering, Computer Science, CSE with AI/AI&ML,
            IT, CSIT, CSE Data Science, CSE Cyber Security, ECE, EEE, Electrical
            & Computer Engineering, ECE VLSI Design & Technology, Mechanical
            Engineering and Advanced Mechatronics & Industrial Automation, along
            with B.Pharm.
          </BlogParagraph>
          <BlogParagraph>
            On the postgraduate side, it lists MBA, MCA, M.Tech in CSE / AI & ML,
            M.Pharm specialisations and M.Sc Applied Mathematics & Computing.
          </BlogParagraph>
        </BlogSection>

        <BlogSection
          title="Placements, Industry Readiness and Innovation"
          image="https://unibuzz-uploads.s3.ap-south-1.amazonaws.com/uploads/timeline/68e8e63d799d9b0a2790f8da/3-c-6fb44298-0ccd-4743-81e6-885661caade9.png"
          imageAlt="KIET placements"
        >
          <BlogParagraph>
            For students and parents, placements remain one of the biggest
            questions. KIET's own overview states that 2,100+ recruiters have
            visited the campus since inception and that the highest international
            placement secured by a KIETian has reached ₹1.78 crore. Its Corporate
            Relations & Placement Centre describes its role around internships,
            campus recruitment, industry partnerships, student-department
            coordination, soft skills, aptitude, domain competencies,
            entrepreneurship, mentoring and career guidance.
          </BlogParagraph>
          <BlogParagraph>
            The important point is this: KIET's placement story is not presented
            only as final-year recruitment. It is connected to industry
            readiness, student training, academic coordination, entrepreneurship
            and innovation. That is also consistent with KIET's claim that
            TBI-KIET has incubated <Bold>240+ startups</Bold>.
          </BlogParagraph>
        </BlogSection>

        <BlogSection
          title="Technical Clubs, Hackathons and Coding Culture"
          image="https://unibuzz-uploads.s3.ap-south-1.amazonaws.com/uploads/timeline/68e8e63d799d9b0a2790f8da/3-d-56b1379c-8ea0-452b-8a97-ff3ee9e0e581.png"
          imageAlt="KIET technical clubs"
        >
          <BlogParagraph>
            One of KIET's strongest applicant-facing stories is the number and
            variety of student communities visible on its official website.
          </BlogParagraph>
          <BlogParagraph>
            KIET lists technical clubs including Kinesis Technical Society,
            SAEKIET, Google Developer Groups, MLSA, CP Byte, DSDL, Dinobots,
            Technocrats, Innogeeks, E-Yantra, Hobby Club, Industrial Electronics
            and Control Club, Socio Tech Innovation Club, Enovat.X, Kodekar Club,
            ECE VLSI Design Club, Creative Cell, E-Cell, FOSSCU, Geek Room KIET
            Chapter, Pharma Innovation Club, Aayushmaan Club, Autodrag and KIET
            Product Innovation Center.
          </BlogParagraph>
          <BlogParagraph>
            Innogeeks, one of KIET's technical communities, describes itself as a
            centre of technical excellence and mentions student achievement in
            competitions such as Smart India Hackathon, Hack the Mountains and
            Hack This Fall, as well as selections for programmes such as Google
            Summer of Code. Its open-source initiative, Innogeeks Winter of Code,
            is described as having grown from a campus-wide programme to a
            national platform over three editions.
          </BlogParagraph>
        </BlogSection>

        <BlogSection
          title="Cultural Clubs, Sports and Campus Engagement"
          image="https://unibuzz-uploads.s3.ap-south-1.amazonaws.com/uploads/timeline/68e8e63d799d9b0a2790f8da/3-e-ff98742e-0dc8-47d3-8e0c-207702fca909.png"
          imageAlt="KIET cultural clubs"
        >
          <BlogParagraph>
            Campus life is also visible outside technology. KIET's cultural club
            page lists communities such as KIET Music Club, TEDxKIET, Pragmatic
            Fashion Society, KIET Movie Society, Ek Prayass, FC-KIET, The
            Impeccables, Kavyanjali, KIET Model United Nations, NSS, Quizzinga,
            Spark Creations, Uddeshhya, Ek Bharat Shreshtha Bharat, NCC, VPAKSH
            Dramatics Society, Women Outreach Cell, Odyssey, Steppers Dance Crew,
            Phoenix Dance Crew and E-Booster Club.
          </BlogParagraph>
          <BlogParagraph>
            This matters because extracurricular life is not just "fun after
            class." It is where students practise communication, leadership,
            teamwork, event management, public speaking, creativity, service and
            confidence. KIET's sports infrastructure — cricket, football,
            volleyball, basketball, badminton, lawn tennis, indoor sports and
            gymnasiums — supports the same wider idea of holistic student
            development.
          </BlogParagraph>
        </BlogSection>

        <BlogSection title="Where Moodle, ERP and Academic Platforms Fit In">
          <BlogParagraph>
            KIET has already been investing in digital systems for academic
            efficiency. KIET's academics page mentions teaching-learning through{" "}
            <Bold> Learning Management System (Moodle)</Bold> and{" "}
            <Bold>Enterprise Resource Planning</Bold>
            systems such as KIET ERP and Cyber Vidya. KIET's older NAAC material
            also refers to online assessment and evaluation through KIET Moodle,
            Google Classroom and other online systems during COVID-era academic
            continuity.
          </BlogParagraph>
          <BlogParagraph>
            That is important because it shows KIET is not new to digital
            infrastructure. But it also creates a useful distinction.
          </BlogParagraph>
          <BlogParagraph>
            <Bold> Moodle and ERP systems are mainly academic and administrative platforms.</Bold>
            They help with courses, content delivery, attendance, assessments,
            monitoring and academic workflows.
          </BlogParagraph>
          <BlogParagraph>
            <Bold>Unibuzz is not trying to replace Moodle. Unibuzz is a different layer. </Bold>
            It is closer to a verified campus community platform — more
            comparable to a university-specific Slack, Teams or student community
            network than to an LMS.
          </BlogParagraph>
        </BlogSection>

        <BlogSection
          title="Why KIET and Unibuzz Make Sense Together"
          image="https://unibuzz-uploads.s3.ap-south-1.amazonaws.com/uploads/timeline/68e8e63d799d9b0a2790f8da/3-f-723f71d8-26c0-44ac-9732-eaecb591e4ef.png"
          imageAlt="Moodle ERP and Unibuzz"
        >
          <BlogParagraph>
            The KIET–Unibuzz collaboration is strongest when understood around
            student development beyond the classroom.
          </BlogParagraph>
          <BlogParagraph>
            KIET already has the infrastructure, clubs, technical societies,
            sports culture, events, academic systems and placement ecosystem. What
            Unibuzz adds is a verified digital campus layer where these
            opportunities can become easier for students to discover, join and
            follow.
          </BlogParagraph>
          <BlogBulletList intro="In simple terms:">
            <BlogBulletItem bold={false}>
              Moodle helps with courses and academic learning workflows.
            </BlogBulletItem>
            <BlogBulletItem bold={false}>
              ERP helps with institutional operations and student records.
            </BlogBulletItem>
            <BlogBulletItem bold={false}>
              Unibuzz helps with campus community, student groups, events, peer
              discovery, announcements and everyday student engagement.
            </BlogBulletItem>
          </BlogBulletList>
          <BlogParagraph>
            For a campus like KIET, where students already have technical clubs,
            cultural societies, sports activity, hackathons, placement preparation
            and student-led groups, the challenge is not only creating
            opportunities. The challenge is making sure students can actually
            discover them early, join the right groups, stay updated and feel
            connected.
          </BlogParagraph>
        </BlogSection>

        <BlogSection
          image="https://unibuzz-uploads.s3.ap-south-1.amazonaws.com/uploads/timeline/68e8e63d799d9b0a2790f8da/3-g-fb2ef0f3-e47b-4840-bcb7-695cdbaf79bc.png"
          imageAlt="How Unibuzz helped KIET"
          title="How Unibuzz Helped KIET"
        >
          <BlogParagraph>
            The most honest way to say this is: Unibuzz helped KIET extend its
            student-life ecosystem into a verified digital community space.
          </BlogParagraph>
          <BlogParagraph>
            Instead of student communication being scattered across informal
            WhatsApp groups, Instagram pages, email threads, departmental notices
            and word-of-mouth, Unibuzz gives KIET a platform where students can
            connect around verified university identity, discover groups, follow
            campus updates, join communities and participate in college life more
            easily.
          </BlogParagraph>

          <BlogBulletList intro="This is especially useful for extracurricular and student-development areas.">
            <BlogBulletItem bold={false}>
              technical clubs can become more visible to first-year students
            </BlogBulletItem>
            <BlogBulletItem bold={false}>
              cultural societies can promote activities and recruit members more
              easily
            </BlogBulletItem>
            <BlogBulletItem bold={false}>
              students can discover peers from their branch, year or interests
            </BlogBulletItem>
            <BlogBulletItem bold={false}>
              official and student-led groups can have a cleaner, campus-specific
              space
            </BlogBulletItem>
            <BlogBulletItem bold={false}>
              college life becomes easier for applicants and new students to
              understand
            </BlogBulletItem>
          </BlogBulletList>
          <BlogParagraph>
            KIET is already investing in the parts of college life that applicants
            care about: academics, placements, labs, innovation, sports, clubs,
            events and student support. Unibuzz fits into that picture because it
            does not try to replace those efforts. It helps make them more
            visible, more connected and easier for students to participate in.
          </BlogParagraph>
          <BlogParagraph>
            For applicants, this is the real message: choosing a college is not
            only about one placement number or one ranking. It is also about
            whether the campus gives you enough chances to learn, build, meet
            people, join communities and grow beyond the classroom.
          </BlogParagraph>
          <BlogParagraph>
            That is where KIET and Unibuzz are aligned. KIET provides the campus
            ecosystem. Unibuzz helps bring that ecosystem into a verified digital
            campus experience.
          </BlogParagraph>
          <BlogCta
            label="Explore KIET Ghaziabad"
            href="KIET Group of Institutions"
          />
        </BlogSection>
      </View>
    </BlogPostLayout>
  );
};

export default KietUnibuzzBlog;

const styles = StyleSheet.create({
  content: {
    width: "100%",
    alignItems: "flex-start",
    gap: 48,
  },
  bold: {
    fontWeight: "700",
    fontFamily: FONTS.inter.bold,
    color: "#374151",
  },
});
