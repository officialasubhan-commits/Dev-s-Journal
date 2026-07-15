import { faker } from "@faker-js/faker";

// Helper functions for consistent unique IDs
const generateSlug = (title: string) => 
  title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") + "-" + faker.string.alphanumeric(4);

// Predefined tech arrays to ensure realistic content
const technologies = [
  "React", "Next.js", "TypeScript", "Node.js", "Python", 
  "Django", "AWS", "Docker", "Kubernetes", "PostgreSQL", 
  "MongoDB", "Redis", "GraphQL", "Tailwind CSS", "Go"
];

const difficulties = ["Beginner", "Intermediate", "Advanced"];

export function generateBlogs(count: number, authorId: string, categoryIds: string[]) {
  const blogs = [];
  for (let i = 0; i < count; i++) {
    const tech = faker.helpers.arrayElement(technologies);
    const title = `${faker.word.adjective()} Guide to ${tech} in ${faker.date.past().getFullYear()}: ${faker.lorem.words(3)}`;
    blogs.push({
      title,
      slug: generateSlug(title),
      content: `## Introduction to ${tech}\n\n${faker.lorem.paragraphs(2)}\n\n### Why use ${tech}?\n\n${faker.lorem.paragraphs(3)}\n\n### Best Practices\n\n- ${faker.lorem.sentence()}\n- ${faker.lorem.sentence()}\n- ${faker.lorem.sentence()}\n\n### Conclusion\n\n${faker.lorem.paragraph()}`,
      coverImage: `https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop&random=${i}`,
      published: true,
      readingTime: faker.number.int({ min: 3, max: 15 }),
      tags: [tech, "Programming", "Tutorial"],
      likes: faker.number.int({ min: 10, max: 500 }),
      authorId,
      categoryId: faker.helpers.arrayElement(categoryIds),
      createdAt: faker.date.past(),
    });
  }
  return blogs;
}

export function generateProjects(count: number, authorId: string) {
  const projects = [];
  for (let i = 0; i < count; i++) {
    const tech = faker.helpers.arrayElements(technologies, faker.number.int({ min: 2, max: 5 }));
    const title = `${faker.company.name()} - ${faker.hacker.adjective()} ${faker.hacker.noun()}`;
    projects.push({
      title,
      slug: generateSlug(title),
      description: faker.company.catchPhrase(),
      content: `## Overview\n\n${faker.lorem.paragraphs(2)}\n\n## Architecture\n\nBuilt with ${tech.join(", ")}.`,
      features: `- ${faker.company.catchPhrase()}\n- ${faker.company.catchPhrase()}\n- ${faker.company.catchPhrase()}`,
      challenges: faker.lorem.paragraph(),
      lessonsLearned: faker.lorem.paragraph(),
      technologies: tech,
      githubUrl: "https://github.com/abdus-subhan",
      liveUrl: "https://example.com",
      coverImage: `https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop&random=${i}`,
      images: [
        `https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop&random=${i}a`,
        `https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop&random=${i}b`
      ],
      authorId,
      startDate: faker.date.past(),
      endDate: faker.date.recent(),
      published: true,
      pinned: faker.datatype.boolean(),
    });
  }
  return projects;
}

