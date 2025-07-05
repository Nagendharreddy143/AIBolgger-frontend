// src/App.js

import React from "react";
import { Routes, Route } from "react-router-dom";
import { BlogProvider } from "./hooks/useBlog";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import BlogDetailPage from "./pages/BlogDetailPage";

const App = () => {
  return (
    <BlogProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/blog/:id" element={<BlogDetailPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BlogProvider>
  );
};

export default App;
