import CoursesClient from "./CoursesClient";
import { Course } from "@/lib/mockData";
import { getAcademyCourses } from "@/lib/services/academy";

export default async function CoursesPage() {
  const dbCourses = await getAcademyCourses();

  const courses: Course[] = dbCourses.map(c => {
    return {
      id: c.id,
      title: c.title,
      instructor: c.instructor,
      shortDescription: c.shortDescription,
      description: "",
      coverImage: c.coverImage || "",
      difficulty: c.difficulty as any,
      category: c.category,
      tags: c.tags,
      duration: c.duration,
      lessonsCount: c.lessonsCount,
      rating: c.rating,
      studentsCount: c.studentsCount,
      language: c.language,
      lastUpdated: c.updatedAt.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      isFree: c.isFree,
      price: c.price,
      discountPrice: c.discountPrice || undefined,
      outcomes: [],
      requirements: [],
      targetAudience: [],
      certificateInfo: "",
      curriculum: [],
      faqs: [],
      reviews: []
    };
  });

  return <CoursesClient courses={courses} />;
}
