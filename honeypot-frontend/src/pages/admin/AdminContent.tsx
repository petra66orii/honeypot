import React, { useState } from "react";
import {
  useGetAdminReviewsQuery,
  useDeleteReviewMutation,
  useGetContactMessagesQuery,
  useApproveReviewMutation,
} from "../../services/api";

const AdminContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"reviews" | "messages">("reviews");

  // Reviews Data
  const { data: reviews, isLoading: loadingReviews } =
    useGetAdminReviewsQuery();
  const [deleteReview] = useDeleteReviewMutation();
  const [approveReview] = useApproveReviewMutation();

  // Messages Data
  const { data: messages, isLoading: loadingMessages } =
    useGetContactMessagesQuery();

  const handleDeleteReview = async (id: number) => {
    if (window.confirm("Are you sure you want to remove this review?")) {
      await deleteReview(id);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await approveReview({ id, approved: true }).unwrap();
    } catch (err) {
      console.error("Failed to approve review", err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Content Management 🛡️
      </h1>

      {/* TABS */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("reviews")}
          className={`px-6 py-3 font-medium text-sm transition-colors ${
            activeTab === "reviews"
              ? "border-b-2 border-honey-gold text-honey-gold"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          ⭐ Product Reviews
        </button>
        <button
          onClick={() => setActiveTab("messages")}
          className={`px-6 py-3 font-medium text-sm transition-colors ${
            activeTab === "messages"
              ? "border-b-2 border-honey-gold text-honey-gold"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          📬 Contact Messages
        </button>
      </div>

      {/* === REVIEWS TAB === */}
      {activeTab === "reviews" && (
        <div className="space-y-4">
          {loadingReviews ? (
            <p>Loading reviews...</p>
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
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                        ID: #{review.id}
                      </span>
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
                    {/* 👇 Show Approve button only if NOT approved yet */}
                    {!review.approved && (
                      <button
                        onClick={() => handleApprove(review.id)}
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

      {/* === MESSAGES TAB === */}
      {activeTab === "messages" && (
        <div className="space-y-4">
          {loadingMessages ? (
            <p>Loading messages...</p>
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
    </div>
  );
};

export default AdminContent;
