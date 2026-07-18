import express from 'express';
import Property from '../models/Property.js';
import Blog from '../models/Blog.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const host = process.env.CLIENT_URL || 'https://real-estate-mu-plum.vercel.app';
    
    // Static routes
    const staticRoutes = [
      '',
      '/properties',
      '/blog',
      '/about',
      '/contact',
      '/services',
      '/lease-property',
      '/buy-property',
      '/sell-property',
    ];

    // Fetch properties and blogs
    const [properties, blogs] = await Promise.all([
      Property.find({ isActive: true }).select('_id updatedAt'),
      Blog.find({}).select('slug updatedAt'),
    ]);

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // 1. Static URLs
    staticRoutes.forEach((route) => {
      xml += `  <url>\n`;
      xml += `    <loc>${host}${route}</loc>\n`;
      xml += `    <changefreq>daily</changefreq>\n`;
      xml += `    <priority>${route === '' ? '1.0' : '0.8'}</priority>\n`;
      xml += `  </url>\n`;
    });

    // 2. Dynamic Property URLs
    properties.forEach((p) => {
      xml += `  <url>\n`;
      xml += `    <loc>${host}/properties/${p._id}</loc>\n`;
      xml += `    <lastmod>${p.updatedAt.toISOString()}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += `  </url>\n`;
    });

    // 3. Dynamic Blog URLs
    blogs.forEach((b) => {
      xml += `  <url>\n`;
      xml += `    <loc>${host}/blog/${b.slug}</loc>\n`;
      xml += `    <lastmod>${b.updatedAt.toISOString()}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.6</priority>\n`;
      xml += `  </url>\n`;
    });

    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    console.error('Failed to generate sitemap.xml:', err);
    res.status(500).send('Internal server error');
  }
});

export default router;
