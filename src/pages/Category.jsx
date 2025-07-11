import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBlog } from '../context/BlogContext';
import BlogCard from '../components/BlogCard';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiTag } = FiIcons;

const Category = () => {
  const { category } = useParams();
  const { getPostsByCategory, loading } = useBlog();
  const posts = getPostsByCategory(category);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Category Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center space-x-3 mb-4">
              <SafeIcon icon={FiTag} className="h-8 w-8 text-primary-600" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 capitalize">
                {category}
              </h1>
            </div>
            <p className="text-lg text-gray-600">
              Explore our latest articles in {category}
            </p>
            <div className="text-sm text-gray-500 mt-2">
              {posts.length} {posts.length === 1 ? 'post' : 'posts'} found
            </div>
          </motion.div>

          {/* Posts Grid */}
          {posts.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <SafeIcon icon={FiTag} className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No posts found</h2>
              <p className="text-gray-600">
                We haven't published any posts in this category yet. Check back soon!
              </p>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Sidebar />
        </div>
      </div>
    </div>
  );
};

export default Category;