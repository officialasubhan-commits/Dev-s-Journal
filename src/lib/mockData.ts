export interface Certificate {
  id: string;
  title: string;
  organization: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  skillsGained: string[];
  imageUrl: string;
  verificationUrl: string;
  downloadUrl?: string;
  category: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  isPreview: boolean;
}

export interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  avatarUrl?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  instructorBio?: string;
  instructorAvatar?: string;
  shortDescription: string;
  description: string;
  coverImage: string;
  trailerUrl?: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  tags: string[];
  duration: string;
  lessonsCount: number;
  rating: number;
  studentsCount: number;
  language: string;
  lastUpdated: string;
  isFree: boolean;
  price: number;
  discountPrice?: number;
  outcomes: string[];
  requirements: string[];
  targetAudience: string[];
  curriculum: Section[];
  faqs: FAQ[];
  reviews: Review[];
  certificateInfo: string;
}

export const mockCertificates: Certificate[] = [
  {
    id: "cert-1",
    title: "AWS Certified Solutions Architect – Associate",
    organization: "Amazon Web Services (AWS)",
    issueDate: "2025-11-10",
    expiryDate: "2028-11-10",
    credentialId: "AWS-ASA-99882",
    skillsGained: ["Cloud Architecture", "AWS IAM", "S3", "EC2", "RDS", "VPC"],
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=300&auto=format&fit=crop",
    verificationUrl: "https://aws.amazon.com/verification",
    downloadUrl: "#",
    category: "Cloud & DevOps"
  },
  {
    id: "cert-2",
    title: "Meta Front-End Developer Professional Certificate",
    organization: "Meta",
    issueDate: "2025-06-15",
    credentialId: "META-FED-33211",
    skillsGained: ["React.js", "JavaScript ES6", "HTML5 & CSS3", "Bootstrap", "UX/UI Principles"],
    imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=300&auto=format&fit=crop",
    verificationUrl: "https://coursera.org/verification",
    downloadUrl: "#",
    category: "Frontend"
  },
  {
    id: "cert-3",
    title: "Advanced React & Next.js Masterclass",
    organization: "Udemy",
    issueDate: "2026-02-01",
    credentialId: "UD-NEXT-55442",
    skillsGained: ["Next.js 15/16", "React 19 Server Components", "Turbopack", "Hydration", "Caching API"],
    imageUrl: "https://images.unsplash.com/photo-1618401471353-b98aedd07871?q=80&w=300&auto=format&fit=crop",
    verificationUrl: "https://udemy.com/verification",
    downloadUrl: "#",
    category: "Frontend"
  },
  {
    id: "cert-4",
    title: "Professional Scrum Master I (PSM I)",
    organization: "Scrum.org",
    issueDate: "2025-08-20",
    credentialId: "PSM-1-889900",
    skillsGained: ["Agile Development", "Scrum Framework", "Team Moderation", "Sprint Planning"],
    imageUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=300&auto=format&fit=crop",
    verificationUrl: "https://scrum.org/verification",
    downloadUrl: "#",
    category: "Management"
  }
];

