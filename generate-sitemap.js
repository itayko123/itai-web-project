import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const SITE_URL = 'https://itai-web-project.vercel.app'; 

const staticPages = [
  { url: '/', priority: 1.0, changefreq: 'daily' },
  { url: '/therapists', priority: 0.9, changefreq: 'daily' },
  { url: '/articles', priority: 0.8, changefreq: 'weekly' },
  { url: '/quiz', priority: 0.8, changefreq: 'monthly' },
  { url: '/how-it-works', priority: 0.7, changefreq: 'monthly' },
  { url: '/faq', priority: 0.6, changefreq: 'monthly' },
  { url: '/contact', priority: 0.6, changefreq: 'monthly' },
];

// הנה הערים שאנחנו רוצים לקדם בגוגל
const citiesForSEO = [
  'tel-aviv', 'jerusalem', 'haifa', 'rishon-lezion', 'petah-tikva', 
  'ashdod', 'netanya', 'beer-sheva', 'holon', 'bnei-brak', 
  'ramat-gan', 'rehovot', 'bat-yam', 'ashkelon', 'kfar-saba', 
  'herzliya', 'hadera', 'modiin', 'raanana', 'hod-hasharon'
];

function generateSlug(text) {
  if (!text) return '';
  return text.trim().replace(/\s+/g, '-').replace(/[^a-zA-Zא-ת0-9-]/g, ''); 
}

async function generateSitemap() {
  console.log('Generating sitemap...');

  try {
    const { data: therapists } = await supabase.from('Therapist').select('id, full_name');
    const { data: articles } = await supabase.from('Article').select('id, title');

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // עמודים סטטיים
    staticPages.forEach((page) => {
      sitemap += `  <url>\n    <loc>${SITE_URL}${page.url}</loc>\n    <changefreq>${page.changefreq}</changefreq>\n    <priority>${page.priority}</priority>\n  </url>\n`;
    });

    // דפי ערים (SEO פרוגרמטי!)
    citiesForSEO.forEach((citySlug) => {
      sitemap += `  <url>\n    <loc>${SITE_URL}/therapists/${citySlug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    });

    // מטפלים
    if (therapists) {
      therapists.forEach((therapist) => {
        const slug = generateSlug(therapist.full_name);
        sitemap += `  <url>\n    <loc>${SITE_URL}/therapist/${therapist.id}/${slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
      });
    }

    // מאמרים
    if (articles) {
      articles.forEach((article) => {
        const slug = generateSlug(article.title);
        sitemap += `  <url>\n    <loc>${SITE_URL}/articles/${article.id}/${slug}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
      });
    }

    sitemap += `</urlset>`;
    fs.writeFileSync('./public/sitemap.xml', sitemap);
    console.log(`✅ Sitemap successfully generated!`);
  } catch (error) {
    console.error('❌ Error generating sitemap:', error.message);
  }
}

generateSitemap();