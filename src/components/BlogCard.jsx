// src/components/BlogCard.js

import React from "react";
import {
  extractTitle,
  extractExcerpt,
  formatDateShort,
  CATEGORY_LABELS,
} from "../services/api";

const BlogCard = ({ blog, onClick }) => {
  const title = extractTitle(blog.content);
  const excerpt = extractExcerpt(blog.content, 120);
  const formattedDate = formatDateShort(blog.publishDate);
  const categoryLabel = CATEGORY_LABELS[blog.category] || blog.category;

  return (
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer overflow-hidden border border-gray-200"
      onClick={() => onClick(blog.id)}
    >
      {/* Category Badge */}
      <div className="px-6 pt-4">
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${getCategoryColor(
            blog.category
          )}`}
        >
          {categoryLabel}
        </span>
      </div>

      {/* Content */}
      <div className="px-6 py-4">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
          {title}
        </h3>

        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {excerpt}
        </p>

        {/* Date and Read More */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 font-medium">
            {formattedDate}
          </span>
          <span className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors">
            Read More →
          </span>
        </div>
      </div>
    </div>
  );
};

// Helper function to get category-specific colors
const getCategoryColor = (category) => {
  const colors = {
    POLITY: "bg-blue-100 text-blue-800",
    WORLD: "bg-green-100 text-green-800",
    ECONOMY: "bg-yellow-100 text-yellow-800",
    SCIENCE: "bg-purple-100 text-purple-800",
    HEALTH: "bg-red-100 text-red-800",
    SOCIETY: "bg-indigo-100 text-indigo-800",
    TOP: "bg-gray-100 text-gray-800",
  };

  return colors[category] || "bg-gray-100 text-gray-800";
};

export default BlogCard;
