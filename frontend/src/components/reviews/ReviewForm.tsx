"use client";
import { useState } from "react";
import useCreateReview from "@/hooks/reviews/createReview";
import { FaStar, FaRegStar, FaPaperPlane, FaEdit } from "react-icons/fa";

export default function ReviewForm({ slug }: { slug: string }) {
  const { mutate: createReview } = useCreateReview();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createReview({ slug , rating , comment})
  }

  const ratingLabels = ["سيء جداً", "سيء", "مقبول", "جيد", "ممتاز"];

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Rating Section */}
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-base-content">
            كيف كانت تجربتك؟
          </h3>

          <div className="card bg-gradient-to-br from-base-200 to-base-300 shadow-xl border border-base-300">
            <div className="card-body items-center py-10">
              {/* Star Rating */}
              <div className="flex gap-4">
                {Array.from({ length: 5 }, (_, i) => {
                  const starValue = i + 1;
                  const isFilled = starValue <= (hoveredRating || rating);

                  return (
                    <button
                      key={starValue}
                      type="button"
                      onClick={() => setRating(starValue)}
                      onMouseEnter={() => setHoveredRating(starValue)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className={`text-3xl sm:text-5xl transition-all duration-300 transform ${
                        isFilled
                          ? "text-warning scale-125 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                          : "text-base-content/15 hover:text-warning/60 hover:scale-110"
                      }`}
                    >
                      {isFilled ? <FaStar /> : <FaRegStar />}
                    </button>
                  );
                })}
              </div>

              {/* Rating Label */}
              {(hoveredRating || rating) > 0 && (
                <div className="mt-6 animate-[fadeIn_0.2s_ease-out]">
                  <div className="badge badge-warning badge-lg px-6 py-4 text-base font-bold shadow-lg">
                    {ratingLabels[(hoveredRating || rating) - 1]}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Comment Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-base-content flex items-center gap-2">
              <FaEdit className="text-primary" />
              شاركنا رأيك
            </h3>
            <span className="text-sm text-base-content/60 font-medium">
              {comment.length}/500 حرف
            </span>
          </div>

          <div className="card bg-base-100 shadow-xl border-2 border-base-300 hover:border-primary transition-colors duration-300">
            <div className="card-body p-0">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value.slice(0, 500))}
                placeholder="أخبرنا بالتفصيل عن تجربتك... ما الذي أعجبك؟ وما يمكن تحسينه؟
                
سيساعد تعليقك الآخرين في اتخاذ قرار أفضل 💬"
                className="textarea text-base w-full leading-relaxed min-h-[160px] focus:outline-none text-base-content p-6"
                rows={6}
              />
            </div>
          </div>

          <p className="text-base text-base-content/50 pr-2">
            💡 نصيحة: التقييمات التفصيلية تكون أكثر فائدة للآخرين
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`btn btn-lg w-full gap-3 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 ${
            rating === 0 ? "btn-disabled" : "btn-primary hover:scale-[1.02]"
          }`}
          disabled={rating === 0}
        >
          <FaPaperPlane className="text-xl" />
          نشر التقييم
        </button>

        {/* Info Alert */}
        <div className="alert bg-info/10 border border-info/30">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-info shrink-0 w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-sm text-info-content/90">
            تقييمك سيظهر للجميع ويساهم في بناء مجتمع موثوق وشفاف
          </span>
        </div>
      </form>
    </div>
  );
}
