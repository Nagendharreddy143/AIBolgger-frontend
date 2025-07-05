// src/pages/Home.js

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BlogList from "../components/BlogList";
import { getAllBlogs, CATEGORIES, CATEGORY_LABELS } from "../services/api";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const blogsData = await getAllBlogs();
        setBlogs(blogsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Get latest blogs (first 6)
  const latestBlogs = blogs.slice(0, 6);

  const handleBlogClick = (blogId) => {
    navigate(`/blog/${blogId}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Categories Section */}
      <CategoriesSection />

      {/* Latest Articles Section */}
      <section className="py-16 bg-white">
        <BlogList
          blogs={latestBlogs}
          loading={loading}
          error={error}
          onBlogClick={handleBlogClick}
          title="Latest Articles"
        />
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Newsletter Section */}
      <NewsletterSection />
    </div>
  );
};

// Hero Section Component
const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to <span className="text-yellow-400">BlogHub</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Discover insightful articles on politics, economics, science,
            health, and more. Stay informed with our comprehensive coverage of
            topics that matter.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(`/category/top`)}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Explore Top Stories
            </button>
            <button
              onClick={() => navigate(`/category/science`)}
              className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Latest in Science
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Categories Section Component
const CategoriesSection = () => {
  const navigate = useNavigate();
  const categoryIcons = {
    POLITY: "🏛️",
    WORLD: "🌍",
    ECONOMY: "💰",
    SCIENCE: "🔬",
    HEALTH: "🏥",
    SOCIETY: "👥",
    TOP: "⭐",
  };

  const categoryDescriptions = {
    POLITY: "Political analysis and government policies",
    WORLD: "International news and global affairs",
    ECONOMY: "Economic trends and financial insights",
    SCIENCE: "Scientific discoveries and research",
    HEALTH: "Health tips and medical breakthroughs",
    SOCIETY: "Social issues and cultural topics",
    TOP: "Most popular and trending articles",
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explore Our Categories
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose from our diverse range of topics and stay updated with the
            latest insights
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Object.entries(CATEGORIES).map(([key, value]) => (
            <div
              key={key}
              onClick={() => navigate(`/category/${value.toLowerCase()}`)}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 hover:border-blue-300 group"
            >
              <div className="text-center">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                  {categoryIcons[key]}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {CATEGORY_LABELS[key]}
                </h3>
                <p className="text-gray-600 text-sm">
                  {categoryDescriptions[key]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Stats Section Component
const StatsSection = () => {
  const stats = [
    { number: "500+", label: "Articles Published" },
    { number: "50K+", label: "Monthly Readers" },
    { number: "7", label: "Categories Covered" },
    { number: "99%", label: "Reader Satisfaction" },
  ];

  return (
    <section className="py-16 bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our Impact in Numbers
          </h2>
          <p className="text-xl text-blue-100">
            Trusted by thousands of readers worldwide
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">
                {stat.number}
              </div>
              <div className="text-lg text-blue-100">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Newsletter Section Component
const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      // Here you would typically send the email to your backend
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Stay in the Loop
        </h2>
        <p className="text-xl text-gray-300 mb-8">
          Get the latest articles delivered straight to your inbox. Join our
          community of informed readers.
        </p>

        <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
          <div className="flex">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-6 py-3 rounded-l-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:border-blue-500"
              required
            />
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-r-lg font-medium transition-colors"
            >
              Subscribe
            </button>
          </div>
        </form>

        {subscribed && (
          <div className="mt-4 text-green-400 font-medium">
            ✓ Thank you for subscribing! Check your email for confirmation.
          </div>
        )}

        <p className="text-sm text-gray-400 mt-4">
          No spam, ever. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
};

export default Home;
