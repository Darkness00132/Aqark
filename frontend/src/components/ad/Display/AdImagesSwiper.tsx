"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type Props = {
  images: { url: string }[];
  alt: string;
};

export default function AdImagesSwiper({ images, alt }: Props) {
  if (!images || images.length === 0) return null;

  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      navigation
      pagination={{ clickable: true }}
      loop={images.length > 1}
      autoplay={{
        delay: 2000,
        disableOnInteraction: true,
        pauseOnMouseEnter: true,
      }}
      className="w-full aspect-[4/3] sm:aspect-[16/9] rounded-2xl overflow-hidden"
    >
      {images.map((img, idx) => (
        <SwiperSlide key={idx}>
          <div className="relative w-full h-full">
            <Image
              src={img.url}
              alt={alt}
              fill
              priority={idx === 0}
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 800px, 1200px"
              className="object-cover object-center"
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
