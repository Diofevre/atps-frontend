'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Clock, Calendar, Share2, ArrowLeft, Tag } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  category: 'training' | 'safety' | 'tips' | 'case-studies' | 'industry';
  tags: string[];
  readingTime: number;
  publishedAt: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  content: {
    sections: Array<{
      id: string;
      heading: string;
      content: string;
      image?: string;
    }>;
  };
}

// Mock data - In production, this would come from an API
const mockPost: BlogPost = {
  id: '1',
  title: 'Essential Pre-Flight Checks Every Pilot Should Know',
  slug: 'essential-pre-flight-checks-every-pilot-should-know',
  excerpt: 'Learn the critical pre-flight inspection procedures that ensure safety before every flight.',
  featuredImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200',
  category: 'safety',
  tags: ['pre-flight', 'safety', 'checklist', 'aviation'],
  readingTime: 8,
  publishedAt: '2024-01-15',
  author: {
    name: 'Captain Sarah Johnson',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson',
    bio: 'Commercial pilot with 15+ years of experience. ATPL certified instructor.',
  },
  content: {
    sections: [
      {
        id: 'intro',
        heading: 'Introduction',
        content: 'Pre-flight inspections are not just routine procedures—they are the foundation of aviation safety. Every pilot, regardless of experience level, must understand and perform comprehensive pre-flight checks before taking to the skies.',
      },
      {
        id: 'exterior',
        heading: 'Exterior Inspection',
        content: 'Begin your pre-flight check with a thorough walk-around inspection. Examine the aircraft\'s exterior for any visible damage, loose components, or leaks. Check the landing gear, tires, and control surfaces for proper operation.',
        image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800',
      },
      {
        id: 'interior',
        heading: 'Interior Checks',
        content: 'Inside the cockpit, verify that all required documents are on board. Check fuel quantities, oil levels, and confirm that all switches are in the correct position. Ensure emergency equipment is present and functional.',
      },
      {
        id: 'systems',
        heading: 'System Tests',
        content: 'Conduct essential systems tests including radio checks, avionics functionality, and flight control movements. Verify that instruments are providing accurate readings and that navigation equipment is operational.',
      },
      {
        id: 'weather',
        heading: 'Weather Briefing',
        content: 'Obtain a current weather briefing and understand how conditions will affect your flight. Review NOTAMs (Notices to Airmen) and check for any airspace restrictions or temporary flight restrictions along your route.',
      },
      {
        id: 'planning',
        heading: 'Flight Planning',
        content: 'Double-check your flight plan, including alternate airports and fuel reserves. Calculate weight and balance, and ensure you have adequate fuel for your intended flight plus reserves as required by regulations.',
      },
    ],
  },
};

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    // In production, fetch from API based on slug
    setPost(mockPost);
  }, [params.slug]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = post?.content.sections || [];
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100) {
            setActiveSection(section.id);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [post]);

  const handleShare = () => {
    if (navigator.share && post) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    }
  };

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-text-secondary">Loading article...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-card-foreground hover:text-atps-yellow font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Blog
        </Link>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 mb-12">
        <div className="max-w-4xl mx-auto">
          {/* Category and Tags */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-sm font-medium capitalize">
              {post.category.replace('-', ' ')}
            </span>
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 bg-muted text-card-foreground rounded-full text-sm"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-text-secondary mb-8 pb-8 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-atps-yellow to-yellow-600 flex items-center justify-center text-gray-900 font-bold">
                {post.author.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-foreground">{post.author.name}</p>
                <p className="text-sm text-text-secondary">{post.author.bio}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{post.readingTime} min read</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="container mx-auto px-4 mb-12">
        <div className="max-w-5xl mx-auto">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-96 object-cover rounded-2xl shadow-xl"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Table of Contents */}
            <aside className="lg:col-span-1 order-2 lg:order-1">
              <div className="sticky top-8">
                <div className="bg-card rounded-xl shadow-md p-6 border border-border">
                  <h3 className="font-bold text-foreground mb-4 text-lg">Table of Contents</h3>
                  <nav className="space-y-2">
                    {post.content.sections.map((section) => (
                      <a
                        key={section.id}
                        href={`#${section.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          const element = document.getElementById(section.id);
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        }}
                        className={`block px-3 py-2 rounded-lg text-sm transition-all ${
                          activeSection === section.id
                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-foreground font-medium'
                            : 'text-text-secondary hover:bg-muted'
                        }`}
                      >
                        {section.heading}
                      </a>
                    ))}
                  </nav>
                  <button
                    onClick={handleShare}
                    className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2 bg-atps-yellow text-gray-900 rounded-lg hover:bg-yellow-600 hover:text-white transition-colors font-medium"
                  >
                    <Share2 className="w-4 h-4" />
                    Share Article
                  </button>
                </div>
              </div>
            </aside>

            {/* Article Content */}
            <article className="lg:col-span-3 order-1 lg:order-2">
              <div className="bg-card rounded-2xl shadow-md p-8 md:p-12 border border-border">
                {/* Excerpt */}
                <p className="text-xl text-text-secondary mb-12 leading-relaxed border-l-4 border-atps-yellow pl-6">
                  {post.excerpt}
                </p>

                {/* Sections */}
                {post.content.sections.map((section, index) => (
                  <section key={section.id} id={section.id} className="mb-16 scroll-mt-8">
                    <h2 className="text-3xl font-bold text-foreground mb-6">
                      {index + 1}. {section.heading}
                    </h2>
                    {section.image && (
                      <div className="mb-6 rounded-xl overflow-hidden shadow-lg">
                        <img
                          src={section.image}
                          alt={section.heading}
                          className="w-full h-64 object-cover"
                        />
                      </div>
                    )}
                    <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-text-secondary">
                      <p className="text-text-secondary leading-relaxed whitespace-pre-line">
                        {section.content}
                      </p>
                    </div>
                  </section>
                ))}

                {/* Conclusion */}
                <div className="mt-16 p-8 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
                  <h3 className="text-2xl font-bold text-foreground mb-4">Key Takeaways</h3>
                  <ul className="space-y-3 text-text-secondary">
                    <li className="flex items-start gap-3">
                      <span className="text-atps-yellow font-bold text-xl">✓</span>
                      <span>Always perform a thorough walk-around inspection</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-atps-yellow font-bold text-xl">✓</span>
                      <span>Check all systems and instruments before flight</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-atps-yellow font-bold text-xl">✓</span>
                      <span>Obtain current weather and NOTAM information</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-atps-yellow font-bold text-xl">✓</span>
                      <span>Verify flight planning including fuel and weight & balance</span>
                    </li>
                  </ul>
                </div>

                {/* Author Bio */}
                <div className="mt-16 p-8 bg-muted rounded-xl">
                  <h3 className="text-xl font-bold text-foreground mb-4">About the Author</h3>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-atps-yellow to-yellow-600 flex items-center justify-center text-gray-900 text-xl font-bold flex-shrink-0">
                      {post.author.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground mb-1">{post.author.name}</h4>
                      <p className="text-text-secondary">{post.author.bio}</p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
}
