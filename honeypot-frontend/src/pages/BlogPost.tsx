import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import {
  useGetBlogPostQuery,
  useGetCommentsQuery,
  useAddCommentMutation,
} from "../services/api";

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useSelector((state: RootState) => state.auth);

  // Queries
  const { data: post, isLoading: postLoading } = useGetBlogPostQuery(
    slug || "",
  );
  const { data: comments, isLoading: commentsLoading } = useGetCommentsQuery(
    slug || "",
  );
  const [addComment, { isLoading: isSubmitting }] = useAddCommentMutation();

  // Form State
  const [commentText, setCommentText] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug || !commentText.trim()) return;

    try {
      await addComment({ slug, content: commentText }).unwrap();
      setCommentText("");
      setMsg("Comment submitted! It will appear after approval. 🐝");
    } catch (err) {
      console.error("Failed to post comment", err);
      setMsg("Failed to post comment. Please try again.");
    }
  };

  if (postLoading)
    return <div className="text-center py-20">Loading post...</div>;
  if (!post) return <div className="text-center py-20">Post not found.</div>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Back Link */}
      <Link
        to="/blog"
        className="text-honey-gold font-bold hover:underline mb-8 block"
      >
        ← Back to Blog
      </Link>

      {/* Article Header */}
      <div className="mb-8 text-center">
        <span className="text-sm font-bold text-gray-500 tracking-wide uppercase">
          {post.post_type}
        </span>
        <h1 className="text-4xl font-extrabold text-gray-900 mt-2 mb-4">
          {post.title}
        </h1>
        <p className="text-gray-500">
          By {post.author} • {new Date(post.created_at).toLocaleDateString()}
        </p>
      </div>

      {/* Featured Image */}
      {post.featured_image && (
        <img
          src={post.featured_image}
          alt={post.title}
          className="w-full h-96 object-cover rounded-xl shadow-lg mb-10"
        />
      )}

      {/* Content */}
      <div
        className="prose prose-lg prose-yellow mx-auto mb-16 text-gray-700"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <hr className="border-gray-200 mb-12" />

      {/* COMMENTS SECTION */}
      <div className="bg-gray-50 rounded-xl p-8 border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Hive Buzz ({comments?.length || 0})
        </h3>

        {/* Comment List */}
        <div className="space-y-6 mb-10">
          {commentsLoading ? (
            <p>Loading comments...</p>
          ) : comments && comments.length > 0 ? (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-gray-900">
                    {comment.user}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">
              No comments yet. Be the first to buzz in!
            </p>
          )}
        </div>

        {/* Comment Form */}
        {user ? (
          <form onSubmit={handleSubmit} className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Leave a comment
            </label>
            <textarea
              rows={4}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-honey-gold focus:ring-honey-gold p-3 border"
              placeholder="What do you think?"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              required
            />
            {msg && <p className="mt-2 text-sm text-green-600">{msg}</p>}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 rounded-md bg-honey-gold px-6 py-2 text-white font-bold hover:bg-yellow-600 transition disabled:opacity-50"
            >
              {isSubmitting ? "Posting..." : "Post Comment"}
            </button>
          </form>
        ) : (
          <div className="text-center p-6 bg-yellow-50 rounded-lg border border-yellow-100">
            <p className="text-yellow-800">
              Please{" "}
              <Link to="/login" className="font-bold underline">
                log in
              </Link>{" "}
              to join the conversation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPost;
