import Image from "next/image";
import Link from "next/link";
import { FiMapPin, FiHome } from "react-icons/fi";

type Ad = {
  id: string;
  title: string;
  price: number;
  city: string;
  area: string;
  propertyType: string;
  type: "تمليك" | "ايجار";
  imageUrl: string;
};

const mockAds: Ad[] = [
  {
    id: "1",
    title: "شقة 3 غرف للبيع في مدينة نصر بالقرب من الجامعة",
    price: 1500000,
    city: "القاهرة",
    area: "مدينة نصر",
    propertyType: "شقة",
    type: "تمليك",
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
  },
  {
    id: "2",
    title: "فيلا للإيجار في الشيخ زايد بحديقة خاصة",
    price: 25000,
    city: "الجيزة",
    area: "الشيخ زايد",
    propertyType: "فيلا",
    type: "ايجار",
    imageUrl:
      "https://images.unsplash.com/photo-1605276373954-0c4a4e4b7a53?w=800",
  },
];

export default function MyAds() {
  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {mockAds.map((ad) => (
        <div
          key={ad.id}
          className="card bg-base-100 shadow-xl hover:shadow-2xl transition rounded-2xl border border-base-300"
        >
          {/* Image */}
          <figure className="relative w-full h-48">
            <Image
              src={ad.imageUrl}
              alt={ad.title}
              fill
              className="object-cover rounded-t-2xl"
            />
            <span className="absolute top-2 left-2 badge badge-secondary px-3 py-2 rounded-xl text-sm">
              {ad.type}
            </span>
          </figure>

          {/* Content */}
          <div className="card-body p-4 space-y-3">
            <h2 className="card-title text-lg line-clamp-2">{ad.title}</h2>

            <p className="text-primary font-bold text-xl">
              {ad.price.toLocaleString()} EGP
            </p>

            <div className="flex items-center text-sm text-gray-500 gap-2">
              <FiMapPin className="text-secondary" />
              {ad.city} - {ad.area}
            </div>

            <div className="flex items-center text-sm text-gray-500 gap-2">
              <FiHome className="text-secondary" />
              {ad.propertyType}
            </div>

            <div className="card-actions justify-end mt-3">
              <Link href={`/ads/${ad.id}`} className="btn btn-primary">
                عرض التفاصيل
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
