// src/components/BlogList.js

import React from "react";
import BlogCard from "./BlogCard";

const BlogList = ({
  blogs,
  loading,
  error,
  onBlogClick,
  title = "Latest Articles",
}) => {
  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (!blogs || blogs.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
        <div className="w-20 h-1 bg-blue-600 rounded"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} onClick={onBlogClick} />
        ))}
      </div>
    </div>
  );
};

// Loading component
const LoadingState = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 animate-pulse"
        >
          <div className="p-6">
            <div className="w-20 h-4 bg-gray-300 rounded mb-4"></div>
            <div className="h-6 bg-gray-300 rounded mb-2"></div>
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3"></div>
            </div>
            <div className="flex justify-between items-center">
              <div className="w-16 h-3 bg-gray-300 rounded"></div>
              <div className="w-20 h-3 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Error component
const ErrorState = ({ error }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
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
        Error Loading Articles
      </h3>
      <p className="text-red-600 mb-4">
        {error ||
          "Something went wrong while fetching the articles. Please try again."}
      </p>
      <button
        onClick={() => window.location.reload()}
        className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors"
      >
        Retry
      </button>
    </div>
  </div>
);

// Empty state component
const EmptyState = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="text-center py-12">
      <div className="text-gray-400 mb-4">
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
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No Articles Found
      </h3>
      <p className="text-gray-500">
        There are no articles available at the moment. Please check back later.
      </p>
    </div>
  </div>
);

export default BlogList;
