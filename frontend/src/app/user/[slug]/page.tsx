import Image from "next/image";
import { FaStar, FaRegStar, FaUserCircle, FaAward } from "react-icons/fa";
import { Metadata } from "next";
import ReviewForm from "@/components/user/ReviewForm";
import axiosInstance from "@/axiosInstance/axiosInstance";

export const metadata: Metadata = {
  title: "صفحة المستخدم",
  description: "صفحة المستخدم",
};

type Review = {
  id: number;
  user: string;
  avatar: string;
  rating: number;
  comment: string;
  date?: string;
};

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) =>
        i < rating ? (
          <FaStar key={i} className="text-warning" />
        ) : (
          <FaRegStar key={i} className="text-warning opacity-30" />
        )
      )}
    </div>
  );
};

export default async function UserProfile({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { user, reviews } = await axiosInstance
    .get(`/users/profile/${slug}`)
    .then((res) => res.data);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto py-8 px-4 space-y-8">
        {/* Hero Card - Profile Header */}
        <div className="card bg-gradient-to-br from-primary to-secondary text-primary-content shadow-2xl">
          <div className="card-body items-center text-center p-8 md:p-12">
            <div className="avatar online placeholder mb-4">
              <div className="w-32 rounded-full ring ring-primary-content ring-offset-base-100 ring-offset-4">
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={128}
                  height={128}
                  className="rounded-full object-cover"
                />
              </div>
            </div>

            <h1 className="card-title text-4xl md:text-5xl font-bold mb-2">
              {user.name}
            </h1>

            <div className="flex items-center text-2xl gap-2 mb-4">
              <StarRating rating={Math.round(user.avgRating)} />
              <span className="text-xl font-semibold">
                {user.avgRating.toFixed(1)}
              </span>
            </div>

            <div className="badge badge-lg badge-ghost">
              <FaUserCircle className="ml-2" />
              {user.totalReviews} تقييمات
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
            <div className="card-body items-center text-center">
              <div className="text-5xl font-bold text-primary">
                {user.totalReviews}
              </div>
              <p className="text-base-content/70 font-medium">عدد التقييمات</p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
            <div className="card-body items-center text-center">
              <div className="text-5xl font-bold text-warning">
                {user.avgRating.toFixed(1)}
              </div>
              <p className="text-base-content/70 font-medium">متوسط التقييم</p>
            </div>
          </div>

          {false && (
            <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
              <div className="card-body items-center text-center">
                <FaAward className="text-5xl text-accent mb-2" />
                <p className="text-base-content/70 font-medium">عضو موثوق</p>
              </div>
            </div>
          )}
        </div>

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-3xl font-bold mb-6 flex items-center justify-between">
                <span>التقييمات</span>
                <div className="badge badge-primary badge-lg">{reviews}</div>
              </h2>

              <div className="space-y-4">
                {reviews.map(
                  ({ id, user, avatar, date, rating, comment }: Review) => (
                    <div
                      key={id}
                      className="card bg-base-200 shadow-md hover:shadow-lg transition-all"
                    >
                      <div className="card-body p-6">
                        <div className="flex gap-4">
                          <div className="avatar">
                            <div className="relative w-14 h-14 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
                              <Image
                                src={avatar}
                                alt={user || "User avatar"}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 40px, (max-width: 1200px) 48px, 56px"
                                loading="lazy"
                              />
                            </div>
                          </div>

                          <div className="flex-1 space-y-2">
                            <div className="flex justify-between items-start flex-wrap gap-2">
                              <div>
                                <h4 className="font-bold text-lg">{user}</h4>
                                {date && (
                                  <p className="text-sm text-base-content/60">
                                    {date}
                                  </p>
                                )}
                              </div>
                              <StarRating rating={rating} />
                            </div>

                            <p className="text-base-content/80 leading-relaxed">
                              {comment}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {/* Review Form Section */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-4xl font-bold mb-4">أضف تقييمك</h2>
            <ReviewForm />
          </div>
        </div>
      </div>
    </div>
  );
}
