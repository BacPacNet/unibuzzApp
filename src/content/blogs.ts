export type BlogListItem = {
    title: string
    heading: string
    date: string
    image: string
  }
  
  export const BLOG_POSTS: BlogListItem[] = [
    {
      title: 'best-engineering-colleges-in-ghaziabad-for-2026-applicants',
      heading: 'Best Engineering Colleges in Ghaziabad for 2026 Applicants: Placements, Fees, Campus Life, and What Students Should Really Compare',
      date: 'May 5, 2026',
      image: '/promote.jpg',
    },
    {
      title: 'why-campus-life-clubs-and-hackathons-matter-for-placements',
      heading: 'Why Campus Life, Clubs and Hackathons Matter for Placements: A Guide for College Applicants',
      date: 'July 29, 2026',
      image:
        'https://unibuzz-uploads.s3.ap-south-1.amazonaws.com/uploads/timeline/68e8e63d799d9b0a2790f8da/2-4-b93e8559-3fec-4c6c-bad7-7a737b662252.jpg',
    },
    {
      title: 'kiet-ghaziabad-unibuzz-digital-campus',
      heading: 'KIET Ghaziabad × Unibuzz: Building a More Connected Digital Campus for Student Life',
      date: 'July 29, 2026',
      image:
        'https://unibuzz-uploads.s3.ap-south-1.amazonaws.com/uploads/timeline/68e8e63d799d9b0a2790f8da/3-a-6f611e73-f9e9-4003-b355-45d602d28057.png',
    },
    {
      title: 'aggarwal-college-ballabgarh-digital-student-life',
      heading: 'Aggarwal College, Ballabgarh: A Legacy Campus Taking a Practical Step into the Digital Student-Life Era',
      date: 'July 29, 2026',
      image:
        'https://dev-unibuzz.vercel.app/_next/image?url=https%3A%2F%2Funibuzz-uploads.s3.ap-south-1.amazonaws.com%2Fuploads%2Ftimeline%2F68e8e63d799d9b0a2790f8da%2F4-a-39aa46f3-727c-40bb-b3e3-d612a471a8ea.png&w=640&q=75',
    },
  ]
  
  export function getBlogByTitle(title: string): BlogListItem | undefined {
    return BLOG_POSTS.find((post) => post.title === title)
  }
  