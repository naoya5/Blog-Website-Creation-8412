import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiClock, FiUser, FiArrowRight } = FiIcons;

const BlogCard = ({ post, featured = false }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const imageVariants = {
    hover: { scale: 1.05 }
  };

  return (
    <motion.article
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -5 }}
      className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
        featured ? 'col-span-1 md:col-span-2' : ''
      }`}
    >
      <div className={`${featured ? 'md:flex' : ''}`}>
        {/* Image */}
        <div className={`relative overflow-hidden ${featured ? 'md:w-1/2' : ''}`}>
          <motion.img
            variants={imageVariants}
            whileHover="hover"
            src={post.image}
            alt={post.title}
            className={`w-full object-cover transition-transform duration-300 ${
              featured ? 'h-64 md:h-full' : 'h-48'
            }`}
          />
          <div className="absolute top-4 left-4">
            <span className="inline-block bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-medium">
              {post.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className={`p-6 ${featured ? 'md:w-1/2 md:flex md:flex-col md:justify-center' : ''}`}>
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
            <div className="flex items-center space-x-1">
              <SafeIcon icon={FiUser} className="h-4 w-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <SafeIcon icon={FiClock} className="h-4 w-4" />
              <span>{post.readTime} min read</span>
            </div>
          </div>

          <h2 className={`font-bold text-gray-900 mb-3 line-clamp-2 ${
            featured ? 'text-2xl md:text-3xl' : 'text-xl'
          }`}>
            <Link 
              to={`/post/${post.id}`}
              className="hover:text-primary-600 transition-colors"
            >
              {post.title}
            </Link>
          </h2>

          <p className={`text-gray-600 mb-4 line-clamp-3 ${
            featured ? 'text-lg' : ''
          }`}>
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {format(new Date(post.date), 'MMM dd, yyyy')}
            </span>
            <Link
              to={`/post/${post.id}`}
              className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors"
            >
              <span>Read more</span>
              <SafeIcon icon={FiArrowRight} className="h-4 w-4" />
            </Link>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default BlogCard;