export function generateCourses(count: number, authorId: string) {
  const courses = [];
  for (let i = 0; i < count; i++) {
    const tech = faker.helpers.arrayElement(technologies);
    const isFree = faker.datatype.boolean();
    const title = `Mastering ${tech}: From Zero to Hero ${faker.string.alphanumeric(4)}`;
    
    courses.push({
      title,
      slug: generateSlug(title),
      instructor: "Abdus Subhan",
      instructorBio: "Senior Software Engineer with 8+ years of experience.",
      instructorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop",
      shortDescription: faker.lorem.sentence(),
      description: `Welcome to this comprehensive course on ${tech}. \n\n${faker.lorem.paragraphs(3)}`,
      coverImage: `https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=800&auto=format&fit=crop&random=${i}`,
      difficulty: faker.helpers.arrayElement(difficulties),
      category: "Development",
      tags: [tech, faker.hacker.noun()],
      duration: `${faker.number.int({ min: 2, max: 40 })}h ${faker.number.int({ min: 10, max: 59 })}m`,
      lessonsCount: faker.number.int({ min: 10, max: 100 }),
      rating: faker.number.float({ min: 4.0, max: 5.0, fractionDigits: 1 }),
      studentsCount: faker.number.int({ min: 100, max: 10000 }),
      language: "English",
      isFree,
      price: isFree ? 0 : faker.number.int({ min: 19, max: 199 }),
      outcomes: [faker.lorem.sentence(), faker.lorem.sentence(), faker.lorem.sentence()],
      requirements: ["Basic computer knowledge", "A willingness to learn"],
      targetAudience: ["Beginners", "Intermediate Developers"],
      authorId,
      published: true,
    });
  }
  return courses;
}

export function generateCertificates(count: number, authorId: string) {
  const certificates = [];
  for (let i = 0; i < count; i++) {
    certificates.push({
      title: `${faker.helpers.arrayElement(technologies)} Certified Professional ${faker.string.alphanumeric(4)}`,
      issuer: faker.company.name(),
      date: faker.date.past(),
      url: "https://example.com/certificate",
      image: `https://images.unsplash.com/photo-1523289217630-0dd16184af8e?q=80&w=800&auto=format&fit=crop&random=${i}`,
      skills: faker.helpers.arrayElements(technologies, 3),
      userId: authorId,
    });
  }
  return certificates;
}

export function generateFAQs(count: number) {
  const faqs = [];
  for (let i = 0; i < count; i++) {
    faqs.push({
      question: `${faker.lorem.sentence().replace(".", "?")}`,
      answer: faker.lorem.paragraph(),
      global: true,
    });
  }
  return faqs;
}

export function generateTestimonials(count: number) {
  const testimonials = [];
  for (let i = 0; i < count; i++) {
    testimonials.push({
      name: faker.person.fullName(),
      role: faker.person.jobTitle(),
      company: faker.company.name(),
      content: faker.lorem.paragraph(),
      avatarUrl: faker.image.avatar(),
      rating: 5,
      featured: faker.datatype.boolean(),
    });
  }
  return testimonials;
}

export function generateNotifications(count: number, userId: string) {
  const notifications = [];
  const types = ["SYSTEM", "CONTRIBUTION", "COMMENT", "LIKE", "MODERATION", "ANNOUNCEMENT"];
  for (let i = 0; i < count; i++) {
    notifications.push({
      type: faker.helpers.arrayElement(types),
      title: faker.lorem.words(4),
      message: faker.lorem.sentence(),
      userId,
      read: faker.datatype.boolean(),
      published: true,
    });
  }
  return notifications;
}

export function generateSkills(count: number, userId: string) {
  const skills = [];
  for (let i = 0; i < count; i++) {
    skills.push({
      name: faker.helpers.arrayElement(technologies) + " " + faker.word.noun(),
      category: faker.helpers.arrayElement(["Frontend", "Backend", "DevOps", "Design"]),
      proficiency: faker.number.int({ min: 40, max: 99 }),
      userId,
    });
  }
  return skills;
}

export function generateGallery(count: number, authorId: string) {
  const images = [];
  for (let i = 0; i < count; i++) {
    images.push({
      url: `https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop&random=${i}`,
      caption: faker.lorem.sentence(),
      authorId,
    });
  }
  return images;
}

export function generateMessages(count: number) {
  const messages = [];
  for (let i = 0; i < count; i++) {
    messages.push({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      subject: faker.lorem.words(3),
      message: faker.lorem.paragraph(),
      read: faker.datatype.boolean(),
    });
  }
  return messages;
}