export const mockCourses: Course[] = [
  {
    id: "course-1",
    title: "Complete Next.js 16 & React 19 Frontend Masterclass",
    instructor: "Abdus Subhan",
    instructorBio: "Senior Frontend Engineer & Designer with 8+ years of production Next.js experience. Enjoys building clean user interfaces.",
    instructorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop",
    shortDescription: "Build high-performance, responsive web applications using Next.js 16 Server Actions, Turbopack, and Tailwind CSS v4.",
    description: "Welcome to the most complete guide on modern Next.js development. This course takes you from frontend fundamentals all the way to complex setups including Route protectors, Server actions, database caches, and Pusher realtime sockets sync. We will build production-grade web apps together.",
    coverImage: "https://images.unsplash.com/photo-1618401471353-b98aedd07871?q=80&w=800&auto=format&fit=crop",
    trailerUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    difficulty: "Intermediate",
    category: "Development",
    tags: ["Next.js", "React", "TailwindCSS", "TypeScript"],
    duration: "24h 45m",
    lessonsCount: 42,
    rating: 4.9,
    studentsCount: 1824,
    language: "English",
    lastUpdated: "June 2026",
    isFree: false,
    price: 99,
    discountPrice: 49,
    outcomes: [
      "Master React 19 Server Components and actions architecture",
      "Deploy optimized Next.js static and dynamic routing nodes",
      "Implement dynamic caching parameters to solve database pool leaks",
      "Wire client layout triggers for live Pusher WebSocket syncs",
      "Verify code security parameters using assertAdmin middlewares"
    ],
    requirements: [
      "Basic understanding of HTML, CSS, and modern JavaScript ES6+",
      "Familiarity with React basics (components, props, useState) is useful",
      "A laptop running Windows, macOS, or Linux with Node.js installed"
    ],
    targetAudience: [
      "React developers wanting to level up to Next.js framework architectures",
      "Backend developers looking to build sleek, robust frontend products",
      "Freelancers wanting to offer production-quality SaaS systems to clients"
    ],
    curriculum: [
      {
        id: "sec-1",
        title: "Section 1: Course Overview & Environment Setup",
        lessons: [
          { id: "les-1", title: "1. Welcome to the Masterclass", duration: "05:12", isPreview: true },
          { id: "les-2", title: "2. Setting up Turbopack & Tailwind v4", duration: "12:45", isPreview: false },
          { id: "les-3", title: "3. Project Structure & Code Guidelines", duration: "08:30", isPreview: false }
        ]
      },
      {
        id: "sec-2",
        title: "Section 2: Caching, Database & Route Controls",
        lessons: [
          { id: "les-4", title: "4. Preventing Connection Pool Leaks in Prisma", duration: "18:22", isPreview: true },
          { id: "les-5", title: "5. Route Protection and Next.js 16 Middleware", duration: "15:40", isPreview: false },
          { id: "les-6", title: "6. Securing Server Actions with Admin Verification", duration: "22:15", isPreview: false }
        ]
      },
      {
        id: "sec-3",
        title: "Section 3: Real-Time Sockets Sync",
        lessons: [
          { id: "les-7", title: "7. Integrating Pusher Server Hooks", duration: "14:10", isPreview: false },
          { id: "les-8", title: "8. Client Layout WebSocket Synchronization", duration: "19:05", isPreview: false }
        ]
      }
    ],
    faqs: [
      {
        question: "Is there a certificate of completion included?",
        answer: "Yes, once you complete 100% of the lessons, you will receive an official verifiable digital certificate."
      },
      {
        question: "Will I have lifetime access to course updates?",
        answer: "Absolutely. All future lectures, Next.js releases adjustments, and project files are free forever."
      }
    ],
    reviews: [
      {
        id: "rev-1",
        userName: "Sarah Connor",
        rating: 5,
        comment: "This course single-handedly saved my Next.js deployment. The caching section on Prisma was exactly what I needed to solve my DB leaks!",
        date: "2026-06-12",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop"
      },
      {
        id: "rev-2",
        userName: "David Miller",
        rating: 4.8,
        comment: "Incredibly detailed content. The real-time sockets chapter was clear and straight to the point.",
        date: "2026-07-02",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop"
      }
    ],
    certificateInfo: "Includes an official downloadable digital certificate verifying Solutions Engineering expertise."
  },
  {
    id: "course-2",
    title: "Modern UI/UX Design System Essentials",
    instructor: "Jane Doe",
    instructorBio: "Award-winning Product Designer formerly at Framer & Stripe. Focuses on premium spacing grids.",
    instructorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop",
    shortDescription: "Learn to architect cohesive design languages, typography scales, HSL palettes, and fluid component variants.",
    description: "Design is not just how it looks, it is how it works. This course teaches frontend engineers and digital designers how to build state-of-the-art layout grid systems, configure smooth micro-animations, and design accessible components matching Stripe and Apple quality.",
    coverImage: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=800&auto=format&fit=crop",
    trailerUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    difficulty: "Beginner",
    category: "Design",
    tags: ["UI/UX", "Figma", "Design Systems", "Web Design"],
    duration: "12h 15m",
    lessonsCount: 24,
    rating: 4.8,
    studentsCount: 942,
    language: "English",
    lastUpdated: "May 2026",
    isFree: false,
    price: 59,
    discountPrice: 29,
    outcomes: [
      "Master layout grid structures and fluid vertical rhythm spacing",
      "Map out tailored visual HSL/RGB palettes (Warm Cream, Slate, Coffee)",
      "Create modular components (forms, dialogs, pills) with consistent radius",
      "Animate elements using premium micro-interactions and scroll triggers",
      "Implement design specifications aligned to WCAG 2.2 AA standards"
    ],
    requirements: [
      "No prior design experience required. Beginners are welcome!",
      "A free Figma account to participate in design lab exercises"
    ],
    targetAudience: [
      "Frontend developers who want to learn to design beautiful interfaces themselves",
      "Aspiring UI/UX designers looking to build a premium component portfolio",
      "Product managers wanting to establish better design system specifications"
    ],
    curriculum: [
      {
        id: "sec-1",
        title: "Section 1: Designing with System Tokens",
        lessons: [
          { id: "les-1", title: "1. Welcome & Design Philosophy", duration: "06:40", isPreview: true },
          { id: "les-2", title: "2. Color Systems & Harmony Theories", duration: "14:15", isPreview: true },
          { id: "les-3", title: "3. Establishing Hierarchy with Typography Scales", duration: "18:50", isPreview: false }
        ]
      },
      {
        id: "sec-2",
        title: "Section 2: Figma Labs & Component Construction",
        lessons: [
          { id: "les-4", title: "4. Designing Buttons and Inputs Sheets", duration: "22:10", isPreview: false },
          { id: "les-5", title: "5. Structuring Modals, Droppers and Cards layouts", duration: "25:40", isPreview: false }
        ]
      }
    ],
    faqs: [
      {
        question: "Do we code in this course?",
        answer: "This course is layout-design focused using Figma, but we explain how tokens translate directly into CSS variables."
      }
    ],
    reviews: [
      {
        id: "rev-1",
        userName: "Alex Johnson",
        rating: 5,
        comment: "Outstanding! Changed the way I think about spacing. The cream color system was a great case study.",
        date: "2026-05-18",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop"
      }
    ],
    certificateInfo: "Includes custom digital badge for design system specialization."
  },
  {
    id: "course-3",
    title: "Intro to CSS Variables & Layout Basics",
    instructor: "Abdus Subhan",
    instructorBio: "Senior Frontend Engineer & Designer with 8+ years of production Next.js experience. Enjoys building clean user interfaces.",
    instructorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop",
    shortDescription: "Unlock the power of vanilla CSS variables, transitions, and flexible box layout properties for free.",
    description: "A free introductory course covering how to construct clean layouts without heavy frameworks. Learn flexbox centering, borders, grids, transitions, CSS variables mapping, and layout rhythm basics.",
    coverImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop",
    trailerUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    difficulty: "Beginner",
    category: "Development",
    tags: ["CSS", "Web Design", "HTML", "Beginner"],
    duration: "4h 30m",
    lessonsCount: 10,
    rating: 4.7,
    studentsCount: 3824,
    language: "English",
    lastUpdated: "January 2026",
    isFree: true,
    price: 0,
    outcomes: [
      "Understand variables syntax and global layout styling rules",
      "Deploy responsive grid columns that adjust without media queries",
      "Center items horizontally and vertically using Flexbox",
      "Write smooth CSS transitions for buttons and cards hovers"
    ],
    requirements: [
      "No coding experience is required! Just a web browser."
    ],
    targetAudience: [
      "Complete beginners looking to learn basic coding layouts web sheets",
      "Designers wanting to understand how layouts are programmed in CSS"
    ],
    curriculum: [
      {
        id: "sec-1",
        title: "Section 1: Basic CSS Layouts",
        lessons: [
          { id: "les-1", title: "1. Intro to HTML Nodes", duration: "08:15", isPreview: true },
          { id: "les-2", title: "2. Setting up CSS Variables", duration: "12:30", isPreview: true },
          { id: "les-3", title: "3. Aligning cards with Flexbox", duration: "18:45", isPreview: true }
        ]
      }
    ],
    faqs: [],
    reviews: [],
    certificateInfo: "Does not include an official certification (free tier)."
  }
];

export const mockOrders = [
  {
    id: "ord-1092",
    courseTitle: "Complete Next.js 16 & React 19 Frontend Masterclass",
    date: "2026-07-10",
    price: 49,
    status: "Completed",
    couponUsed: "WELCOME20"
  },
  {
    id: "ord-1081",
    courseTitle: "Modern UI/UX Design System Essentials",
    date: "2026-06-14",
    price: 29,
    status: "Completed"
  }
];
