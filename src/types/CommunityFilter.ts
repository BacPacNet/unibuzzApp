export const GroupCategories = ["Private", "Public", "Official", "Casual"];

export const GroupAccess=['Private', 'Public']
export const GroupType=['Official', 'Casual']
export const GroupLabel=['Course', 'Club','Circle','Other']

export type Category =
  | "Academic"
  | "Educational"
  | "Interest"
  | "Events & Activities"
  | "Personal Growth"
  | "Advocacy and Awareness"
  | "Professional Development"
  | "Utility & Campus Life"


export const categories: Category[] = [
  "Academic",
  "Educational",
  "Interest",
  "Events & Activities",
  "Personal Growth",
  "Advocacy and Awareness",
  "Professional Development",
  "Utility & Campus Life",
  "Advocacy and Awareness"
];

export const subCategories: Record<Category, string[]> = {
 'Academic': [
    'Science',
    'Technology',
    'Arts and Humanities',
    'Social Sciences',
    'Education',
    'Business and Economics',
    'Health & Medicine',
    'Environmental Studies',
    'Laws & Policy',
    'Mathematics & Statistics',
    'Engineering',
    'Coding',
    'Robotics',
    'Philosophy & Religion',
    'Literature & Language',
    'Agriculture',
    'Architecture & Design',
    'Media & Communication',
    'Hospitality & Tourism',
  ],
  'Educational': ['Course Discussion', 'Exam Prep', 'Study Materials', 'Research', 'Study Group', 'Peer Tutoring'],
  'Interest': [
    'Sports & Fitness',
    'Music & Performing Arts',
    'Gaming & Esports',
    'Outdoor Activities',
    'Crafting & DIY',
    'Culinary Arts',
    'Media',
    'Dance',
    'Travel & Exploration',
    'Literature',
    'Culture',
    'Finance & Advice',
    'Language Learning',
    'Memes & Fun',
  ],
  'Events & Activities': [
    'Fest',
    'Competition',
    'Talks & Webinar',
    'Workshop',
    'Social Meetup',
    'Event Organizing',
    'Volunteering',
  ],
  'Personal Growth': [
    'Mindfulness & Meditation',
    'Physical Health',
    'Leadership Development',
    'Stress Management',
    'Public Speaking',
    'Confidence Building',
    'Sex Education',
  ],
  'Advocacy and Awareness': [
    'Environmental Conservation',
    'Human Rights',
    'Gender Equality',
    'LGBTQ+',
    'Mental Health',
    'Animal Welfare',
    'Political Activism',
  ],
  'Professional Development': [
    'Entrepreneurship & Startups',
    'Career Mentorship',
    'Professional Workshops',
    'Internships',
    'Networking & Mixers',
    'Job Hunting',
    'Certificates & Licenses',
  ],
  'Utility & Campus Life': [
    'Cab Sharing',
    'Housing & Roommates',
    'Buy/Sell/Exchange',
    'Lost & Found',
    'Local Services',
    'Student Hacks',
    'Study Exchange',
    'Study Abroad',
    'Alumni Connections',
  ],
};
