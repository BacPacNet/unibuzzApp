export const GroupCategories = ["Private", "Public", "Official", "Casual"];

export type Category =
  | "Academic Focus"
  | "Recreation and Hobbies"
  | "Advocacy and Awareness"
  | "Personal Growth"
  | "Professional Development"
  | "Others";

export const categories: Category[] = [
  "Academic Focus",
  "Recreation and Hobbies",
  "Advocacy and Awareness",
  "Personal Growth",
  "Professional Development",
  "Others",
];

export const subCategories: Record<Category, string[]> = {
  "Academic Focus": [
    "Science & Technology",
    "Arts & Humanities",
    "Social Sciences",
    "Education",
    "Business & Economics",
    "Health & Medicine",
    "Environmental Studies",
    "Law & Policy",
    "Mathematics & Statistics",
    "Engineering",
  ],
  "Recreation and Hobbies": [
    "Sports & Fitness",
    "Music & Performing Arts",
    "Gaming & Esports",
    "Outdoor Activities",
    "Crafting & DIY",
    "Culinary Arts",
    "Media Arts",
    "Dance",
    "Travel & Exploration",
    "Literature & Writing",
    "Others",
  ],
  "Advocacy and Awareness": [
    "Environmental Conservation",
    "Human Rights",
    "Gender Equality",
    "LGBTQ+ Advocacy",
    "Mental Health",
    "Disability Rights",
    "Animal Welfare",
    "Political Activism",
    "Scientific Education",
    "Others",
  ],
  "Personal Growth": [
    "Mindfulness & Meditation",
    "Physical Health",
    "Leadership Development",
    "Finance Advice",
    "Stress Management",
    "Public Speaking",
    "Confidence Building",
    "Sex Education",
    "Language Learning",
    "Others",
  ],
  "Professional Development": [
    "Entrepreneurship & Startups",
    "Career Mentorship",
    "Professional Workshops",
    "Internships",
    "Networking & Mixers",
    "Alumni Connections",
    "Job Hunting",
    "Certificates",
    "Business Communication",
    "Others",
  ],
  Others: [],
};
