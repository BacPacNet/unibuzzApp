import React from "react";
import { View, StyleSheet } from "react-native";
import BlogPostLayout from "@/components/molecules/Blogs/BlogPostLayout";
import {
  BlogBulletItem,
  BlogBulletList,
  BlogCta,
  BlogParagraph,
  BlogSection,
} from "@/components/molecules/Blogs/BlogContent";

const TITLE =
  "Why Campus Life, Clubs and Hackathons Matter for Placements: A Guide for College Applicants";

const CampusLifePlacementsBlog = () => {
  return (
    <BlogPostLayout title={TITLE} date="July 29, 2026">
      <View style={styles.intro}>
        <BlogParagraph>
          When students compare colleges, one word usually comes first:
        </BlogParagraph>
        <BlogParagraph bold>placements.</BlogParagraph>
        <BlogParagraph>
          That is understandable. Students want to know whether a college can
          help them get a good job, internship, or career start after
          graduation.
        </BlogParagraph>
        <BlogParagraph>
          But there is one mistake many applicants make.
        </BlogParagraph>
        <BlogParagraph>
          They treat placements like something that happens only at the end of
          college.
        </BlogParagraph>
        <BlogParagraph>
          In reality, placement readiness is built over four years. It comes from
          academics, yes, but also from projects, clubs, hackathons, internships,
          communication skills, teamwork, seniors, peer groups, and the general
          campus environment.
        </BlogParagraph>
        <BlogParagraph>
          So while comparing colleges, students should not only ask:
        </BlogParagraph>
        <BlogParagraph bold>What is the highest package?</BlogParagraph>
        <BlogParagraph>They should also ask:</BlogParagraph>
        <BlogParagraph bold>
          Will this college help me become employable?
        </BlogParagraph>
      </View>

      <View style={styles.content}>
        <BlogSection
          title="Employers Do Not Hire Only Marks"
          image="https://unibuzz-uploads.s3.ap-south-1.amazonaws.com/uploads/timeline/68e8e63d799d9b0a2790f8da/2-4-b93e8559-3fec-4c6c-bad7-7a737b662252.jpg"
          imageAlt="Employers do not hire only marks"
        >
          <BlogParagraph>
            Marks and academic performance matter. No serious student should
            ignore academics.
          </BlogParagraph>
          <BlogParagraph>
            But employers also look for proof that a student can think,
            communicate, work in a team, solve problems, learn quickly, and take
            initiative.
          </BlogParagraph>
          <BlogParagraph>
            According to the National Association of Colleges and Employers Job
            Outlook 2025 survey, nearly 90% of employers said they look for
            evidence of problem-solving skills on student resumes. Nearly 80%
            said they look for teamwork skills. Written communication,
            initiative, work ethic and technical skills were also important to at
            least 70% of responding employers.
          </BlogParagraph>
          <BlogParagraph>
            This matters because these skills are not built only by attending
            lectures.
          </BlogParagraph>

          <BlogBulletList intro="They are often built when students:">
            <BlogBulletItem>Work on technical projects</BlogBulletItem>
            <BlogBulletItem>Participate in hackathons</BlogBulletItem>
            <BlogBulletItem>Join coding clubs</BlogBulletItem>
            <BlogBulletItem>Lead student societies</BlogBulletItem>
            <BlogBulletItem>Organize events</BlogBulletItem>
            <BlogBulletItem>Play team sports</BlogBulletItem>
            <BlogBulletItem>Work with seniors and peers</BlogBulletItem>
            <BlogBulletItem>Present ideas in front of others</BlogBulletItem>
            <BlogBulletItem>
              Solve real problems outside the classroom
            </BlogBulletItem>
          </BlogBulletList>
          <BlogParagraph>
            This is why campus life is not just "extra." For many students, it
            becomes the training ground for future careers.
          </BlogParagraph>
        </BlogSection>

        <BlogSection title="Career Readiness Is Bigger Than Syllabus Completion">
          <BlogParagraph>
            NACE defines career readiness through eight broad competencies:
            career and self-development, communication, critical thinking,
            equity and inclusion, leadership, professionalism, teamwork, and
            technology.
          </BlogParagraph>
          <BlogParagraph>Look at that list carefully.</BlogParagraph>
          <BlogParagraph>
            Only one part is directly about technical knowledge. The rest
            includes how students work, think, communicate, lead, behave,
            collaborate and grow.
          </BlogParagraph>
          <BlogParagraph>
            That is why college selection should not be only about the syllabus,
            the building, or the ranking.
          </BlogParagraph>
          <BlogParagraph>
            Applicants should ask whether a college gives students enough chances
            to practise these things in real situations.
          </BlogParagraph>
        </BlogSection>

        <BlogSection
          title="Why Hackathons Matter for Engineering Students"
          image="https://unibuzz-uploads.s3.ap-south-1.amazonaws.com/uploads/timeline/68e8e63d799d9b0a2790f8da/2-3-c80389c7-72e6-4b62-8d12-b278bc028eeb.jpg"
          imageAlt="Hackathons for engineering students"
        >
          <BlogParagraph>
            For engineering students, hackathons can be especially useful.
          </BlogParagraph>
          <BlogParagraph>
            A hackathon forces students to do many things at once:
          </BlogParagraph>
          <BlogBulletList>
            <BlogBulletItem>understand a problem quickly</BlogBulletItem>
            <BlogBulletItem>work with a team</BlogBulletItem>
            <BlogBulletItem>divide responsibilities</BlogBulletItem>
            <BlogBulletItem>
              build something under time pressure
            </BlogBulletItem>
            <BlogBulletItem>debug and improve ideas</BlogBulletItem>
            <BlogBulletItem>present the final solution</BlogBulletItem>
            <BlogBulletItem>accept feedback</BlogBulletItem>
          </BlogBulletList>
          <BlogParagraph>
            These are very close to real workplace skills.
          </BlogParagraph>
          <BlogParagraph>
            A 2024 review on hackathons in education found that hackathons can
            enhance teamwork, creativity and real-world problem-solving, while
            making learning more practical and engaging.
          </BlogParagraph>
          <BlogParagraph>
            This does not mean every hackathon automatically leads to a job. That
            would be an overclaim.
          </BlogParagraph>
          <BlogParagraph>
            But a student who regularly participates in hackathons may build
            stronger confidence, better project experience, and more practical
            proof of skills than a student who only studies theory.
          </BlogParagraph>
        </BlogSection>

        <BlogSection
          title="Clubs and Societies Build Skills Students Do Not Always Notice"
          image="https://unibuzz-uploads.s3.ap-south-1.amazonaws.com/uploads/timeline/68e8e63d799d9b0a2790f8da/2-2-de246771-846c-4133-a4b6-74027c913eef.jpg"
          imageAlt="Clubs and societies"
        >
          <BlogParagraph>
            Many students think clubs are only for fun.
          </BlogParagraph>
          <BlogParagraph>Sometimes they are. And that is fine.</BlogParagraph>
          <BlogParagraph>
            But clubs can also build useful career skills without students
            realizing it.
          </BlogParagraph>
          <BlogParagraph>For example:</BlogParagraph>
          <BlogBulletList>
            <BlogBulletItem>
              A coding club helps students practise problem-solving and peer
              learning.
            </BlogBulletItem>
            <BlogBulletItem>
              A robotics club helps students build hardware and software
              projects.
            </BlogBulletItem>
            <BlogBulletItem>
              A debate society improves communication and confidence.
            </BlogBulletItem>
            <BlogBulletItem>
              A cultural club teaches teamwork, planning and event execution.
            </BlogBulletItem>
            <BlogBulletItem>
              A sports team teaches discipline, leadership and pressure handling.
            </BlogBulletItem>
            <BlogBulletItem>
              An entrepreneurship cell helps students understand ideas, markets
              and pitching.
            </BlogBulletItem>
            <BlogBulletItem>
              A placement or career community helps students prepare for
              interviews and internships.
            </BlogBulletItem>
          </BlogBulletList>
          <BlogParagraph>
            These experiences become stories students can later use in
            interviews.
          </BlogParagraph>
          <BlogParagraph>
            When an interviewer asks, "Tell me about a time you worked in a
            team," the answer rarely comes from a textbook. It usually comes from
            a project, club, competition, event, internship, or campus
            experience.
          </BlogParagraph>
        </BlogSection>

        <BlogSection
          title="The Problem: Campus Life Is Hard to See Before Admission"
          image="https://unibuzz-uploads.s3.ap-south-1.amazonaws.com/uploads/timeline/68e8e63d799d9b0a2790f8da/2-1-5a671066-ed25-4031-99a4-4a80afbebdd1.jpg"
          imageAlt="Campus life before admission"
        >
          <BlogParagraph>
            Most applicants cannot properly see campus life before joining a
            college.
          </BlogParagraph>
          <BlogParagraph>They usually depend on:</BlogParagraph>
          <BlogBulletList>
            <BlogBulletItem>college websites</BlogBulletItem>
            <BlogBulletItem>admission brochures</BlogBulletItem>
            <BlogBulletItem>Google search results</BlogBulletItem>
            <BlogBulletItem>YouTube reviews</BlogBulletItem>
            <BlogBulletItem>Instagram pages</BlogBulletItem>
            <BlogBulletItem>
              one or two people they already know
            </BlogBulletItem>
          </BlogBulletList>
          <BlogParagraph>
            These sources are useful, but incomplete.
          </BlogParagraph>
          <BlogParagraph>
            They do not always show whether student groups are active, whether
            technical events are happening, whether seniors are helping juniors,
            or whether the college actually has a living campus culture.
          </BlogParagraph>
          <BlogParagraph>
            This is where a digital campus can help.
          </BlogParagraph>
        </BlogSection>

        <BlogSection title="Explore the Campus Before You Choose">
          <BlogParagraph>
            Unibuzz is building a verified digital campus space where students,
            faculty, admins and applicants can discover campus communities in a
            more structured way.
          </BlogParagraph>
          <BlogParagraph>
            For applicants, this means college discovery can move beyond static
            information.
          </BlogParagraph>
          <BlogParagraph>
            Instead of only reading "this college has clubs," students should be
            able to explore:
          </BlogParagraph>
          <BlogBulletList>
            <BlogBulletItem>which groups exist</BlogBulletItem>
            <BlogBulletItem>what students are posting</BlogBulletItem>
            <BlogBulletItem>which events are happening</BlogBulletItem>
            <BlogBulletItem>what official updates are shared</BlogBulletItem>
            <BlogBulletItem>
              how active the student community is
            </BlogBulletItem>
            <BlogBulletItem>
              which technical, cultural or placement groups are visible
            </BlogBulletItem>
            <BlogBulletItem>
              how campus communication actually works
            </BlogBulletItem>
          </BlogBulletList>
          <BlogBulletList intro="Currently, Unibuzz partnered colleges include:">
            <BlogBulletItem>
              KIET Group of Institutions, Ghaziabad
            </BlogBulletItem>
            <BlogBulletItem>Aggarwal College, Ballabgarh</BlogBulletItem>
          </BlogBulletList>

          <BlogParagraph>
            For students exploring these colleges, Unibuzz can help show the kind
            of campus ecosystem that does not always appear clearly in rankings
            or admission posters.
          </BlogParagraph>
          <BlogCta label="Explore your Next University" />
        </BlogSection>
      </View>
    </BlogPostLayout>
  );
};

export default CampusLifePlacementsBlog;

const styles = StyleSheet.create({
  intro: {
    width: "100%",
    alignItems: "flex-start",
    gap: 8,
  },
  content: {
    width: "100%",
    alignItems: "flex-start",
    gap: 48,
  },
});
