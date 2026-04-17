import { ChevronRight, Star } from "lucide-react";
import { Autoplay, Navigation, Pagination, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import FeedbackCard, { type GoogleReview } from "./feedback-card";
import { usePage } from "@inertiajs/react";
import { useMemo } from "react";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const dummyGoogleReviews: GoogleReview[] = [
    {
        author_name: 'Suzy Watson',
        profile_photo_url: '/assets/images/review/1.jpg',
        rating: 5,
        relative_time_description: '2 days ago',
        text: 'Found application for the Power of Attorney Online clear and easy to follow with step by step instructions for every section required.',
    },
    {
        author_name: 'Daniel Carter',
        profile_photo_url: '/assets/images/review/2.jpg',
        rating: 5,
        relative_time_description: '3 days ago',
        text: 'Great support team and quick responses whenever I needed help.',
    },
    {
        author_name: 'Catherine Mythen',
        profile_photo_url: '/assets/images/review/3.jpg',
        rating: 5,
        relative_time_description: '4 days ago',
        text: 'Absolutely fantastic. A patient sense of calm even when I messed up the forms with names. One fixed price with peace of mind that documents are correct before printing off.',
    },
    {
        author_name: 'James Walker',
        profile_photo_url: '/assets/images/review/4.jpg',
        rating: 4,
        relative_time_description: '1 week ago',
        text: 'Easy online journey and no hidden costs. Exactly what I needed.',
    },
    {
        author_name: 'Clair McCarthy',
        rating: 5,
        profile_photo_url: '/assets/images/review/5.jpg',
        relative_time_description: '2 weeks ago',
        text: 'Highly recommend.',
    },
    {
        author_name: 'Noah Robinson',
        rating: 5,
        profile_photo_url: '/assets/images/review/6.jpg',
        relative_time_description: '2 weeks ago',
        text: 'Professional and reliable service. I felt supported the whole way through.',
    },
    {
        author_name: 'Osean G Stewart',
        rating: 5,
        relative_time_description: '1 month ago',
        profile_photo_url: '/assets/images/review/7.jpg',
        text: 'The process is clear and easy to follow. Support is there from day 1 and they answer questions quickly — great value for money.',
    },
    {
        author_name: 'Amelia Price',
        rating: 5,
        profile_photo_url: '/assets/images/review/8.jpg',
        relative_time_description: '1 month ago',
        text: 'The step-by-step guidance made the paperwork much less stressful.',
    },
    {
        author_name: 'Angelica Nina',
        rating: 5,
        profile_photo_url: '/assets/images/review/9.jpg',
        relative_time_description: '1 month ago',
        text: 'Simple, straightforward and very professional service. The step-by-step guidance made everything much less stressful.',
    },
    {
        author_name: 'Ethan Morgan',
        rating: 5,
        profile_photo_url: '/assets/images/review/10.jpg',
        relative_time_description: '1 month ago',
        text: 'Fast, affordable, and straightforward. Would definitely recommend.',
    },
    {
        author_name: 'Grace Turner',
        profile_photo_url: '/assets/images/review/11.jpg',
        rating: 5,
        relative_time_description: '1 month ago',
        text: 'Everything was explained in plain language and was easy to complete.',
    },
    {
        author_name: 'Henry Adams',
        profile_photo_url: '/assets/images/review/12.jpg',
        rating: 5,
        relative_time_description: '1 month ago',
        text: 'Clear instructions and excellent communication from start to finish.',
    },
    {
        author_name: 'Mia Collins',
        profile_photo_url: '/assets/images/review/13.jpg',
        rating: 5,
        relative_time_description: '2 months ago',
        text: 'The online form was simple and saved me a lot of time.',
    },
    {
        author_name: 'Lucas Foster',
        profile_photo_url: '/assets/images/review/14.jpg',
        rating: 5,
        relative_time_description: '2 months ago',
        text: 'Very good value for money and easy to understand steps.',
    },
    {
        author_name: 'Ella Palmer',
        profile_photo_url: '/assets/images/review/15.jpg',
        rating: 5,
        relative_time_description: '2 months ago',
        text: 'Fantastic service. Helpful team and no unnecessary confusion.',
    },
    {
        author_name: 'Jack Stewart',
        profile_photo_url: '/assets/images/review/16.jpg',
        rating: 5,
        relative_time_description: '2 months ago',
        text: 'Quick process and very professional support throughout.',
    },
    {
        author_name: 'Ava Richardson',
        profile_photo_url: '/assets/images/review/17.jpg',
        rating: 5,
        relative_time_description: '2 months ago',
        text: 'Made a complicated task feel manageable. Highly satisfied.',
    },
    {
        author_name: 'George Bailey',
        profile_photo_url: '/assets/images/review/18.jpg',
        rating: 4,
        relative_time_description: '2 months ago',
        text: 'Reliable platform and useful reminders along the way.',
    },
    {
        author_name: 'Lily Brooks',
        profile_photo_url: '/assets/images/review/19.jpg',
        rating: 5,
        relative_time_description: '2 months ago',
        text: 'Support team answered my questions quickly and clearly.',
    },
    {
        author_name: 'Samuel Ward',
        profile_photo_url: '/assets/images/review/20.jpg',
        rating: 5,
        relative_time_description: '3 months ago',
        text: 'Great service and simple process. Would use again.',
    },
    {
        author_name: 'Freya Gibson',
        profile_photo_url: '/assets/images/review/21.jpg',
        rating: 5,
        relative_time_description: '3 months ago',
        text: 'Very impressed with how easy everything was to complete online.',
    },
    {
        author_name: 'Benjamin Ellis',
        profile_photo_url: '/assets/images/review/22.jpg',
        rating: 4,
        relative_time_description: '3 months ago',
        text: 'Straightforward process and fair pricing.',
    },
    {
        author_name: 'Isla Murphy',
        profile_photo_url: '/assets/images/review/23.jpg',
        rating: 5,
        relative_time_description: '3 months ago',
        text: 'Helpful, polite, and very responsive team.',
    },
    {
        author_name: 'William Perry',
        profile_photo_url: '/assets/images/review/24.jpg',
        rating: 5,
        relative_time_description: '3 months ago',
        text: 'The step-by-step flow made it easy to avoid mistakes.',
    },
    {
        author_name: 'Ruby Fisher',
        profile_photo_url: '/assets/images/review/25.jpg',
        rating: 5,
        relative_time_description: '3 months ago',
        text: 'Excellent experience from start to finish.',
    },
    {
        author_name: 'Thomas Gray',
        profile_photo_url: '/assets/images/review/26.jpg',
        rating: 5,
        relative_time_description: '3 months ago',
        text: 'Easy to use and very clear at each stage.',
    },
    {
        author_name: 'Hannah Coleman',
        profile_photo_url: '/assets/images/review/27.jpg',
        rating: 5,
        relative_time_description: '4 months ago',
        text: 'Professional service with clear and helpful guidance.',
    },
    {
        author_name: 'Oliver Knight',
        profile_photo_url: '/assets/images/review/28.jpg',
        rating: 5,
        relative_time_description: '4 months ago',
        text: 'Great user experience and fast turnaround.',
    },
    {
        author_name: 'Zoe Lawson',
        profile_photo_url: '/assets/images/review/29.jpg',
        rating: 5,
        relative_time_description: '4 months ago',
        text: 'Everything was smooth and stress free.',
    },
    {
        author_name: 'Leo Spencer',
        profile_photo_url: '/assets/images/review/30.jpg',
        rating: 5,
        relative_time_description: '4 months ago',
        text: 'Simple process and good communication throughout.',
    },
];

export default function Feedback() {
    const { props } = usePage<{ reviews?: GoogleReview[]; googleWriteReviewUrl?: string | null }>();
    const reviews = Array.isArray(props.reviews) ? props.reviews : [];
    const googleWriteReviewUrl = typeof props.googleWriteReviewUrl === 'string' ? props.googleWriteReviewUrl : null;

    const visibleReviews = reviews.length ? reviews : dummyGoogleReviews;

    const avgRating = visibleReviews.length
        ? Math.round((visibleReviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / visibleReviews.length) * 10) / 10
        : null;
    const randomizedVisibleReviews = useMemo(() => {
        const shuffled = [...visibleReviews];
        for (let i = shuffled.length - 1; i > 0; i -= 1) {
            const randomIndex = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
        }
        return shuffled;
    }, [visibleReviews]);

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
                                    (Based on {visibleReviews.length} reviews)
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
                    {randomizedVisibleReviews.slice(0, 30).map((review, index) => (
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
