"use client";

import { useState } from "react";
import {
  FaStar,
  FaRegStar,
  FaHeart,
  FaRegHeart,
  FaUserCircle,
} from "react-icons/fa";

type Review = {
  id: number;
  user: string;
  avatar: string;
  rating: number;
  comment: string;
};

const mockUser = {
  name: "John Doe",
  avatar: "https://i.pravatar.cc/150?img=12",
  avgRating: 4.2,
  totalReviews: 3,
};

const mockReviews: Review[] = [
  {
    id: 1,
    user: "Alice",
    avatar: "https://i.pravatar.cc/100?img=5",
    rating: 5,
    comment: "Amazing experience! Very professional.",
  },
  {
    id: 2,
    user: "Bob",
    avatar: "https://i.pravatar.cc/100?img=8",
    rating: 4,
    comment: "Great communication and smooth process.",
  },
  {
    id: 3,
    user: "Charlie",
    avatar: "https://i.pravatar.cc/100?img=10",
    rating: 3,
    comment: "Good overall, but could improve response time.",
  },
];

export default function UserProfile() {
  const [reviews, setReviews] = useState(mockReviews);
  const [likes, setLikes] = useState<number[]>([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const toggleLike = (id: number) => {
    setLikes((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !comment.trim()) return;

    const newReview: Review = {
      id: reviews.length + 1,
      user: "You",
      avatar: "https://i.pravatar.cc/100?img=15",
      rating,
      comment,
    };

    setReviews([newReview, ...reviews]);
    setRating(0);
    setComment("");
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      {/* User Header */}
      <div className="card bg-base-100 shadow-xl p-6 flex items-center gap-6">
        <img
          src={mockUser.avatar}
          alt={mockUser.name}
          className="w-20 h-20 rounded-full ring ring-primary ring-offset-2"
        />
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{mockUser.name}</h1>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex text-yellow-500">
              {Array.from({ length: 5 }).map((_, i) =>
                i < Math.round(mockUser.avgRating) ? (
                  <FaStar key={i} />
                ) : (
                  <FaRegStar key={i} />
                )
              )}
            </div>
            <span className="text-sm text-gray-500">
              {mockUser.avgRating.toFixed(1)} · {mockUser.totalReviews} reviews
            </span>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">User Reviews</h2>
        <div className="space-y-4">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="card bg-base-200 shadow-sm p-5 flex gap-4"
            >
              <img
                src={r.avatar}
                alt={r.user}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">{r.user}</h4>
                  <button
                    onClick={() => toggleLike(r.id)}
                    className="btn btn-ghost btn-xs"
                  >
                    {likes.includes(r.id) ? (
                      <FaHeart className="text-red-500" />
                    ) : (
                      <FaRegHeart />
                    )}
                  </button>
                </div>
                <div className="flex text-yellow-500 mt-1">
                  {Array.from({ length: 5 }).map((_, i) =>
                    i < r.rating ? <FaStar key={i} /> : <FaRegStar key={i} />
                  )}
                </div>
                <p className="mt-2 text-gray-700">{r.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Form */}
      <div className="card bg-base-100 shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Leave a Review</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating */}
          <div className="flex gap-2 text-yellow-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                type="button"
                key={i}
                onClick={() => setRating(i + 1)}
                className="hover:scale-110 transition-transform"
              >
                {i < rating ? <FaStar /> : <FaRegStar />}
              </button>
            ))}
          </div>

          {/* Comment */}
          <textarea
            className="textarea textarea-bordered w-full"
            rows={3}
            placeholder="Write your feedback..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button type="submit" className="btn btn-primary w-full">
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
}
