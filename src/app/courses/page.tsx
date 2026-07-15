"use client";

import { useState, useMemo } from "react";
import { mockCourses, Course } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/ui/SafeImage";
import { SlideUp, StaggerContainer } from "@/components/ui/animations";
import { Search, Grid, List, Heart, Share2, Compass, AlertCircle, Clock, BookOpen, Star, PlayCircle } from "lucide-react";
import Link from "next/link";

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [priceFilter, setPriceFilter] = useState<"all" | "free" | "paid">("all");
  const [sortBy, setSortBy] = useState("popular");
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Unique categories
  const categories = useMemo(() => {
    const list = mockCourses.map(c => c.category);
    return ["All", ...Array.from(new Set(list))];
  }, []);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleShare = (course: Course, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/courses/${course.id}`;
    if (navigator.share) {
      navigator.share({
        title: course.title,
        text: course.shortDescription,
        url,
      }).catch(err => console.log(err));
    } else {
      navigator.clipboard.writeText(url);
      alert("Course link copied to clipboard!");
    }
  };

  // Filter and sort logic
  const filteredCourses = useMemo(() => {
    let result = [...mockCourses];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(c => 
        c.title.toLowerCase().includes(q) || 
        c.instructor.toLowerCase().includes(q) ||
        c.shortDescription.toLowerCase().includes(q) ||
        c.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter(c => c.category === selectedCategory);
    }

    if (selectedLevel !== "All") {
      result = result.filter(c => c.difficulty === selectedLevel);
    }

    if (priceFilter === "free") {
      result = result.filter(c => c.isFree);
    } else if (priceFilter === "paid") {
      result = result.filter(c => !c.isFree);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "popular") return b.studentsCount - a.studentsCount;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "newest") return b.id.localeCompare(a.id); // Simulating date sort via id
      return a.title.localeCompare(b.title);
    });

    return result;
  }, [search, selectedCategory, selectedLevel, priceFilter, sortBy]);

  return (
    <div className="min-h-screen bg-[var(--background)] py-12 md:py-20">
      <div className="container max-w-5xl mx-auto px-6 space-y-12">
        
        {/* Header */}
        <div className="space-y-4 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--secondary-bg)] border border-[var(--border-color)]/70 text-[10px] font-bold text-[var(--secondary)] tracking-wider uppercase">
            <Compass className="w-3.5 h-3.5" />
            <span>Structured Curriculum</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold font-heading text-[var(--text-main)] tracking-tight">
            Developer Academy
          </h1>
          <p className="text-base text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            Gain production-quality skills through deep-dive courses on design, systems architectures, and advanced engineering concepts.
          </p>
        </div>

        {/* Toolbar (Search, Grid/List toggle, Sorting) */}
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-between bg-[var(--card)] border border-[var(--border-color)]/80 p-3 rounded-2xl shadow-sm">
          <div className="w-full sm:max-w-xs relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search academy courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[var(--background)] border border-[var(--border-color)] pl-10 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)]"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {/* Sorting */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[var(--background)] border border-[var(--border-color)] px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-semibold cursor-pointer"
            >
              <option value="popular">Popular Courses</option>
              <option value="rating">Top Rated</option>
              <option value="newest">Latest Release</option>
            </select>

            {/* Layout Toggle Buttons */}
            <div className="flex items-center border border-[var(--border-color)] rounded-xl overflow-hidden p-0.5 bg-[var(--background)] shrink-0">
              <button
                onClick={() => setLayout("grid")}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${layout === "grid" ? 'bg-[var(--card)] text-[var(--primary)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-main)]'}`}
                title="Grid Layout"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLayout("list")}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${layout === "list" ? 'bg-[var(--card)] text-[var(--primary)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-main)]'}`}
                title="List Layout"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Filters + Products Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          
          {/* Filters Sidebar */}
          <aside className="bg-[var(--card)] border border-[var(--border-color)]/80 p-5 rounded-2xl space-y-6 md:sticky md:top-24 shadow-sm">
            <h3 className="font-bold text-sm text-[var(--text-main)] tracking-tight pb-3 border-b border-[var(--border-color)]/60 uppercase">
              Filter Options
            </h3>
            
            {/* Price Filter */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider block">Price Category</label>
              <div className="space-y-1.5 text-sm text-[var(--text-secondary)]">
                {["all", "free", "paid"].map(price => (
                  <label key={price} className="flex items-center gap-2 cursor-pointer hover:text-[var(--text-main)] capitalize">
                    <input
                      type="radio"
                      name="price"
                      checked={priceFilter === price}
                      onChange={() => setPriceFilter(price as any)}
                      className="accent-[var(--primary)]"
                    />
                    <span>{price === "all" ? "Show All" : price}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider block">Topic</label>
              <div className="space-y-1.5 text-sm text-[var(--text-secondary)]">
                {categories.map(cat => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer hover:text-[var(--text-main)]">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === cat}
                      onChange={() => setSelectedCategory(cat)}
                      className="accent-[var(--primary)]"
                    />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Difficulty Level */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider block">Skill Level</label>
              <div className="space-y-1.5 text-sm text-[var(--text-secondary)]">
                {["All", "Beginner", "Intermediate", "Advanced"].map(lvl => (
                  <label key={lvl} className="flex items-center gap-2 cursor-pointer hover:text-[var(--text-main)]">
                    <input
                      type="radio"
                      name="level"
                      checked={selectedLevel === lvl}
                      onChange={() => setSelectedLevel(lvl)}
                      className="accent-[var(--primary)]"
                    />
                    <span>{lvl}</span>
                  </label>
                ))}
              </div>
            </div>

            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => { setSearch(""); setSelectedCategory("All"); setSelectedLevel("All"); setPriceFilter("all"); }}
              className="w-full text-xs font-bold py-2 rounded-xl cursor-pointer"
            >
              Reset Filters
            </Button>
          </aside>

          {/* Courses Listing Content */}
          <div className="md:col-span-3">
            {filteredCourses.length === 0 ? (
              <SlideUp>
                <div className="bg-[var(--card)] border border-[var(--border-color)]/70 p-12 rounded-3xl text-center space-y-4 max-w-md mx-auto shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto">
                    <AlertCircle className="w-6 h-6 text-[var(--primary)]" />
                  </div>
                  <h3 className="font-bold text-lg text-[var(--text-main)]">No courses found</h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    We couldn't find any courses matching your search tags or selected sidebar parameters.
                  </p>
                </div>
              </SlideUp>
            ) : (
              <StaggerContainer className={layout === "grid" ? "grid grid-cols-1 sm:grid-cols-2 gap-6" : "space-y-6"}>
                {filteredCourses.map((course) => (
                  <SlideUp key={course.id}>
                    <Link 
                      href={`/courses/${course.id}`} 
                      className={`group block bg-[var(--card)] border border-[var(--border-color)]/70 rounded-2xl overflow-hidden hover:shadow-md hover:border-[var(--primary)]/20 transition-all duration-300 ${layout === "list" ? "flex flex-col sm:flex-row h-full sm:h-52" : ""}`}
                    >
                      {/* Cover Photo */}
                      <div className={`relative overflow-hidden bg-[var(--secondary-bg)] shrink-0 ${layout === "list" ? "w-full sm:w-64 aspect-video sm:aspect-auto" : "aspect-video border-b border-[var(--border-color)]/60"}`}>
                        <SafeImage 
                          src={course.coverImage} 
                          alt={course.title} 
                          fill 
                          className="object-cover group-hover:scale-[1.02] transition-transform duration-500" 
                        />
                        {/* Wishlist Button overlays image in Grid mode */}
                        <button 
                          onClick={(e) => toggleWishlist(course.id, e)}
                          className="absolute top-3 right-3 p-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-neutral-200 text-neutral-400 hover:text-red-500 hover:scale-105 active:scale-95 shadow-sm transition-all"
                        >
                          <Heart className={`w-3.5 h-3.5 ${wishlist.includes(course.id) ? "fill-red-500 text-red-500" : ""}`} />
                        </button>
                      </div>

                      {/* Content Card Body */}
                      <div className="p-5 flex flex-col justify-between flex-1 space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--secondary)]">
                              {course.category} • {course.difficulty}
                            </span>
                            <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${course.isFree ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                              {course.isFree ? "Free" : "Premium"}
                            </span>
                          </div>

                          <h3 className="font-bold text-base text-[var(--text-main)] font-heading leading-tight group-hover:text-[var(--primary)] transition-colors line-clamp-2">
                            {course.title}
                          </h3>

                          <p className="text-xs text-[var(--text-secondary)] font-normal line-clamp-2">
                            {course.shortDescription}
                          </p>
                        </div>

                        {/* Metas and Footer actions */}
                        <div className="space-y-3 pt-3 border-t border-[var(--border-color)]/50">
                          {/* Course Meta Info */}
                          <div className="flex items-center flex-wrap gap-x-4 gap-y-1.5 text-[10px] text-[var(--text-secondary)] font-medium">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" /> {course.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-3.5 h-3.5" /> {course.lessonsCount} lessons
                            </span>
                            <span className="flex items-center gap-1 text-amber-500 font-semibold">
                              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {course.rating}
                            </span>
                          </div>

                          {/* Price Tag & CTA buttons */}
                          <div className="flex items-center justify-between gap-3 pt-1">
                            <div className="flex items-baseline gap-1.5">
                              {course.isFree ? (
                                <span className="font-extrabold text-sm text-[var(--primary)]">Free Enrollment</span>
                              ) : (
                                <>
                                  <span className="font-extrabold text-base text-[var(--text-main)]">
                                    ${course.discountPrice || course.price}
                                  </span>
                                  {course.discountPrice && (
                                    <span className="text-xs text-[var(--text-muted)] line-through">
                                      ${course.price}
                                    </span>
                                  )}
                                </>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={(e) => handleShare(course, e)}
                                className="h-8 w-8 p-0 rounded-lg text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/5"
                              >
                                <Share2 className="w-4.5 h-4.5" />
                              </Button>
                              
                              <Button variant="default" size="sm" className="h-8 px-4 rounded-lg text-[10px] font-bold cursor-pointer">
                                {course.isFree ? "Join" : "Enroll"}
                              </Button>
                            </div>
                          </div>
                        </div>

                      </div>
                    </Link>
                  </SlideUp>
                ))}
              </StaggerContainer>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
