/**
 * SEO & Head Metadata Manager Engine
 * Implements PRD Section 32 (SEO Requirements)
 */

export interface PageMetadata {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
}

const DEFAULT_META: PageMetadata = {
  title: "Arabiyyah — Kursus Bahasa Arab Terstruktur Berbasis Video",
  description: "Pelajari Bahasa Arab step by step dari nol sampai mahir memahami Nahwu, Shorof, Al-Qur'an, dan Kitab Gundul secara terstruktur dan terukur.",
  keywords: [
    "belajar bahasa arab",
    "kursus bahasa arab online",
    "belajar nahwu shorof",
    "baca kitab gundul",
    "bahasa arab al-quran",
    "kursus nahwu online"
  ],
  ogImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1200",
  ogType: "website"
};

/**
 * Updates document <title> and essential <meta> elements dynamically.
 */
export const updateSEOHead = (customMeta?: Partial<PageMetadata>) => {
  const meta = { ...DEFAULT_META, ...customMeta };

  // 1. Update Title
  document.title = meta.title;

  // 2. Update Meta Description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute('content', meta.description);

  // 3. Update Meta Keywords
  if (meta.keywords && meta.keywords.length > 0) {
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', meta.keywords.join(', '));
  }

  // 4. Update OpenGraph Tags
  updateMetaProperty('og:title', meta.title);
  updateMetaProperty('og:description', meta.description);
  updateMetaProperty('og:type', meta.ogType || 'website');
  if (meta.ogImage) {
    updateMetaProperty('og:image', meta.ogImage);
  }
};

const updateMetaProperty = (property: string, content: string) => {
  let tag = document.querySelector(`meta[property="${property}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('property', property);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
};
