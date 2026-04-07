import { ChevronRight, Star } from "lucide-react";
import { Autoplay, Navigation, Pagination, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import FeedbackCard, { type GoogleReview } from "./feedback-card";
import { usePage } from "@inertiajs/react";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function Feedback() {
    const { props } = usePage<{ reviews?: GoogleReview[]; googleWriteReviewUrl?: string | null }>();
    const reviews = Array.isArray(props.reviews) ? props.reviews : [];
    const googleWriteReviewUrl = typeof props.googleWriteReviewUrl === 'string' ? props.googleWriteReviewUrl : null;

    const avgRating = reviews.length
        ? Math.round((reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / reviews.length) * 10) / 10
        : null;

    if (!reviews.length) return null;

    return (
        <div className="px-6 pb-18 md:pb-14 lg:pb-20">
            <div className="container mx-auto px-6">
                <div className="mt-5">
                    <h2 className="mb-6 text-center font-ubuntu text-[44px] font-light text-slate-900">
                        What our clients say
                    </h2>
                </div>
                <div className="flex flex-col gap-6">
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:justify-between">
                        <div className="mb-2 flex items-center gap-2">
                            <img
                                src="/assets/images/blog/google.png"
                                alt="Google"
                                className="h-12 w-12 object-cover sm:h-20 sm:w-20"
                            />
                            <div>
                                <p className="font-ubuntu text-sm">
                                    Google Rating
                                </p>
                                <div className="flex items-center gap-0.5">
                                    <span className="font-ubuntu text-base font-bold">
                                        {avgRating ?? '—'}
                                    </span>
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={[
                                                    "h-4 w-4",
                                                    avgRating !== null && star <= Math.round(avgRating) ? "fill-yellow-400 text-yellow-400" : "fill-transparent text-gray-300",
                                                ].join(" ")}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p className="font-ubuntu text-sm text-slate-600">
                                    (Based on {reviews.length} reviews)
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 lg:flex">
                            {googleWriteReviewUrl ? (
                                <a
                                    href={googleWriteReviewUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center gap-3 rounded-full bg-blue-600 py-2 pr-2 pl-5 transition-all hover:bg-blue-700 hover:shadow-lg"
                                >
                                    <span className="flex flex-col font-ubuntu text-xl leading-tight font-semibold text-white">
                                        Write a Review
                                    </span>
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 transition-colors group-hover:bg-white/30">
                                        <ChevronRight className="h-4 w-4 text-white transition-transform group-hover:translate-x-0.5" />
                                    </span>
                                </a>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
            <div className="relative">
                <Swiper
                    modules={[Navigation, Pagination, Scrollbar, Autoplay]}
                    spaceBetween={20}
                    slidesPerView={1}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    navigation={{
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    }}
                    pagination={{
                        clickable: true,
                        el: '.swiper-pagination',
                    }}
                    scrollbar={{
                        draggable: true,
                        el: '.swiper-scrollbar',
                    }}
                    breakpoints={{
                        640: {
                            slidesPerView: 2,
                            spaceBetween: 20,
                        },
                        768: {
                            slidesPerView: 3,
                            spaceBetween: 20,
                        },
                        1024: {
                            slidesPerView: 4,
                            spaceBetween: 20,
                        },
                        1280: {
                            slidesPerView: 4,
                            spaceBetween: 20,
                        },
                    }}
                    className="feedback-swiper pb-16"
                >
                    {reviews.slice(0, 12).map((review, index) => (
                        <SwiperSlide key={`${review.author_name ?? 'review'}-${index}`}>
                            <FeedbackCard review={review} />
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Swiper Navigation */}
                {/* <div className="swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 text-gray-600 hover:text-primary-600"></div>
                        <div className="swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 z-10 text-gray-600 hover:text-primary-600"></div> */}

                {/* Swiper Pagination */}
                <div className="swiper-pagination absolute right-0 -bottom-10! left-0 z-10"></div>

                {/* Swiper Scrollbar */}
                <div className="swiper-scrollbar absolute right-0 bottom-0 left-0 z-10"></div>
            </div>
        </div>
    );
}
