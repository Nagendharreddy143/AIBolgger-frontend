// src/hooks/useBlog.js

import {
  useState,
  useEffect,
  useCallback,
  useContext,
  createContext,
} from "react";
import {
  getAllBlogs,
  getBlogById,
  getBlogsByCategory,
  CATEGORIES,
} from "../services/api";

// Create Blog Context
const BlogContext = createContext();

// Blog Provider Component
export const BlogProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cache, setCache] = useState({
    blogs: {},
    categories: {},
    single: {},
  });

  const value = {
    blogs,
    setBlogs,
    selectedBlog,
    setSelectedBlog,
    loading,
    setLoading,
    error,
    setError,
    cache,
    setCache,
  };

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
};

// Custom hook to use blog context
export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error("useBlog must be used within a BlogProvider");
  }
  return context;
};

// Custom hook for fetching all blogs
export const useAllBlogs = () => {
  const {
    blogs,
    setBlogs,
    loading,
    setLoading,
    error,
    setError,
    cache,
    setCache,
  } = useBlog();

  const fetchAllBlogs = useCallback(
    async (forceRefresh = false) => {
      // Check cache first
      if (!forceRefresh && cache.blogs.all) {
        setBlogs(cache.blogs.all);
        return cache.blogs.all;
      }

      try {
        setLoading(true);
        setError(null);
        const fetchedBlogs = await getAllBlogs();

        setBlogs(fetchedBlogs);
        setCache((prev) => ({
          ...prev,
          blogs: { ...prev.blogs, all: fetchedBlogs },
        }));

        return fetchedBlogs;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setBlogs, setLoading, setError, cache.blogs.all, setCache]
  );

  useEffect(() => {
    fetchAllBlogs();
  }, [fetchAllBlogs]);

  return { blogs, loading, error, refetch: fetchAllBlogs };
};

// Custom hook for fetching single blog
export const useSingleBlog = (blogId) => {
  const {
    selectedBlog,
    setSelectedBlog,
    loading,
    setLoading,
    error,
    setError,
    cache,
    setCache,
  } = useBlog();

  const fetchBlog = useCallback(
    async (id = blogId, forceRefresh = false) => {
      if (!id) return null;

      // Check cache first
      if (!forceRefresh && cache.single[id]) {
        setSelectedBlog(cache.single[id]);
        return cache.single[id];
      }

      try {
        setLoading(true);
        setError(null);
        const blog = await getBlogById(id);

        setSelectedBlog(blog);
        setCache((prev) => ({
          ...prev,
          single: { ...prev.single, [id]: blog },
        }));

        return blog;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [blogId, setSelectedBlog, setLoading, setError, cache.single, setCache]
  );

  useEffect(() => {
    if (blogId) {
      fetchBlog(blogId);
    }
  }, [blogId, fetchBlog]);

  return { blog: selectedBlog, loading, error, refetch: fetchBlog };
};

// Custom hook for fetching blogs by category
export const useCategoryBlogs = (category) => {
  const [categoryBlogs, setCategoryBlogs] = useState([]);
  const { loading, setLoading, error, setError, cache, setCache } = useBlog();

  const fetchCategoryBlogs = useCallback(
    async (cat = category, forceRefresh = false) => {
      if (!cat) return [];

      const upperCategory = cat.toUpperCase();

      // Check cache first
      if (!forceRefresh && cache.categories[upperCategory]) {
        setCategoryBlogs(cache.categories[upperCategory]);
        return cache.categories[upperCategory];
      }

      try {
        setLoading(true);
        setError(null);
        const blogs = await getBlogsByCategory(upperCategory);

        setCategoryBlogs(blogs);
        setCache((prev) => ({
          ...prev,
          categories: { ...prev.categories, [upperCategory]: blogs },
        }));

        return blogs;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [category, setLoading, setError, cache.categories, setCache]
  );

  useEffect(() => {
    if (category) {
      fetchCategoryBlogs(category);
    }
  }, [category, fetchCategoryBlogs]);

  return { blogs: categoryBlogs, loading, error, refetch: fetchCategoryBlogs };
};

// Custom hook for search functionality
export const useSearch = () => {
  const { blogs } = useBlog();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const performSearch = useCallback(
    (term) => {
      if (!term.trim()) {
        setSearchResults([]);
        return;
      }

      const results = blogs.filter(
        (blog) =>
          blog.title?.toLowerCase().includes(term.toLowerCase()) ||
          blog.content?.toLowerCase().includes(term.toLowerCase()) ||
          blog.category?.toLowerCase().includes(term.toLowerCase())
      );

      setSearchResults(results);
    },
    [blogs]
  );

  useEffect(() => {
    performSearch(searchTerm);
  }, [searchTerm, performSearch]);

  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    performSearch,
  };
};

// Custom hook for filtering blogs
export const useFilter = () => {
  const { blogs } = useBlog();
  const [filters, setFilters] = useState({
    category: "",
    sortBy: "publishDate",
    sortOrder: "desc",
  });

  const filteredBlogs = useCallback(() => {
    let result = [...blogs];

    // Filter by category
    if (filters.category) {
      result = result.filter((blog) => blog.category === filters.category);
    }

    // Sort blogs
    result.sort((a, b) => {
      const aValue = a[filters.sortBy];
      const bValue = b[filters.sortBy];

      if (filters.sortOrder === "desc") {
        return bValue > aValue ? 1 : -1;
      } else {
        return aValue > bValue ? 1 : -1;
      }
    });

    return result;
  }, [blogs, filters]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      category: "",
      sortBy: "publishDate",
      sortOrder: "desc",
    });
  };

  return {
    filters,
    filteredBlogs: filteredBlogs(),
    updateFilter,
    resetFilters,
    availableCategories: CATEGORIES,
  };
};

// Custom hook for pagination
export const usePagination = (items, itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const reset = () => {
    setCurrentPage(1);
  };

  return {
    currentPage,
    totalPages,
    currentItems,
    goToPage,
    nextPage,
    prevPage,
    reset,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
};

// Custom hook for favorites (using localStorage)
export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem("blogFavorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const addToFavorites = (blogId) => {
    setFavorites((prev) => {
      const newFavorites = [...prev, blogId];
      localStorage.setItem("blogFavorites", JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const removeFromFavorites = (blogId) => {
    setFavorites((prev) => {
      const newFavorites = prev.filter((id) => id !== blogId);
      localStorage.setItem("blogFavorites", JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const isFavorite = (blogId) => {
    return favorites.includes(blogId);
  };

  const toggleFavorite = (blogId) => {
    if (isFavorite(blogId)) {
      removeFromFavorites(blogId);
    } else {
      addToFavorites(blogId);
    }
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
  };
};
