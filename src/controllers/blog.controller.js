const Blog = require('../models/blog');

/**
 * @desc Create new blog post
 * @route POST /api/admin/blogs
 */
exports.createBlog = async (req, res) => {
  try {
    const {
      title,
      description,
      content,
      category,
      author,
      authorBio,
      tags,
      image,
      readTime,
      status
    } = req.body;

    // Validate required fields
    if (!title || !description || !content || !author || !image) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, description, content, author, image'
      });
    }

    // Generate unique slug
    let slug = title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // Check if slug exists and append timestamp if needed
    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      slug = `${slug}-${Date.now()}`;
    }

    const blog = await Blog.create({
      title,
      slug,
      description,
      content,
      category,
      author,
      authorBio,
      tags: tags || [],
      image,
      readTime: readTime || '5 min read',
      status: status || 'draft',
      createdBy: req.user ? req.user._id : null
    });

    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      data: blog
    });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create blog post',
      error: error.message
    });
  }
};

/**
 * @desc Get all blogs (with filters for admin)
 * @route GET /api/admin/blogs
 */
exports.getAllBlogs = async (req, res) => {
  try {
    const {
      status,
      category,
      search,
      page = 1,
      limit = 10
    } = req.query;

    let query = {};

    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }

    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }

    // Search by text
    if (search) {
      query.$text = { $search: search };
    }

    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Blog.countDocuments(query);

    res.status(200).json({
      success: true,
      count: blogs.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: blogs
    });
  } catch (error) {
    console.error('Get all blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blogs',
      error: error.message
    });
  }
};

/**
 * @desc Get single blog by ID
 * @route GET /api/admin/blogs/:id
 */
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error('Get blog by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blog post',
      error: error.message
    });
  }
};

/**
 * @desc Update blog post
 * @route PUT /api/admin/blogs/:id
 */
exports.updateBlog = async (req, res) => {
  try {
    const {
      title,
      description,
      content,
      category,
      author,
      authorBio,
      tags,
      image,
      readTime,
      status
    } = req.body;

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Update fields
    if (title) blog.title = title;
    if (description) blog.description = description;
    if (content) blog.content = content;
    if (category) blog.category = category;
    if (author) blog.author = author;
    if (authorBio !== undefined) blog.authorBio = authorBio;
    if (tags) blog.tags = tags;
    if (image) blog.image = image;
    if (readTime) blog.readTime = readTime;
    if (status) blog.status = status;

    await blog.save();

    res.status(200).json({
      success: true,
      message: 'Blog post updated successfully',
      data: blog
    });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update blog post',
      error: error.message
    });
  }
};

/**
 * @desc Delete blog post
 * @route DELETE /api/admin/blogs/:id
 */
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete blog post',
      error: error.message
    });
  }
};

/**
 * @desc Toggle blog publish status
 * @route PUT /api/admin/blogs/:id/publish
 */
exports.togglePublishStatus = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    blog.status = blog.status === 'published' ? 'draft' : 'published';
    if (blog.status === 'published' && !blog.publishedDate) {
      blog.publishedDate = new Date();
    }

    await blog.save();

    res.status(200).json({
      success: true,
      message: `Blog post ${blog.status === 'published' ? 'published' : 'unpublished'} successfully`,
      data: blog
    });
  } catch (error) {
    console.error('Toggle publish status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update publish status',
      error: error.message
    });
  }
};

/**
 * @desc Get blog stats for dashboard
 * @route GET /api/admin/blogs/stats
 */
exports.getBlogStats = async (req, res) => {
  try {
    const totalBlogs = await Blog.countDocuments();
    const publishedBlogs = await Blog.countDocuments({ status: 'published' });
    const draftBlogs = await Blog.countDocuments({ status: 'draft' });

    // Get blogs by category
    const blogsByCategory = await Blog.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get recent blogs
    const recentBlogs = await Blog.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title status category createdAt views');

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalBlogs,
          publishedBlogs,
          draftBlogs
        },
        blogsByCategory,
        recentBlogs
      }
    });
  } catch (error) {
    console.error('Get blog stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blog stats',
      error: error.message
    });
  }
};

// Public Routes

/**
 * @desc Get published blogs (public)
 * @route GET /api/blogs
 */
exports.getPublishedBlogs = async (req, res) => {
  try {
    const {
      category,
      search,
      page = 1,
      limit = 9
    } = req.query;

    let query = { status: 'published' };

    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }

    // Search by text
    if (search) {
      query.$text = { $search: search };
    }

    const blogs = await Blog.find(query)
      .sort({ publishedDate: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select('-createdBy -__v');

    const total = await Blog.countDocuments(query);

    res.status(200).json({
      success: true,
      count: blogs.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: blogs
    });
  } catch (error) {
    console.error('Get published blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blogs',
      error: error.message
    });
  }
};

/**
 * @desc Get blog by slug (public)
 * @route GET /api/blogs/:slug
 */
exports.getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({
      slug: req.params.slug,
      status: 'published'
    }).select('-createdBy -__v');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Increment view count
    blog.views += 1;
    await blog.save();

    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error('Get blog by slug error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blog post',
      error: error.message
    });
  }
};