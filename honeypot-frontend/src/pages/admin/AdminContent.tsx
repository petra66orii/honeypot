import React, { useState } from "react";
import {
  useGetAdminReviewsQuery,
  useDeleteReviewMutation,
  useApproveReviewMutation,
  useGetContactMessagesQuery,
  useGetAdminCommentsQuery, // 👈 Ensure these are imported from your api.ts
  useApproveCommentMutation,
  useDeleteCommentMutation,
} from "../../services/api";

const AdminContent: React.FC = () => {
  // State to track which tab is open
  const [activeTab, setActiveTab] = useState<
    "reviews" | "messages" | "comments"
  >("reviews");

  // --- 1. REVIEWS HOOKS ---
  const { data: reviews, isLoading: loadingReviews } =
    useGetAdminReviewsQuery();
  const [deleteReview] = useDeleteReviewMutation();
  const [approveReview] = useApproveReviewMutation();

  // --- 2. MESSAGES HOOKS ---
  const { data: messages, isLoading: loadingMessages } =
    useGetContactMessagesQuery();

  // --- 3. COMMENTS HOOKS ---
  const { data: comments, isLoading: loadingComments } =
    useGetAdminCommentsQuery();
  const [approveComment] = useApproveCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

  // --- HANDLERS ---
  const handleDeleteReview = async (id: number) => {
    if (window.confirm("Are you sure you want to remove this review?")) {
      await deleteReview(id);
    }
  };

  const handleApproveReview = async (id: number) => {
    await approveReview({ id, approved: true });
  };

  const handleDeleteComment = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      await deleteComment(id);
    }
  };

  const handleApproveComment = async (id: number) => {
    await approveComment({ id, approved: true });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Content Management 🛡️
      </h1>

      {/* === TABS HEADER === */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab("reviews")}
          className={`px-6 py-3 font-medium text-sm transition-colors whitespace-nowrap ${
            activeTab === "reviews"
              ? "border-b-2 border-honey-gold text-honey-gold"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          ⭐ Product Reviews
        </button>
        <button
          onClick={() => setActiveTab("messages")}
          className={`px-6 py-3 font-medium text-sm transition-colors whitespace-nowrap ${
            activeTab === "messages"
              ? "border-b-2 border-honey-gold text-honey-gold"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          📬 Contact Messages
        </button>
        <button
          onClick={() => setActiveTab("comments")}
          className={`px-6 py-3 font-medium text-sm transition-colors whitespace-nowrap ${
            activeTab === "comments"
              ? "border-b-2 border-honey-gold text-honey-gold"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          💬 Blog Comments
        </button>
      </div>

      {/* === TAB 1: PRODUCT REVIEWS === */}
      {activeTab === "reviews" && (
        <div className="space-y-4">
          {loadingReviews ? (
            <p className="text-gray-500">Loading reviews...</p>
          ) : reviews?.length === 0 ? (
            <p className="text-gray-500">No reviews found.</p>
          ) : (
            <div className="grid gap-4">
              {reviews?.map((review) => (
                <div
                  key={review.id}
                  className="bg-white p-4 rounded-lg shadow border border-gray-100 flex justify-between gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-900">
                        {review.user || "User"}
                      </span>
                      <span className="text-xs text-gray-500">
                        • {new Date(review.created_on).toLocaleDateString()}
                      </span>
                      {review.approved ? (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded border border-green-200">
                          ✅ Published
                        </span>
                      ) : (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded border border-yellow-200 animate-pulse">
                          ⏳ Pending
                        </span>
                      )}
                    </div>
                    <div className="flex text-honey-gold text-sm mb-2">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </div>
                    <p className="text-gray-700 text-sm">
                      {review.review_text}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {!review.approved && (
                      <button
                        onClick={() => handleApproveReview(review.id)}
                        className="text-green-600 hover:bg-green-50 px-3 py-1 rounded text-sm font-medium transition border border-green-200"
                      >
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="text-red-500 hover:bg-red-50 px-3 py-1 rounded text-sm font-medium transition border border-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* === TAB 2: CONTACT MESSAGES === */}
      {activeTab === "messages" && (
        <div className="space-y-4">
          {loadingMessages ? (
            <p className="text-gray-500">Loading messages...</p>
          ) : messages?.length === 0 ? (
            <p className="text-gray-500">No messages found.</p>
          ) : (
            <div className="grid gap-4">
              {messages?.map((msg) => (
                <div
                  key={msg.id}
                  className="bg-white p-6 rounded-lg shadow border border-gray-100"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900">{msg.subject}</h3>
                      <p className="text-sm text-honey-gold font-medium">
                        {msg.name} &lt;{msg.email}&gt;
                      </p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(msg.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded text-gray-700 text-sm whitespace-pre-wrap">
                    {msg.message}
                  </div>
                  <div className="mt-4 flex justify-end">
                    <a
                      href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      Reply via Email →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* === TAB 3: BLOG COMMENTS === */}
      {activeTab === "comments" && (
        <div className="space-y-4">
          {loadingComments ? (
            <p className="text-gray-500">Loading comments...</p>
          ) : comments?.length === 0 ? (
            <p className="text-gray-500">No blog comments found.</p>
          ) : (
            <div className="grid gap-4">
              {comments?.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-white p-4 rounded-lg shadow border border-gray-100 flex justify-between gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-900">
                        {comment.user}
                      </span>
                      <span className="text-xs text-gray-500">
                        • {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-gray-400">
                        Post ID: #{comment.post}
                      </span>
                      {comment.approved ? (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded border border-green-200">
                          ✅ Published
                        </span>
                      ) : (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded border border-yellow-200 animate-pulse">
                          ⏳ Pending
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 text-sm">{comment.content}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {!comment.approved && (
                      <button
                        onClick={() => handleApproveComment(comment.id)}
                        className="text-green-600 border border-green-200 hover:bg-green-50 px-3 py-1 rounded text-sm"
                      >
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-red-500 border border-red-200 hover:bg-red-50 px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminContent;
