"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { SlideUp, StaggerContainer, FadeIn } from "@/components/ui/animations";
import { SafeImage } from "@/components/ui/SafeImage";
import { Search, Award, ExternalLink, Download, Share2, AwardIcon, ArrowRight } from "lucide-react";
import Link from "next/link";

interface CertificateType {
  id: string;
  title: string;
  issuer: string;
  date: string;
  url?: string | null;
  image?: string | null;
  pdfUrl?: string | null;
  skills: string[];
  published: boolean;
}

export default function CertificationsClient({ initialCerts }: { initialCerts: CertificateType[] }) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedOrg, setSelectedOrg] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [visibleCount, setVisibleCount] = useState(6);

  // Extract unique categories and organizations for filtering
  const categories = useMemo(() => {
    const list = initialCerts.map(c => c.skills[0] || "General");
    return ["All", ...Array.from(new Set(list))];
  }, [initialCerts]);

  const organizations = useMemo(() => {
    const list = initialCerts.map(c => c.issuer);
    return ["All", ...Array.from(new Set(list))];
  }, [initialCerts]);

  // Filter and sort certificates
  const filteredCertificates = useMemo(() => {
    let result = [...initialCerts];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(c => 
        c.title.toLowerCase().includes(q) || 
        c.issuer.toLowerCase().includes(q) ||
        c.skills.some(s => s.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter(c => (c.skills[0] || "General") === selectedCategory);
    }

    if (selectedOrg !== "All") {
      result = result.filter(c => c.issuer === selectedOrg);
    }

    // Sorting
    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      if (sortBy === "newest") return dateB - dateA;
      if (sortBy === "oldest") return dateA - dateB;
      return a.title.localeCompare(b.title);
    });

    return result;
  }, [initialCerts, search, selectedCategory, selectedOrg, sortBy]);

  const displayedCertificates = filteredCertificates.slice(0, visibleCount);

  const handleShare = (cert: CertificateType) => {
    if (navigator.share) {
      navigator.share({
        title: cert.title,
        text: `Check out my certification: ${cert.title} from ${cert.issuer}`,
        url: window.location.href,
      }).catch(err => console.log(err));
    } else {
      navigator.clipboard.writeText(`${cert.title} - ${cert.issuer} Verification: ${cert.url || 'N/A'}`);
      alert("Certificate link copied to clipboard!");
    }
  };

  if (initialCerts.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[var(--background)] px-6">
        <SlideUp>
          <div className="bg-[var(--card)] border border-[var(--border-color)]/70 p-8 md:p-12 rounded-3xl text-center space-y-6 max-w-lg mx-auto shadow-lg relative overflow-hidden">
            {/* Smooth glowing background detail */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-[var(--primary)]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
            
            {/* Floating trophy / award icon */}
            <div className="relative w-24 h-24 mx-auto mb-4 bg-gradient-to-tr from-[var(--primary)]/20 to-orange-500/5 rounded-2xl flex items-center justify-center border border-[var(--primary)]/20 shadow-inner group hover:scale-105 transition-transform duration-300">
              <Award className="w-12 h-12 text-[var(--primary)] animate-[pulse_3s_infinite]" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold font-heading text-[var(--text-main)] tracking-tight">
                No Certificates Published Yet
              </h2>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-sm mx-auto">
                Professional certifications and achievements will be published here soon. Stay tuned for future updates.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="default" className="rounded-xl px-6 font-semibold bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all duration-200" asChild>
                <Link href="/">
                  Back to Homepage <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </SlideUp>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] py-12 md:py-20">
      <div className="container max-w-5xl mx-auto px-6 space-y-12">
        
        {/* Header */}
        <div className="space-y-4 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--secondary-bg)] border border-[var(--border-color)]/70 text-[10px] font-bold text-[var(--secondary)] tracking-wider uppercase">
            <Award className="w-3.5 h-3.5" />
            <span>Professional Credentials</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold font-heading text-[var(--text-main)] tracking-tight">
            Certifications & Badges
          </h1>
          <p className="text-base text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            Verifiable industry-standard certifications proving design, engineering, and cloud infrastructure competence.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-[var(--card)] border border-[var(--border-color)]/80 p-4 rounded-2xl shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Search certificates, skills, or issuing body..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[var(--background)] border border-[var(--border-color)] pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[var(--primary)] transition-all text-[var(--text-main)]"
              />
            </div>
            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-semibold text-[var(--text-secondary)] hidden md:inline">Sort By</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[var(--background)] border border-[var(--border-color)] px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[var(--primary)] transition-all text-[var(--text-main)] font-medium cursor-pointer"
              >
                <option value="newest">Newest Issued</option>
                <option value="oldest">Oldest Issued</option>
                <option value="name">Alphabetical</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-[var(--border-color)]/50 text-xs">
            {/* Category Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
              <span className="text-[var(--text-muted)] font-medium mr-1.5">Category:</span>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg border font-semibold transition-all cursor-pointer ${selectedCategory === cat ? 'bg-[var(--primary)] border-[var(--primary)]/10 text-white shadow-sm' : 'border-[var(--border-color)] bg-[var(--background)] text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:border-[var(--text-muted)]'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Org Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
              <span className="text-[var(--text-muted)] font-medium mr-1.5">Issuer:</span>
              {organizations.map(org => (
                <button
                  key={org}
                  onClick={() => setSelectedOrg(org)}
                  className={`px-3 py-1.5 rounded-lg border font-semibold transition-all cursor-pointer ${selectedOrg === org ? 'bg-[var(--primary)] border-[var(--primary)]/10 text-white shadow-sm' : 'border-[var(--border-color)] bg-[var(--background)] text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:border-[var(--text-muted)]'}`}
                >
                  {org === "All" ? "All Issuers" : org.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Certificate Cards Grid */}
        {displayedCertificates.length === 0 ? (
          <SlideUp>
            <div className="bg-[var(--card)] border border-[var(--border-color)]/70 p-12 rounded-3xl text-center space-y-4 max-w-md mx-auto shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6 text-[var(--primary)]" />
              </div>
              <h3 className="font-bold text-lg text-[var(--text-main)]">No certificates found</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                We couldn't find any certificates matching your criteria. Try adjusting your filters or search keywords.
              </p>
              <div className="pt-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => { setSearch(""); setSelectedCategory("All"); setSelectedOrg("All"); }}
                  className="rounded-xl px-5 text-xs font-semibold cursor-pointer"
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </SlideUp>
        ) : (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {displayedCertificates.map((cert) => (
              <SlideUp key={cert.id}>
                <div className="group bg-[var(--card)] border border-[var(--border-color)]/70 rounded-2xl overflow-hidden hover:shadow-md hover:border-[var(--primary)]/20 transition-all duration-300 flex flex-col h-full">
                  
                  {/* Thumbnail / Aspect Card */}
                  <div className="aspect-video relative overflow-hidden bg-[var(--secondary-bg)] border-b border-[var(--border-color)]/60">
                    {cert.image && (
                      <SafeImage 
                        src={cert.image} 
                        alt={cert.title} 
                        fill 
                        className="object-cover group-hover:scale-[1.01] transition-transform duration-500" 
                      />
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--primary)] bg-[var(--card)]/90 backdrop-blur-md border border-[var(--border-color)]/40 px-2.5 py-1 rounded-full">
                        {cert.skills[0] || "General"}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex flex-col justify-between flex-1 space-y-6">
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                          {cert.issuer}
                        </span>
                        <h3 className="font-bold text-lg font-heading text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors leading-snug">
                          {cert.title}
                        </h3>
                      </div>
                      
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {cert.skills.map((skill) => (
                          <span key={skill} className="px-2 py-0.5 text-[9px] font-semibold bg-[var(--secondary-bg)] border border-[var(--border-color)]/75 text-[var(--text-secondary)] rounded-md">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-4 border-t border-[var(--border-color)]/50 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5">
                        {cert.url && (
                          <Button variant="outline" size="sm" className="h-8 rounded-lg text-[10px] font-bold px-3 border-[var(--border-color)] cursor-pointer flex items-center gap-1" asChild>
                            <Link href={cert.url} target="_blank" rel="noreferrer">
                              Verify <ExternalLink className="w-3 h-3" />
                            </Link>
                          </Button>
                        )}
                        {cert.pdfUrl && (
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-main)] cursor-pointer" asChild>
                            <Link href={cert.pdfUrl} target="_blank">
                              <Download className="w-3.5 h-3.5" />
                            </Link>
                          </Button>
                        )}
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleShare(cert)}
                        className="h-8 rounded-lg text-[10px] font-bold px-3 text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/5 cursor-pointer flex items-center gap-1"
                      >
                        <Share2 className="w-3.5 h-3.5" /> Share
                      </Button>
                    </div>
                  </div>

                </div>
              </SlideUp>
            ))}
          </StaggerContainer>
        )}

        {/* Load More Pagination */}
        {filteredCertificates.length > visibleCount && (
          <SlideUp>
            <div className="flex justify-center pt-8">
              <Button 
                onClick={() => setVisibleCount(prev => prev + 4)}
                variant="outline" 
                className="h-11 px-8 rounded-xl text-sm font-semibold border-[var(--border-color)] hover:bg-[var(--secondary-bg)] cursor-pointer"
              >
                Load More Certificates
              </Button>
            </div>
          </SlideUp>
        )}

      </div>
    </div>
  );
}
