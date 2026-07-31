import React from "react";
import { View, StyleSheet } from "react-native";
import BlogPostLayout from "@/components/molecules/Blogs/BlogPostLayout";
import {
  BlogCta,
  BlogParagraph,
  BlogSection,
} from "@/components/molecules/Blogs/BlogContent";

const TITLE =
  "Aggarwal College, Ballabgarh: A Legacy Campus Taking a Practical Step into the Digital Student-Life Era";

const AggarwalCollegeBlog = () => {
  return (
    <BlogPostLayout title={TITLE} date="July 29, 2026">
      <View style={styles.content}>
        <BlogSection
          title="About Aggarwal College, Ballabgarh"
          image="https://dev-unibuzz.vercel.app/_next/image?url=https%3A%2F%2Funibuzz-uploads.s3.ap-south-1.amazonaws.com%2Fuploads%2Ftimeline%2F68e8e63d799d9b0a2790f8da%2F4-a-39aa46f3-727c-40bb-b3e3-d612a471a8ea.png&w=640&q=75"
          imageAlt="About Aggarwal College Ballabgarh"
        >
          <BlogParagraph>
            Aggarwal College, Ballabgarh is a post-graduate co-educational college
            aided by the Haryana Government and affiliated to M.D. University,
            Rohtak. The college was established in 1971 under the aegis of
            Aggarwal Vidya Pracharni Sabha and has grown into one of the
            recognised higher education institutions in the Faridabad-Ballabgarh
            region.
          </BlogParagraph>
          <BlogParagraph>
            The institution is recognised under Section 2(f) and 12(B) of the
            UGC Act, 1956, is AICTE-approved, and holds NAAC A++ accreditation
            with a CGPA of 3.57. The college was also awarded "College with
            Potential for Excellence" status by UGC in 2016.
          </BlogParagraph>
        </BlogSection>

        <BlogSection title="A Campus Built Around Access, Academics and Student Development">
          <BlogParagraph>
            Aggarwal College is situated in Ballabgarh, Faridabad, on the
            Delhi-Faridabad-Ballabgarh corridor. That location matters because
            it gives students connectivity to the broader Delhi NCR education
            and career ecosystem, while also serving the local student
            population in Faridabad and Ballabgarh.
          </BlogParagraph>
          <BlogParagraph>
            The college positions itself around academic excellence, modern
            infrastructure, values, skills and holistic development. Its public
            pages mention a fully air-conditioned, Wi-Fi-enabled campus, smart
            classrooms, modern computer labs, a classic auditorium, library and
            e-resources, sports and cultural activities, NCC, NSS, YRC, RRC,
            safety cells, counselling support, industry exposure, internships
            and expert talks.
          </BlogParagraph>
        </BlogSection>

        <BlogSection
          title="Aggarwal College's Campus Activity Is Not Only Academic"
          image="https://dev-unibuzz.vercel.app/_next/image?url=https%3A%2F%2Funibuzz-uploads.s3.ap-south-1.amazonaws.com%2Fuploads%2Ftimeline%2F68e8e63d799d9b0a2790f8da%2F4-b-6f8b6e65-988b-489d-b651-7beadfdee153.png&w=640&q=75"
          imageAlt="Aggarwal College campus activity"
        >
          <BlogParagraph>
            The college's event pages show a wide range of activity: scholarship
            and admission programmes, anti-addiction and anti-terrorism rallies,
            water awareness campaigns, farewell ceremonies, GST seminar
            activity, self-defense and empowerment, healthcare-industry
            sessions, World Book Day library events, Sanskrit council activity,
            investment banking career counselling, World Earth Day, emerging
            technology sessions, IPR activities, poster competitions, national
            workshops, nukkad natak, online quizzes, finance workshops, moot
            court activity, Aryabhatta Club activity, guest lectures, job fair
            activity, athletic meet activity and more.
          </BlogParagraph>
          <BlogParagraph>
            That matters because the future of higher education is not only
            about uploading notes online. It is about making sure students can
            discover the opportunities already happening around them.
          </BlogParagraph>
        </BlogSection>

        <BlogSection
          title="Why Aggarwal College Wanted a More Centralised Digital Campus Space"
          image="https://dev-unibuzz.vercel.app/_next/image?url=https%3A%2F%2Funibuzz-uploads.s3.ap-south-1.amazonaws.com%2Fuploads%2Ftimeline%2F68e8e63d799d9b0a2790f8da%2F4-c-d931d3d4-34f7-435f-9939-fe02cec242d9.jpg&w=640&q=75"
          imageAlt="Centralised digital campus space"
        >
          <BlogParagraph>
            From our conversations and partnership work, one thing became clear:
            Aggarwal College is not trying to remain stuck in old communication
            habits. The college is open to change and willing to try newer, more
            efficient platforms if they can genuinely make student life easier.
          </BlogParagraph>
          <BlogParagraph>
            The need was practical. A college with many courses, departments and
            activities should not have student communication scattered
            everywhere. Different courses need their own spaces. Clubs need
            visibility. Official updates need reach. Students should be able to
            find events, groups and opportunities without depending only on word
            of mouth.
          </BlogParagraph>
          <BlogParagraph>
            That is where the Unibuzz × Aggarwal College partnership began to
            make sense.
          </BlogParagraph>
        </BlogSection>

        <BlogSection
          title="What Unibuzz Is — and What It Is Not"
          image="https://dev-unibuzz.vercel.app/_next/image?url=https%3A%2F%2Funibuzz-uploads.s3.ap-south-1.amazonaws.com%2Fuploads%2Ftimeline%2F68e8e63d799d9b0a2790f8da%2F4-u-c90949a1-4691-42c8-89f5-36d9db8d02b1.png&w=640&q=75"
          imageAlt="What Unibuzz is"
        >
          <BlogParagraph>
            Unibuzz is not Moodle. It is not trying to replace academic learning
            management systems, ERP platforms or formal administrative tools.
          </BlogParagraph>
          <BlogParagraph>
            Moodle and similar systems are usually built around courses,
            assignments, resources, submissions and academic workflows. They are
            useful for structured teaching and learning.
          </BlogParagraph>
          <BlogParagraph>
            Unibuzz is different. It is closer to a verified campus
            communication and community layer — more comparable in spirit to
            tools like Teams, Slack or a private digital campus network, but
            designed specifically for universities and colleges.
          </BlogParagraph>
        </BlogSection>

        <BlogSection
          title="How the Aggarwal College Partnership Helped Unibuzz Grow"
          image="https://unibuzz-uploads.s3.ap-south-1.amazonaws.com/uploads/timeline/68e8e63d799d9b0a2790f8da/4-d-809a5c85-8e99-4214-b360-68963e5e0f46.jpg"
          imageAlt="Partnership helped Unibuzz grow"
        >
          <BlogParagraph>
            This partnership did not only help Aggarwal College. It also helped
            Unibuzz mature as a product.
          </BlogParagraph>
          <BlogParagraph>
            In the early version of Unibuzz, the assumption was simple: students
            would individually sign up, find their university, verify themselves
            and join. That can work for some cases, but after conversations with
            Aggarwal College and multiple other colleges, we realised something
            important.
          </BlogParagraph>
          <BlogParagraph>
            Institutions do not want extra burden. They do not want to spend
            weeks explaining a new platform, chasing signups or manually
            organising every student into the right spaces.
          </BlogParagraph>
          <BlogParagraph>So Unibuzz evolved.</BlogParagraph>
        </BlogSection>

        <BlogSection title="Our 3-Year MOU with Aggarwal College">
          <BlogParagraph>
            Unibuzz and Aggarwal College are working under a 3-year MOU. The goal
            is not to force a sudden change overnight. The goal is to implement
            Unibuzz slowly but steadily in a way that fits the college's existing
            environment.
          </BlogParagraph>
          <BlogParagraph>
            This is important because real digital transformation in colleges
            does not happen by simply launching a platform. It happens when
            faculty, students, departments, clubs and administrators can actually
            use the platform without feeling that it has become another burden.
          </BlogParagraph>
          <BlogParagraph>
            That is the spirit of this partnership: practical change, not
            performative digitalisation.
          </BlogParagraph>
        </BlogSection>

        <BlogSection
          title="A Genuine Collaboration, Not Just a Listing"
          image="https://unibuzz-uploads.s3.ap-south-1.amazonaws.com/uploads/timeline/68e8e63d799d9b0a2790f8da/unsplash_E3rYHQ_gfk0%20%281%29-76523f7b-a8c5-4b96-873c-a3a78e904f69.png"
          imageAlt="Genuine collaboration"
        >
          <BlogParagraph>
            For Unibuzz, Aggarwal College is not just another college name on a
            partner list. It is one of the institutions that helped us better
            understand what colleges actually need from a digital campus
            platform.
          </BlogParagraph>
          <BlogParagraph>
            Aggarwal College wanted a more centralised place for its different
            courses and a more efficient way to support student communication.
            The college's openness to trying new digital solutions helped Unibuzz
            refine our implementation model, reduce onboarding friction and
            think more seriously about how to support institutions rather than
            simply expecting them to adopt a new app on their own.
          </BlogParagraph>
          <BlogParagraph>
            That is why this partnership feels important. It shows the direction
            Unibuzz believes higher education should move in: not more scattered
            apps, not more isolated WhatsApp groups, and not more invisible
            campus activity — but a verified, organised and student-first digital
            campus layer.
          </BlogParagraph>
          <BlogCta
            label="Explore Aggarwal College"
            href="Aggarwal College, Ballabgarh"
          />
        </BlogSection>
      </View>
    </BlogPostLayout>
  );
};

export default AggarwalCollegeBlog;

const styles = StyleSheet.create({
  content: {
    width: "100%",
    alignItems: "flex-start",
    gap: 48,
  },
});
