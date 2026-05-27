import React, { useState } from "react";
import { useGetBlogPostsQuery } from "../services/api";
import { Link } from "react-router-dom";

const BlogList: React.FC = () => {
  const [filter, setFilter] = useState<string | undefined>(undefined);
  const { data: posts, isLoading } = useGetBlogPostsQuery(filter);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          The Honey Pot Blog
        </h1>
        <p className="text-lg text-gray-600">
          Sweet stories and sticky recipes.
        </p>

        {/* Filter Tabs */}
        <div className="mt-6 flex justify-center space-x-4">
          {["All", "blog", "recipe"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type === "All" ? undefined : type)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition ${
                filter === type || (filter === undefined && type === "All")
                  ? "bg-honey-gold text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {type === "All"
                ? "All Posts"
                : type.charAt(0).toUpperCase() + type.slice(1) + "s"}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-20">Loading sweet content...</div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts?.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition"
            >
              <div className="aspect-w-16 aspect-h-9 w-full bg-gray-200 overflow-hidden">
                {post.featured_image ? (
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="h-48 w-full object-cover group-hover:scale-105 transition duration-300"
                  />
                ) : (
                  <div className="h-48 w-full flex items-center justify-center bg-yellow-50 text-4xl">
                    🐝
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${post.post_type === "recipe" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}
                  >
                    {post.post_type === "recipe" ? "Recipe" : "Article"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-honey-gold transition">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {post.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogList;
