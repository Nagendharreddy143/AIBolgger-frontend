// src/utils/helpers.js

// Text and String Utilities
export const truncateText = (text, maxLength = 100) => {
  if (!text) return "";
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

export const slugify = (text) => {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/--+/g, "-") // Replace multiple hyphens with single hyphen
    .trim();
};

export const capitalizeWords = (text) => {
  if (!text) return "";
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
};

export const removeMarkdown = (text) => {
  if (!text) return "";
  return text
    .replace(/#{1,6}\s+/g, "") // Remove headers
    .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold
    .replace(/\*(.*?)\*/g, "$1") // Remove italic
    .replace(/\[(.*?)\]\(.*?\)/g, "$1") // Remove links
    .replace(/`(.*?)`/g, "$1") // Remove code
    .replace(/>/g, "") // Remove blockquotes
    .replace(/\n/g, " ") // Replace newlines with spaces
    .trim();
};

// Date Utilities
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return "";

  const defaultOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  };

  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", defaultOptions);
};

export const formatTime = (dateString, options = {}) => {
  if (!dateString) return "";

  const defaultOptions = {
    hour: "2-digit",
    minute: "2-digit",
    ...options,
  };

  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", defaultOptions);
};

export const formatDateTime = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  return `${formatDate(dateString)} at ${formatTime(dateString)}`;
};

export const getRelativeTime = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  const timeUnits = [
    { unit: "year", seconds: 31536000 },
    { unit: "month", seconds: 2592000 },
    { unit: "week", seconds: 604800 },
    { unit: "day", seconds: 86400 },
    { unit: "hour", seconds: 3600 },
    { unit: "minute", seconds: 60 },
  ];

  for (const { unit, seconds } of timeUnits) {
    const interval = Math.floor(diffInSeconds / seconds);
    if (interval >= 1) {
      return `${interval} ${unit}${interval === 1 ? "" : "s"} ago`;
    }
  }

  return "Just now";
};

export const isToday = (dateString) => {
  if (!dateString) return false;

  const date = new Date(dateString);
  const today = new Date();

  return date.toDateString() === today.toDateString();
};

export const isThisWeek = (dateString) => {
  if (!dateString) return false;

  const date = new Date(dateString);
  const today = new Date();
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  return date >= weekAgo && date <= today;
};

// Array Utilities
export const sortArray = (array, key, direction = "asc") => {
  return [...array].sort((a, b) => {
    const aValue = typeof a[key] === "string" ? a[key].toLowerCase() : a[key];
    const bValue = typeof b[key] === "string" ? b[key].toLowerCase() : b[key];

    if (direction === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
};

export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
};

export const uniqueBy = (array, key) => {
  const seen = new Set();
  return array.filter((item) => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

export const shuffle = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// URL and Navigation Utilities
export const getQueryParams = (search = window.location.search) => {
  const params = new URLSearchParams(search);
  const result = {};
  for (const [key, value] of params) {
    result[key] = value;
  }
  return result;
};

export const buildQueryString = (params) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      searchParams.append(key, value);
    }
  });
  return searchParams.toString();
};

export const updateQueryParams = (newParams) => {
  const url = new URL(window.location);
  Object.entries(newParams).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }
  });
  window.history.pushState({}, "", url);
};

export const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

// Validation Utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value !== "";
};

export const validateMinLength = (value, minLength) => {
  return value && value.length >= minLength;
};

export const validateMaxLength = (value, maxLength) => {
  return !value || value.length <= maxLength;
};

// Storage Utilities
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error("Error getting from localStorage:", error);
      return defaultValue;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error("Error setting to localStorage:", error);
      return false;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error("Error removing from localStorage:", error);
      return false;
    }
  },

  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error("Error clearing localStorage:", error);
      return false;
    }
  },
};

// DOM Utilities
export const scrollToTop = (smooth = true) => {
  window.scrollTo({
    top: 0,
    behavior: smooth ? "smooth" : "auto",
  });
};

export const scrollToElement = (elementId, offset = 0, smooth = true) => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.offsetTop;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: smooth ? "smooth" : "auto",
    });
  }
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Error copying to clipboard:", error);
    return false;
  }
};

