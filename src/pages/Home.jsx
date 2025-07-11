import React from 'react';
import { motion } from 'framer-motion';
import { useBlog } from '../context/BlogContext';
import BlogCard from '../components/BlogCard';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiStar, FiTrendingUp } = FiIcons;

const Home = () => {
  const { posts, loading, getFeaturedPosts } = useBlog();
  const featuredPosts = getFeaturedPosts();

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
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
          Welcome to <span className="text-primary-600">ModernBlog</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover amazing stories, insights, and ideas from our community of passionate writers.
        </p>
      </motion.section>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Featured Posts */}
          <section className="mb-12">
            <div className="flex items-center space-x-2 mb-6">
              <SafeIcon icon={FiStar} className="h-6 w-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">Featured Posts</h2>
            </div>
            
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {featuredPosts.map((post, index) => (
                <BlogCard 
                  key={post.id} 
                  post={post} 
                  featured={index === 0}
                />
              ))}
            </motion.div>
          </section>

          {/* All Posts */}
          <section>
            <div className="flex items-center space-x-2 mb-6">
              <SafeIcon icon={FiTrendingUp} className="h-6 w-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">Latest Posts</h2>
            </div>
            
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {posts.slice(3).map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </motion.div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Sidebar />
        </div>
      </div>
    </div>
  );
};

export default Home;