const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['IVF Treatments', 'IVF Fertility', 'IVF Guide', 'IVF Surgery', 'IVF Lifestyle', 'Pregnancy', 'Women Health', 'Men Fertility', 'Lifestyle'],
    default: 'IVF Treatments'
  },
  author: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true
  },
  authorBio: {
    type: String,
    trim: true,
    maxlength: [500, 'Author bio cannot exceed 500 characters']
  },
  tags: [{
    type: String,
    trim: true
  }],
  image: {
    type: String,
    required: [true, 'Featured image is required']
  },
  readTime: {
    type: String,
    default: '5 min read'
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  publishedDate: {
    type: Date
  },
  views: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for search
blogSchema.index({ title: 'text', description: 'text', content: 'text', tags: 'text' });

// Pre-save middleware to generate slug
blogSchema.pre('save', function(next) {
  try {
    if (this.isModified('title')) {
      this.slug = this.title
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    }
    
    if (this.status === 'published' && !this.publishedDate) {
      this.publishedDate = new Date();
    }
    
    if (typeof next === 'function') {
      next();
    }
  } catch (error) {
    if (typeof next === 'function') {
      next(error);
    } else {
      throw error;
    }
  }
});

module.exports = mongoose.model('Blog', blogSchema);