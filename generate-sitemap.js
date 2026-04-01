import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// הדומיין החדש שלנו!
const SITE_URL = 'https://itai-web-project.vercel.app'; 

const staticPages = [
  { url: '/', priority: 1.0, changefreq: 'daily' },
  { url: '/therapists', priority: 0.9, changefreq: 'daily' },
  { url: '/articles', priority: 0.8, changefreq: 'weekly' },
  { url: '/quiz', priority: 0.8, changefreq: 'monthly' },
  { url: '/how-it-works', priority: 0.7, changefreq: 'monthly' },
  { url: '/faq', priority: 0.6, changefreq: 'monthly' },
  { url: '/contact', priority: 0.6, changefreq: 'monthly' },
  { url: '/accessibility', priority: 0.3, changefreq: 'yearly' },
  { url: '/privacy', priority: 0.3, changefreq: 'yearly' },
  { url: '/terms', priority: 0.3, changefreq: 'yearly' },
  { url: '/cookies', priority: 0.3, changefreq: 'yearly' },
];

function generateSlug(text) {
  if (!text) return '';
  return text
    .trim()
    .replace(/\s+/g, '-') 
    .replace(/[^a-zA-Zא-ת0-9-]/g, ''); 
}

async function generateSitemap() {
  console.log('Generating sitemap...');

  try {
    const { data: therapists, error: therapistsError } = await supabase
      .from('Therapist')
      .select('id, full_name');
    
    if (therapistsError) throw therapistsError;

    const { data: articles, error: articlesError } = await supabase
      .from('Article')
      .select('id, title');

    if (articlesError) throw articlesError;

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // 1. עמודים סטטיים
    staticPages.forEach((page) => {
      sitemap += `  <url>\n`;
      sitemap += `    <loc>${SITE_URL}${page.url}</loc>\n`;
      sitemap += `    <changefreq>${page.changefreq}</changefreq>\n`;
      sitemap += `    <priority>${page.priority}</priority>\n`;
      sitemap += `  </url>\n`;
    });

    // 2. מטפלים (דינמי)
    if (therapists) {
      therapists.forEach((therapist) => {
        const slug = generateSlug(therapist.full_name);
        sitemap += `  <url>\n`;
        sitemap += `    <loc>${SITE_URL}/therapist/${therapist.id}/${slug}</loc>\n`;
        sitemap += `    <changefreq>weekly</changefreq>\n`;
        sitemap += `    <priority>0.8</priority>\n`;
        sitemap += `  </url>\n`;
      });
    }

    // 3. מאמרים (דינמי)
    if (articles) {
      articles.forEach((article) => {
        const slug = generateSlug(article.title);
        sitemap += `  <url>\n`;
        sitemap += `    <loc>${SITE_URL}/articles/${article.id}/${slug}</loc>\n`;
        sitemap += `    <changefreq>monthly</changefreq>\n`;
        sitemap += `    <priority>0.7</priority>\n`;
        sitemap += `  </url>\n`;
      });
    }

    sitemap += `</urlset>`;

    fs.writeFileSync('./public/sitemap.xml', sitemap);
    console.log(`✅ Sitemap successfully generated with ${staticPages.length + therapists.length + articles.length} URLs!`);
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error.message);
  }
}

generateSitemap();