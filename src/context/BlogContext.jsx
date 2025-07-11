import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../lib/supabase';

const BlogContext = createContext();

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};

export const BlogProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    checkUser();
    fetchPosts();
    fetchCategories();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        await loadUserProfile(session.user.id);
      } else {
        setUserProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user || null);
    if (session?.user) {
      await loadUserProfile(session.user.id);
    }
  };

  const loadUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles_bx9k7m3p2q')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading user profile:', error);
        return;
      }

      setUserProfile(data);
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts_bx9k7m3p2q')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform data to match existing structure
      const transformedPosts = data.map(post => ({
        id: post.id,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        author: post.author,
        author_id: post.author_id,
        date: post.created_at,
        category: post.category,
        tags: post.tags || [],
        readTime: post.read_time,
        image: post.image_url || `https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop`,
        featured: post.featured,
        published: post.published
      }));

      setPosts(transformedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories_bx9k7m3p2q')
        .select('*')
        .order('name');

      if (error) throw error;

      // Get post counts for each category
      const categoriesWithCounts = await Promise.all(
        data.map(async (category) => {
          const { count } = await supabase
            .from('posts_bx9k7m3p2q')
            .select('*', { count: 'exact', head: true })
            .eq('category', category.name)
            .eq('published', true);

          return {
            name: category.name,
            count: count || 0,
            color: category.color
          };
        })
      );

      setCategories(categoriesWithCounts);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const createPost = async (postData) => {
    if (!user) throw new Error('Must be logged in to create posts');

    try {
      const { data, error } = await supabase
        .from('posts_bx9k7m3p2q')
        .insert([{
          title: postData.title,
          content: postData.content,
          excerpt: postData.excerpt,
          author: postData.author || user.email,
          author_id: user.id,
          category: postData.category,
          tags: postData.tags || [],
          image_url: postData.image_url,
          read_time: postData.read_time || 5,
          published: postData.published || false,
          featured: postData.featured || false
        }])
        .select()
        .single();

      if (error) throw error;

      // Refresh posts after creation
      await fetchPosts();
      await fetchCategories();

      return data;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  };

  const updatePost = async (id, postData) => {
    if (!user) throw new Error('Must be logged in to update posts');

    try {
      const { data, error } = await supabase
        .from('posts_bx9k7m3p2q')
        .update(postData)
        .eq('id', id)
        .eq('author_id', user.id)
        .select()
        .single();

      if (error) throw error;

      // Refresh posts after update
      await fetchPosts();
      await fetchCategories();

      return data;
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  };

  const deletePost = async (id) => {
    if (!user) throw new Error('Must be logged in to delete posts');

    try {
      const { error } = await supabase
        .from('posts_bx9k7m3p2q')
        .delete()
        .eq('id', id)
        .eq('author_id', user.id);

      if (error) throw error;

      // Refresh posts after deletion
      await fetchPosts();
      await fetchCategories();
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  };

  const getUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles_bx9k7m3p2q')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  };

  const updateProfile = async (profileData) => {
    if (!user) throw new Error('Must be logged in to update profile');

    try {
      const { data, error } = await supabase
        .from('profiles_bx9k7m3p2q')
        .upsert([{
          id: user.id,
          ...profileData,
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      setUserProfile(data);
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const signUp = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const getPostById = (id) => {
    return posts.find(post => post.id === id);
  };

  const getPostsByCategory = (category) => {
    return posts.filter(post => post.category.toLowerCase() === category.toLowerCase());
  };

  const getFeaturedPosts = () => {
    return posts.filter(post => post.featured).slice(0, 3);
  };

  const getRecentPosts = () => {
    return posts.slice(0, 5);
  };

  const getUserPosts = () => {
    if (!user) return [];
    return posts.filter(post => post.author === user.email || post.author_id === user.id);
  };

  const value = {
    posts,
    categories,
    loading,
    user,
    userProfile,
    getPostById,
    getPostsByCategory,
    getFeaturedPosts,
    getRecentPosts,
    getUserPosts,
    createPost,
    updatePost,
    deletePost,
    getUserProfile,
    updateProfile,
    signUp,
    signIn,
    signOut,
    fetchPosts
  };

  return (
    <BlogContext.Provider value={value}>
      {children}
    </BlogContext.Provider>
  );
};