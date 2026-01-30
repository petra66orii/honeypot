import React, { useState } from "react";
import BeeRatingInput from "./BeeRatingInput";
import { useAddReviewMutation } from "../services/api";

interface ReviewFormProps {
  productId: string;
  onSuccess: () => void; // Callback to refresh the page after submission
}

const ReviewForm: React.FC<ReviewFormProps> = ({ productId, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [addReview] = useAddReviewMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (rating === 0) {
      setError("Please give at least 1 bee!");
      return;
    }

    setIsSubmitting(true);

    try {
      // Call the API
      await addReview({
        productId,
        rating,
        content: comment,
      }).unwrap();

      setComment("");
      setRating(0);
      alert(
        "Review submitted! It will appear once approved by our hive keepers. 🐝",
      );
      onSuccess();
    } catch (err) {
      console.error(err);
      setError("Failed to submit review. Are you logged in?");
    }
  };

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-bold text-gray-900">Write a Review</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Interactive Bee Input */}
        <BeeRatingInput
          rating={rating}
          setRating={setRating}
          label="How was the honey?"
        />

        {/* Comment Box */}
        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700"
          >
            Tell us what you think
          </label>
          <textarea
            id="comment"
            rows={4}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-honey-gold focus:ring-honey-gold sm:text-sm"
            placeholder="The taste was incredible..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-honey-gold px-6 py-2 text-sm font-bold text-white shadow-sm hover:bg-yellow-600 disabled:opacity-50"
        >
          {isSubmitting ? "Posting..." : "Post Review"}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
