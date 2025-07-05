// src/components/Header.js

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CATEGORIES, CATEGORY_LABELS } from "../services/api";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleCategoryDropdown = () => {
    setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
  };

  const handleCategoryClick = (category) => {
    navigate(`/category/${category}`);
    setIsCategoryDropdownOpen(false);
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              📖 BlogHub
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={toggleCategoryDropdown}
                className="flex items-center text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Categories
                <svg
                  className={`ml-1 w-4 h-4 transition-transform ${
                    isCategoryDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isCategoryDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                  {Object.entries(CATEGORIES).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => handleCategoryClick(value)}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      {CATEGORY_LABELS[key]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="#"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              About
            </Link>

            <Link
              to="#"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-left text-gray-700 hover:text-blue-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>

              {/* Mobile Categories */}
              <div className="space-y-2">
                <div className="text-gray-700 font-medium">Categories</div>
                <div className="ml-4 space-y-2">
                  {Object.entries(CATEGORIES).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => handleCategoryClick(value)}
                      className="block text-left text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      {CATEGORY_LABELS[key]}
                    </button>
                  ))}
                </div>
              </div>

              <Link
                to="#"
                className="text-left text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                About
              </Link>

              <Link
                to="#"
                className="text-left text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Overlay for dropdown */}
      {isCategoryDropdownOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsCategoryDropdownOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;