export const getElementHeight = (element) => {
  if (!element) return 0;
  const rect = element.getBoundingClientRect();
  return rect.height;
};

export const isElementInViewport = (element) => {
  if (!element) return false;

  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

// Performance Utilities
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

// Color Utilities
export const getCategoryColor = (category) => {
  const colors = {
    POLITY: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      border: "border-blue-200",
      hover: "hover:bg-blue-200",
    },
    WORLD: {
      bg: "bg-green-100",
      text: "text-green-800",
      border: "border-green-200",
      hover: "hover:bg-green-200",
    },
    ECONOMY: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      border: "border-yellow-200",
      hover: "hover:bg-yellow-200",
    },
    SCIENCE: {
      bg: "bg-purple-100",
      text: "text-purple-800",
      border: "border-purple-200",
      hover: "hover:bg-purple-200",
    },
    HEALTH: {
      bg: "bg-red-100",
      text: "text-red-800",
      border: "border-red-200",
      hover: "hover:bg-red-200",
    },
    SOCIETY: {
      bg: "bg-indigo-100",
      text: "text-indigo-800",
      border: "border-indigo-200",
      hover: "hover:bg-indigo-200",
    },
    TOP: {
      bg: "bg-gray-100",
      text: "text-gray-800",
      border: "border-gray-200",
      hover: "hover:bg-gray-200",
    },
  };

  return colors[category] || colors.TOP;
};

export const getCategoryGradient = (category) => {
  const gradients = {
    POLITY: "from-blue-500 to-blue-600",
    WORLD: "from-green-500 to-green-600",
    ECONOMY: "from-yellow-500 to-yellow-600",
    SCIENCE: "from-purple-500 to-purple-600",
    HEALTH: "from-red-500 to-red-600",
    SOCIETY: "from-indigo-500 to-indigo-600",
    TOP: "from-gray-500 to-gray-600",
  };

  return gradients[category] || gradients.TOP;
};

// Error Handling Utilities
export const createError = (message, code = null, details = null) => {
  const error = new Error(message);
  error.code = code;
  error.details = details;
  return error;
};

export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const message = error.response.data?.message || error.message;

    switch (status) {
      case 400:
        return createError(
          "Bad request. Please check your input.",
          "BAD_REQUEST",
          error.response.data
        );
      case 401:
        return createError(
          "Unauthorized. Please log in again.",
          "UNAUTHORIZED"
        );
      case 403:
        return createError("Access denied.", "FORBIDDEN");
      case 404:
        return createError("Resource not found.", "NOT_FOUND");
      case 500:
        return createError(
          "Server error. Please try again later.",
          "SERVER_ERROR"
        );
      default:
        return createError(
          message || "An unexpected error occurred.",
          "UNKNOWN_ERROR"
        );
    }
  } else if (error.request) {
    // Request was made but no response received
    return createError(
      "Network error. Please check your connection.",
      "NETWORK_ERROR"
    );
  } else {
    // Something else happened
    return createError(
      error.message || "An unexpected error occurred.",
      "UNKNOWN_ERROR"
    );
  }
};

// Constants
export const READING_TIME_WPM = 200; // Words per minute for reading time calculation

export const calculateReadingTime = (text) => {
  if (!text) return 0;

  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / READING_TIME_WPM);
  return minutes;
};

export const formatReadingTime = (minutes) => {
  if (minutes < 1) return "< 1 min read";
  if (minutes === 1) return "1 min read";
  return `${minutes} min read`;
};

// Social Media Utilities
export const generateShareUrl = (platform, url, title, description) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%20${encodedUrl}`,
  };

  return shareUrls[platform] || "";
};

export const openShareWindow = (
  url,
  title = "Share",
  width = 600,
  height = 400
) => {
  const left = (window.innerWidth - width) / 2;
  const top = (window.innerHeight - height) / 2;

  window.open(
    url,
    title,
    `toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no,copyhistory=no,width=${width},height=${height},top=${top},left=${left}`
  );
};
