import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const SITE_URL = 'https://itai-web-project.vercel.app';

const staticPages = [
  { url: '/',             priority: 1.0, changefreq: 'daily' },
  { url: '/therapists',  priority: 0.9, changefreq: 'daily' },
  { url: '/articles',    priority: 0.8, changefreq: 'weekly' },
  { url: '/quiz',        priority: 0.8, changefreq: 'monthly' },
  { url: '/how-it-works',priority: 0.7, changefreq: 'monthly' },
  { url: '/faq',         priority: 0.6, changefreq: 'monthly' },
  { url: '/contact',     priority: 0.6, changefreq: 'monthly' },
];

const citiesForSEO = [
  'tel-aviv', 'jerusalem', 'haifa', 'rishon-lezion', 'petah-tikva',
  'ashdod', 'netanya', 'beer-sheva', 'holon', 'bnei-brak',
  'ramat-gan', 'rehovot', 'bat-yam', 'ashkelon', 'kfar-saba',
  'herzliya', 'hadera', 'modiin', 'raanana', 'hod-hasharon'
];

const professionsForSEO = [
  'psychologist', 'psychiatrist', 'psychotherapist', 'social-worker', 'counselor'
];

async function generateSitemap() {
  console.log('Generating sitemap...');

  try {
    // Fetch only approved therapists with slugs
    const { data: therapists } = await supabase
      .from('Therapist')
      .select('slug')
      .eq('status', 'approved')
      .not('slug', 'is', null);

    // Fetch only published articles
    const { data: articles } = await supabase
      .from('Article')
      .select('id, slug')
      .eq('status', 'published');

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Static pages
    staticPages.forEach(page => {
      sitemap += `  <url>\n    <loc>${SITE_URL}${page.url}</loc>\n    <changefreq>${page.changefreq}</changefreq>\n    <priority>${page.priority}</priority>\n  </url>\n`;
    });

    // City-only pages: /therapists/tel-aviv
    citiesForSEO.forEach(city => {
      sitemap += `  <url>\n    <loc>${SITE_URL}/therapists/${city}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    });

    // Profession-only pages: /therapists/psychologist
    professionsForSEO.forEach(prof => {
      sitemap += `  <url>\n    <loc>${SITE_URL}/therapists/${prof}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    });

    // Profession + city combinations: /therapists/psychologist/tel-aviv
    // 5 professions × 20 cities = 100 targeted SEO landing pages
    professionsForSEO.forEach(prof => {
      citiesForSEO.forEach(city => {
        sitemap += `  <url>\n    <loc>${SITE_URL}/therapists/${prof}/${city}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.85</priority>\n  </url>\n`;
      });
    });

    // Individual therapist profiles
    if (therapists) {
      therapists.forEach(therapist => {
        if (!therapist.slug) return;
        sitemap += `  <url>\n    <loc>${SITE_URL}/therapist/${therapist.slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
      });
    }

    // Articles — use slug if available, fallback to id
    if (articles) {
      articles.forEach(article => {
        const path = article.slug ? `/articles/${article.slug}` : `/articles/${article.id}`;
        sitemap += `  <url>\n    <loc>${SITE_URL}${path}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
      });
    }

    sitemap += `</urlset>`;

    const totalUrls = staticPages.length
      + citiesForSEO.length
      + professionsForSEO.length
      + (professionsForSEO.length * citiesForSEO.length)
      + (therapists?.length || 0)
      + (articles?.length || 0);

    fs.writeFileSync('./public/sitemap.xml', sitemap);
    console.log(`✅ Sitemap successfully generated with ${totalUrls} URLs!`);
  } catch (error) {
    console.error('❌ Error generating sitemap:', error.message);
  }
}

generateSitemap();