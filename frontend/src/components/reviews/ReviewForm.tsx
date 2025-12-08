"use client";
import { useState } from "react";
import useCreateReview from "@/hooks/reviews/createReview";
import {
  FaStar,
  FaRegStar,
  FaPaperPlane,
  FaEdit,
  FaLock,
  FaUserCheck,
  FaInfoCircle,
} from "react-icons/fa";
import useAuth from "@/store/useAuth";
import { toast } from "sonner";

export default function ReviewForm({ slug }: { slug: string }) {
  const user = useAuth((state) => state.user);
  const { mutate: createReview } = useCreateReview();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");

  // Check if user can review
  const isOwnProfile = user && user.slug === slug;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error("الرجاء تسجيل الدخول للمراجعة");
    if (user.slug === slug) return toast.error("لا يمكنك مراجعة نفسك");
    createReview({ slug, rating, comment });
    setRating(0);
    setHoveredRating(0);
    setComment("");
  };

  const ratingLabels = ["سيء جداً", "سيء", "مقبول", "جيد", "ممتاز"];

  // Show message for unauthorized users
  if (!user) {
    return (
      <div className="card shadow-xl border border-base-300">
        <div className="card-body items-center text-center py-12">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <FaLock className="text-4xl text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-base-content mb-2">
            سجل الدخول لكتابة تقييم
          </h3>
          <p className="text-base-content/70 mb-6 max-w-md">
            يجب عليك تسجيل الدخول أولاً لتتمكن من مشاركة تجربتك وتقييم الخدمة
          </p>
          <button className="btn btn-primary btn-lg gap-2">
            <FaLock />
            تسجيل الدخول
          </button>
        </div>
      </div>
    );
  }

  // Show message for own profile
  if (isOwnProfile) {
    return (
      <div className="card bg-gradient-to-br from-warning/5 to-warning/10 shadow-xl border border-warning/30">
        <div className="card-body items-center text-center py-12">
          <div className="w-20 h-20 rounded-full bg-warning/20 flex items-center justify-center mb-4">
            <FaUserCheck className="text-4xl text-warning" />
          </div>
          <h3 className="text-2xl font-bold text-base-content mb-2">
            لا يمكنك تقييم ملفك الشخصي
          </h3>
          <p className="text-base-content/70 max-w-md">
            التقييمات مخصصة لتقييم تجارب الآخرين معك، ولا يمكنك تقييم نفسك
          </p>
        </div>
      </div>
    );
  }

  // Show review form for authorized users
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
        <div className="alert bg-info/70">
          <FaInfoCircle className="text-info-content" size={18} />
          <span className="text-info-content">
            تقييمك سيظهر للجميع ويساهم في بناء مجتمع موثوق وشفاف
          </span>
        </div>
      </form>
    </div>
  );
}
