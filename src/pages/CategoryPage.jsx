// src/pages/CategoryPage.js

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BlogCard from "../components/BlogCard";
import { getBlogsByCategory, CATEGORY_LABELS } from "../services/api";
import { useBlog } from "../hooks/useBlog";

const CategoryPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setSelectedBlog } = useBlog();

  useEffect(() => {
    const fetchCategoryBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const categoryBlogs = await getBlogsByCategory(category.toUpperCase());
        setBlogs(categoryBlogs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchCategoryBlogs();
    }
  }, [category]);

  const handleBlogClick = (blog) => {
    setSelectedBlog(blog);
    navigate(`/blog/${blog.id}`);
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  const categoryLabel = CATEGORY_LABELS[category?.toUpperCase()] || category;

  if (loading) return <CategoryLoadingState />;
  if (error) return <CategoryErrorState error={error} />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToHome}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Home
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">
                {categoryLabel}
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                {blogs.length} {blogs.length === 1 ? "article" : "articles"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Banner */}
      <div
        className={`${getCategoryBannerColor(category?.toUpperCase())} py-8`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-2">
              {categoryLabel} News
            </h2>
            <p className="text-white/90 text-lg">
              Stay updated with the latest {categoryLabel.toLowerCase()} stories
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {blogs.length === 0 ? (
          <NoBlogsState category={categoryLabel} />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard
                key={blog.id}
                blog={blog}
                onClick={() => handleBlogClick(blog)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function for category banner colors
const getCategoryBannerColor = (category) => {
  const colors = {
    POLITY: "bg-gradient-to-r from-blue-600 to-blue-700",
    WORLD: "bg-gradient-to-r from-green-600 to-green-700",
    ECONOMY: "bg-gradient-to-r from-yellow-600 to-yellow-700",
    SCIENCE: "bg-gradient-to-r from-purple-600 to-purple-700",
    HEALTH: "bg-gradient-to-r from-red-600 to-red-700",
    SOCIETY: "bg-gradient-to-r from-indigo-600 to-indigo-700",
    TOP: "bg-gradient-to-r from-gray-600 to-gray-700",
  };
  return colors[category] || "bg-gradient-to-r from-gray-600 to-gray-700";
};

// Loading state
const CategoryLoadingState = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-300 rounded w-1/3 mb-8"></div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6">
              <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Error state
const CategoryErrorState = ({ error }) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="text-red-600 mb-4">
          <svg
            className="mx-auto h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-red-800 mb-2">
          Error Loading Category
        </h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

// No blogs state
const NoBlogsState = ({ category }) => (
  <div className="text-center py-12">
    <div className="text-gray-400 mb-4">
      <svg
        className="mx-auto h-16 w-16"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      No {category} Articles Yet
    </h3>
    <p className="text-gray-500">
      Check back later for new {category.toLowerCase()} stories.
    </p>
  </div>
);

export default CategoryPage;
