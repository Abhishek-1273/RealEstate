import Blog from '../models/Blog.js';
import { cacheGet, cacheSet, cacheDelPattern, cacheDel } from '../utils/cache.js';

// GET /api/blogs
export const getAllBlogs = async (req, res) => {
  try {
    const { category, featured } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (featured !== undefined) filter.featured = featured === 'true';

    // Cache blog list for 5 min (key includes filters)
    const cacheKey = `blogs:list:${category || 'all'}:${featured ?? 'all'}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return res.status(200).json({ ...cached, cached: true });

    const blogs = await Blog.find(filter).sort({ createdAt: -1 });
    const result = { success: true, count: blogs.length, blogs };
    await cacheSet(cacheKey, result, 5 * 60); // 5 min
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/blogs/:slug
export const getBlogBySlug = async (req, res) => {
  try {
    // Cache individual blog for 10 min
    const cacheKey = `blogs:slug:${req.params.slug}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return res.status(200).json({ ...cached, cached: true });

    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    const result = { success: true, blog };
    await cacheSet(cacheKey, result, 10 * 60); // 10 min
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/blogs (Admin only)
export const createBlog = async (req, res) => {
  try {
    const { title, excerpt, content, category, readTime, image, author, featured } = req.body;
    
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const blog = new Blog({
      title,
      slug,
      excerpt,
      content,
      category,
      readTime,
      image,
      author,
      featured,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    });

    await blog.save();
    await cacheDelPattern('blogs:*'); // Invalidate all blog caches
    return res.status(201).json({ success: true, blog });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/blogs/:id (Admin only)
export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    return res.status(200).json({ success: true, blog });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/blogs/:id (Admin only)
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    await cacheDelPattern('blogs:*'); // Invalidate caches
    return res.status(200).json({ success: true, message: 'Article deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
