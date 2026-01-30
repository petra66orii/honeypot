import React from "react";
import { Link } from "react-router-dom";
import { useGetProductsQuery, useGetBlogPostsQuery } from "../services/api";
import Testimonials from "../components/Testimonials";

const Home: React.FC = () => {
  // Fetch Data for sections

  // FIX 1: Pass { category: "", page: 1 } to be explicit, and rename data to 'productsData'
  const { data: productsData, isLoading: productsLoading } =
    useGetProductsQuery({
      category: "",
      page: 1,
    });

  // FIX 2: Remove the empty object {}. The hook expects (string | void).
  const { data: posts, isLoading: postsLoading } = useGetBlogPostsQuery();

  // FIX 3: Access .results before slicing (because productsData is now a "Box")
  const featuredProducts = productsData?.results.slice(0, 3);

  // Blog posts are likely still unwrapped (simple array) based on our previous config
  const recentPosts = posts?.slice(0, 3);

  return (
    <div className="bg-white">
      {/* --- HERO SECTION WITH HONEY DRIP --- */}
      {/* FIX: Removed 'overflow-hidden' and added z-index so drips sit on top of the next section */}
      <div className="relative w-full h-150 flex items-center justify-center bg-gray-900 z-10">
        {/* Background Media Container - We keep overflow hidden HERE to clip the video */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 opacity-80">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="/background-honey-drip.mp4" type="video/mp4" />
            </video>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-md tracking-tight">
            Your One Stop <br />{" "}
            <span className="text-honey-gold">Honey Shop</span>
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto drop-shadow-sm">
            Pure, organic, and ethically sourced from the happiest bees in the
            valley.
          </p>
          <Link
            to="/products"
            className="inline-block bg-honey-gold text-white font-bold text-lg px-8 py-4 rounded-full shadow-lg hover:bg-yellow-500 hover:scale-105 transition transform duration-300"
          >
            SHOP NOW
          </Link>
        </div>

        {/* THE DRIPPING HONEY EFFECT (SVG) */}
        <div className="absolute -bottom-25 left-0 w-full leading-none z-20">
          <svg
            className="relative block w-[calc(100%+1.3px)] h-20 md:h-25"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            style={{ filter: "drop-shadow(0px 2px 3px rgba(0,0,0,0.3))" }}
          >
            <defs>
              {/* Linear Gradient: Gives the honey a 3D rounded look */}
              <linearGradient
                id="honeyGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#F59E0B" />{" "}
                {/* Light Gold at top */}
                <stop offset="100%" stopColor="#B45309" />{" "}
                {/* Dark Amber at tips */}
              </linearGradient>
            </defs>

            {/* Main Drip Body - Uses the Gradient */}
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              fill="url(#honeyGradient)"
              opacity="1"
            ></path>

            {/* Shine Layer - Adds the "Wet" Reflection look */}
            <path
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
              fill="#FFFFFF"
              opacity="0.2"
              transform="scale(1, 0.8)" // Slightly smaller to sit "inside" the main shape
            ></path>
          </svg>
        </div>
      </div>

      {/* --- VALUES SECTION --- */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                🌿
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                100% Organic
              </h3>
              <p className="text-gray-500">
                Certified organic honey, free from pesticides and additives.
              </p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                🐝
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Sustainably Sourced
              </h3>
              <p className="text-gray-500">
                We prioritize the health of our bees and their natural habitats.
              </p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                🍯
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Raw & Unfiltered
              </h3>
              <p className="text-gray-500">
                Retaining all the natural pollen, enzymes, and nutritional
                benefits.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- FEATURED PRODUCTS --- */}
      <div className="bg-yellow-50/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Sweeten Your Day
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Our customer favorites, fresh from the hive.
            </p>
          </div>

          {productsLoading ? (
            <div className="text-center">Loading sweetness...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProducts?.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition duration-300 overflow-hidden group"
                >
                  <div className="h-64 bg-gray-100 overflow-hidden relative">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">
                        🍯
                      </div>
                    )}
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-honey-gold font-bold text-xl">
                      €{product.price}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div className="text-center mt-12">
            <Link
              to="/products"
              className="text-honey-gold font-bold hover:text-yellow-600 underline"
            >
              View all products →
            </Link>
          </div>
        </div>
      </div>

      {/* --- LATEST BUZZ (BLOG) --- */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Latest Buzz
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Stories and recipes from the colony.
            </p>
          </div>

          {postsLoading ? (
            <div className="text-center">Loading stories...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentPosts?.map((post) => (
                <Link key={post.id} to={`/blog/${post.slug}`} className="group">
                  <div className="rounded-lg overflow-hidden mb-4 relative h-56">
                    {post.featured_image ? (
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-4xl">
                        📰
                      </div>
                    )}
                    <div className="absolute top-2 left-2 bg-white/90 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide text-gray-800">
                      {post.post_type}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-honey-gold transition">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-2">{post.excerpt}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <Testimonials />
    </div>
  );
};

export default Home;
