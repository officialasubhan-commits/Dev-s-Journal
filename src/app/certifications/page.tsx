"use client";

import { useState, useMemo } from "react";
import { mockCertificates, Certificate } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { SlideUp, StaggerContainer } from "@/components/ui/animations";
import { SafeImage } from "@/components/ui/SafeImage";
import { Search, SlidersHorizontal, Award, ExternalLink, Download, Share2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function CertificationsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedOrg, setSelectedOrg] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [visibleCount, setVisibleCount] = useState(6);

  // Extract unique categories and organizations for filtering
  const categories = useMemo(() => {
    const list = mockCertificates.map(c => c.category);
    return ["All", ...Array.from(new Set(list))];
  }, []);

  const organizations = useMemo(() => {
    const list = mockCertificates.map(c => c.organization);
    return ["All", ...Array.from(new Set(list))];
  }, []);

  // Filter and sort certificates
  const filteredCertificates = useMemo(() => {
    let result = [...mockCertificates];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(c => 
        c.title.toLowerCase().includes(q) || 
        c.organization.toLowerCase().includes(q) ||
        c.skillsGained.some(s => s.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter(c => c.category === selectedCategory);
    }

    if (selectedOrg !== "All") {
      result = result.filter(c => c.organization === selectedOrg);
    }

    // Sorting
    result.sort((a, b) => {
      const dateA = new Date(a.issueDate).getTime();
      const dateB = new Date(b.issueDate).getTime();
      if (sortBy === "newest") return dateB - dateA;
      if (sortBy === "oldest") return dateA - dateB;
      return a.title.localeCompare(b.title);
    });

    return result;
  }, [search, selectedCategory, selectedOrg, sortBy]);

  const displayedCertificates = filteredCertificates.slice(0, visibleCount);

  const handleShare = (cert: Certificate) => {
    if (navigator.share) {
      navigator.share({
        title: cert.title,
        text: `Check out my certification: ${cert.title} from ${cert.organization}`,
        url: window.location.href,
      }).catch(err => console.log(err));
    } else {
      navigator.clipboard.writeText(`${cert.title} - ${cert.organization} Verification: ${cert.verificationUrl}`);
      alert("Certificate link copied to clipboard!");
    }
  };

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
                <AlertCircle className="w-6 h-6 text-[var(--primary)]" />
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
                    <SafeImage 
                      src={cert.imageUrl} 
                      alt={cert.title} 
                      fill 
                      className="object-cover group-hover:scale-[1.01] transition-transform duration-500" 
                    />
                    <div className="absolute top-4 left-4">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--primary)] bg-[var(--card)]/90 backdrop-blur-md border border-[var(--border-color)]/40 px-2.5 py-1 rounded-full">
                        {cert.category}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex flex-col justify-between flex-1 space-y-6">
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                          {cert.organization}
                        </span>
                        <h3 className="font-bold text-lg font-heading text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors leading-snug">
                          {cert.title}
                        </h3>
                      </div>
                      
                      {cert.credentialId && (
                        <p className="text-xs text-[var(--text-secondary)] font-mono">
                          ID: <span className="text-[var(--text-main)] font-semibold">{cert.credentialId}</span>
                        </p>
                      )}

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {cert.skillsGained.map((skill) => (
                          <span key={skill} className="px-2 py-0.5 text-[9px] font-semibold bg-[var(--secondary-bg)] border border-[var(--border-color)]/75 text-[var(--text-secondary)] rounded-md">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-4 border-t border-[var(--border-color)]/50 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5">
                        <Button variant="outline" size="sm" className="h-8 rounded-lg text-[10px] font-bold px-3 border-[var(--border-color)] cursor-pointer flex items-center gap-1" asChild>
                          <Link href={cert.verificationUrl} target="_blank" rel="noreferrer">
                            Verify <ExternalLink className="w-3 h-3" />
                          </Link>
                        </Button>
                        {cert.downloadUrl && (
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-main)] cursor-pointer" asChild>
                            <Link href={cert.downloadUrl}>
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
