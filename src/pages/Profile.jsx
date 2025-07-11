import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useBlog } from '../context/BlogContext';
import BlogCard from '../components/BlogCard';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiUser, FiMail, FiMapPin, FiGlobe, FiTwitter, FiCalendar, FiEdit3, FiSave, FiX } = FiIcons;

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user, posts, getUserProfile, updateProfile } = useBlog();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    display_name: '',
    bio: '',
    avatar_url: '',
    website: '',
    location: '',
    twitter_handle: ''
  });

  const isOwnProfile = user && (userId === user.id || !userId);

  useEffect(() => {
    loadProfile();
  }, [userId, user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      let profileData;
      
      if (!userId && user) {
        // Load current user's profile
        profileData = await getUserProfile(user.id);
      } else if (userId) {
        // Load specific user's profile
        profileData = await getUserProfile(userId);
      }
      
      if (profileData) {
        setProfile(profileData);
        setEditForm({
          display_name: profileData.display_name || '',
          bio: profileData.bio || '',
          avatar_url: profileData.avatar_url || '',
          website: profileData.website || '',
          location: profileData.location || '',
          twitter_handle: profileData.twitter_handle || ''
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile(editForm);
      await loadProfile();
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    }
  };

  // Get user's posts
  const userPosts = posts.filter(post => 
    profile && (post.author === profile.email || post.author_id === profile.id)
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!profile && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile not found</h1>
          <button
            onClick={() => navigate('/')}
            className="text-primary-600 hover:text-primary-700"
          >
            Return to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden mb-8"
      >
        {/* Cover Image */}
        <div className="h-32 bg-gradient-to-r from-primary-600 to-primary-700"></div>
        
        <div className="relative px-6 pb-6">
          {/* Avatar */}
          <div className="flex items-start space-x-6 -mt-16">
            <div className="relative">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.display_name || profile.email}
                  className="w-32 h-32 rounded-full border-4 border-white object-cover"
                />
              ) : (
                <div className="w-32 h-32 bg-gray-300 rounded-full border-4 border-white flex items-center justify-center">
                  <SafeIcon icon={FiUser} className="w-12 h-12 text-gray-600" />
                </div>
              )}
            </div>
            
            <div className="flex-1 pt-20">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {profile?.display_name || profile?.email || 'Anonymous User'}
                  </h1>
                  {profile?.bio && (
                    <p className="text-gray-600 mt-2 max-w-2xl">{profile.bio}</p>
                  )}
                  
                  {/* Profile Info */}
                  <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
                    {profile?.email && (
                      <div className="flex items-center space-x-1">
                        <SafeIcon icon={FiMail} className="h-4 w-4" />
                        <span>{profile.email}</span>
                      </div>
                    )}
                    {profile?.location && (
                      <div className="flex items-center space-x-1">
                        <SafeIcon icon={FiMapPin} className="h-4 w-4" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                    {profile?.website && (
                      <div className="flex items-center space-x-1">
                        <SafeIcon icon={FiGlobe} className="h-4 w-4" />
                        <a
                          href={profile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700"
                        >
                          Website
                        </a>
                      </div>
                    )}
                    {profile?.twitter_handle && (
                      <div className="flex items-center space-x-1">
                        <SafeIcon icon={FiTwitter} className="h-4 w-4" />
                        <a
                          href={`https://twitter.com/${profile.twitter_handle}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700"
                        >
                          @{profile.twitter_handle}
                        </a>
                      </div>
                    )}
                    {profile?.created_at && (
                      <div className="flex items-center space-x-1">
                        <SafeIcon icon={FiCalendar} className="h-4 w-4" />
                        <span>Joined {format(new Date(profile.created_at), 'MMMM yyyy')}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {isOwnProfile && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <SafeIcon icon={FiEdit3} className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-lg text-center"
        >
          <div className="text-3xl font-bold text-primary-600">{userPosts.length}</div>
          <div className="text-gray-600">Posts Published</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-lg text-center"
        >
          <div className="text-3xl font-bold text-primary-600">
            {userPosts.reduce((total, post) => total + post.readTime, 0)}
          </div>
          <div className="text-gray-600">Minutes of Content</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-lg text-center"
        >
          <div className="text-3xl font-bold text-primary-600">
            {userPosts.filter(post => post.featured).length}
          </div>
          <div className="text-gray-600">Featured Posts</div>
        </motion.div>
      </div>

      {/* User's Posts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {isOwnProfile ? 'Your Posts' : `Posts by ${profile?.display_name || profile?.email}`}
        </h2>
        
        {userPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <SafeIcon icon={FiEdit3} className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {isOwnProfile ? 'No posts yet' : 'No posts published'}
            </h3>
            <p className="text-gray-600">
              {isOwnProfile 
                ? 'Start writing your first blog post!' 
                : 'This user hasn\'t published any posts yet.'}
            </p>
          </div>
        )}
      </motion.div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <SafeIcon icon={FiX} className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={editForm.display_name}
                    onChange={(e) => setEditForm({ ...editForm, display_name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Your display name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Avatar URL
                  </label>
                  <input
                    type="url"
                    value={editForm.avatar_url}
                    onChange={(e) => setEditForm({ ...editForm, avatar_url: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      value={editForm.website}
                      onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Your location"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Twitter Handle
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">@</span>
                    <input
                      type="text"
                      value={editForm.twitter_handle}
                      onChange={(e) => setEditForm({ ...editForm, twitter_handle: e.target.value })}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="username"
                    />
                  </div>
                </div>
              </form>
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <SafeIcon icon={FiSave} className="h-4 w-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Profile;