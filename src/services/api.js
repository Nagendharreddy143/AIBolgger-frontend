// src/services/api.js

const API_BASE_URL = "http://localhost:8080/api/blogs/v1";

// Categories enum to match your backend
export const CATEGORIES = {
  POLITY: "POLITY",
  WORLD: "WORLD",
  ECONOMY: "ECONOMY",
  SCIENCE: "SCIENCE",
  HEALTH: "HEALTH",
  SOCIETY: "SOCIETY",
  TOP: "TOP",
};

// Category display names for UI
export const CATEGORY_LABELS = {
  POLITY: "Polity",
  WORLD: "World",
  ECONOMY: "Economy",
  SCIENCE: "Science",
  HEALTH: "Health",
  SOCIETY: "Society",
  TOP: "Top Stories",
};

// Generic API call function
const apiCall = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
};

// Get all blogs
export const getAllBlogs = async () => {
  return await apiCall("/blogs");
};

// Get single blog by ID
export const getBlogById = async (id) => {
  return await apiCall(`/blog/${id}`);
};

// Get blogs by category
export const getBlogsByCategory = async (category) => {
  return await apiCall(`/category/${category}`);
};

// Utility function to extract excerpt from markdown content
export const extractExcerpt = (markdownContent, maxLength = 150) => {
  if (!markdownContent) return "";

  // Remove markdown syntax for preview
  const plainText = markdownContent
    .replace(/#{1,6}\s/g, "") // Remove headers
    .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold
    .replace(/\*(.*?)\*/g, "$1") // Remove italic
    .replace(/\[(.*?)\]\(.*?\)/g, "$1") // Remove links, keep text
    .replace(/`(.*?)`/g, "$1") // Remove inline code
    .replace(/\n+/g, " ") // Replace newlines with spaces
    .trim();

  // Extract first meaningful paragraph (skip if it starts with #)
  const paragraphs = plainText
    .split("\n")
    .filter((p) => p.trim() && !p.startsWith("#"));
  const firstParagraph = paragraphs[0] || plainText;

  if (firstParagraph.length <= maxLength) {
    return firstParagraph;
  }

  return firstParagraph.substring(0, maxLength).trim() + "...";
};

// Utility function to extract title from markdown content
export const extractTitle = (markdownContent) => {
  if (!markdownContent) return "Untitled";

  // Look for first H1 or H2 heading
  const lines = markdownContent.split("\n");
  for (let line of lines) {
    line = line.trim();
    if (line.startsWith("# ")) {
      return line.substring(2).trim();
    }
    if (line.startsWith("## ")) {
      return line.substring(3).trim();
    }
  }

  // If no heading found, return first line or fallback
  const firstLine = lines[0]?.trim();
  return firstLine || "Untitled";
};

// Utility function to format date
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Utility function to format date for display (shorter)
export const formatDateShort = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
