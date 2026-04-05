import FeedbackCard from '@/components/feedback-card';
import BlogCard from '@/components/ui/blog-card';
import FrontendLayout from '@/layouts/frontend-layout';
import { Head, Link } from '@inertiajs/react';
import { ChevronRight, Star } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Navigation, Pagination, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

interface Blog {
    id: number;
    title: string;
    slug: string;
    description: string;
    image?: string | null;
    created_at: string;
}

interface Props {
    blog: Blog;
    recentBlogsFromSameCategory: {
        category: string;
        blogs: Blog[];
    };
}

export default function BlogDetails({ blog, recentBlogsFromSameCategory }: Props) {
    return (
        <>
            <Head>
                <title>{blog.title}</title>
                <meta name="title" content={blog.title} />
                <meta name="description" content={blog.description} />
                <meta
                    name="keywords"
                    content="blog, power of attorney, legal documents"
                />
            </Head>
            <FrontendLayout>
                <main className="bg-white">
                    <section className="bg-[#f8f6f0]">
                        <div className="container mx-auto px-6 py-18 md:py-14 lg:py-20">
                            <div className="flex items-start gap-10">
                                <div className="w-full lg:w-2/2">
                                    <div className="mb-10">
                                        <h2 className="text-5xl font-normal text-primary-600">
                                            {blog.title}
                                        </h2>
                                        <p className="mt-2 text-lg text-gray-600">
                                            {new Date(
                                                blog.created_at,
                                            ).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                    <div className="">
                                        {blog.image ? (
                                            <img
                                                src={`/storage/${blog.image}`}
                                                alt={blog.title}
                                                className="h-auto w-full"
                                            />
                                        ) : (
                                            <img
                                                src="/assets/images/blog/POAO_img34-1536x806.jpg"
                                                alt="Blog Image"
                                                className="h-auto w-full"
                                            />
                                        )}
                                    </div>
                                    <div className="mt-10">
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: blog.description,
                                            }}
                                            className="text-lg text-gray-600"
                                        />
                                    </div>
                                </div>
                                <div className="sticky top-60 mt-8 w-full lg:w-1/2">
                                    <div className="rounded-2xl bg-primary-700 p-8 text-white">
                                        <div className="mb-6">
                                            <div className="mb-2 flex items-center gap-2">
                                                <img
                                                    src="/assets/images/blog/google.png"
                                                    alt="Google"
                                                    className="h-20 w-20 object-cover"
                                                />
                                                <div>
                                                    <p className="text-sm">
                                                        Google Rating
                                                    </p>
                                                    <div className="flex items-center gap-0.5">
                                                        <span className="text-base font-bold">
                                                            4.4
                                                        </span>
                                                        <div className="flex">
                                                            {[
                                                                1, 2, 3, 4, 5,
                                                            ].map((star) => (
                                                                <Star
                                                                    key={star}
                                                                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <h2 className="mb-6 text-xl font-normal">
                                            Get your Lasting Power of Attorney
                                            sorted for{' '}
                                            <span className="font-bold">
                                                £99 per document
                                            </span>
                                        </h2>

                                        <ul className="mb-8 space-y-3">
                                            <li className="flex items-start gap-3">
                                                <svg
                                                    className="mt-1 h-5 w-5 shrink-0 text-green-400"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                                <span className="text-sm">
                                                    Fixed fee guarantee
                                                </span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <svg
                                                    className="mt-1 h-5 w-5 shrink-0 text-green-400"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                                <span className="text-sm">
                                                    Expert legal support
                                                </span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <svg
                                                    className="mt-1 h-5 w-5 shrink-0 text-green-400"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                                <span className="text-sm">
                                                    Simple online process
                                                </span>
                                            </li>
                                        </ul>

                                        <div className="flex items-center justify-center gap-3 lg:flex">
                                            <Link
                                                href={route('lpa.start')}
                                                className="group flex items-center gap-3 rounded-full bg-slate-500 py-2 pr-2 pl-5 transition-all hover:bg-slate-600 hover:shadow-lg"
                                            >
                                                <span className="flex flex-col leading-tight text-white">
                                                    <span className="text-xs font-bold tracking-wide xl:text-sm">
                                                        &pound;99 + VAT per LPA
                                                    </span>
                                                    <span className="text-[10px] font-normal text-white/80">
                                                        (20% VAT at checkout;
                                                        plus &pound;92 OPG fee
                                                        per LPA)
                                                    </span>
                                                </span>
                                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 transition-colors group-hover:bg-white/30">
                                                    <ChevronRight className="h-4 w-4 text-white transition-transform group-hover:translate-x-0.5" />
                                                </span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="container mx-auto px-6 py-18 md:py-14 lg:py-20">
                        <div className="mt-5">
                            <h2 className="mb-6 text-2xl font-bold text-slate-900">
                                Recent blog articles
                            </h2>
                        </div>
                        <div className="mb-8">
                            <h3 className="mb-4 text-xl font-semibold text-primary-600">
                                {/* {recentBlogsFromSameCategory.category} */}
                            </h3>
                            <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {recentBlogsFromSameCategory.blogs.map((recentBlog: Blog) => (
                                    <BlogCard
                                        key={recentBlog.id}
                                        blog={recentBlog}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>
                    <section className="px-6 pb-18 md:pb-14 lg:pb-20">
                        <div className="container mx-auto px-6">
                            <div className="mt-5">
                                <h2 className="mb-6 text-center text-4xl font-medium text-slate-900">
                                    What our clients say
                                </h2>
                            </div>
                            <div className="flex flex-col gap-6">
                                <div className="mb-6 flex justify-between gap-4">
                                    <div className="mb-2 flex items-center gap-2">
                                        <img
                                            src="/assets/images/blog/google.png"
                                            alt="Google"
                                            className="h-20 w-20 object-cover"
                                        />
                                        <div>
                                            <p className="text-sm">
                                                Google Rating
                                            </p>
                                            <div className="flex items-center gap-0.5">
                                                <span className="text-base font-bold">
                                                    4.4
                                                </span>
                                                <div className="flex">
                                                    {[1, 2, 3, 4, 5].map(
                                                        (star) => (
                                                            <Star
                                                                key={star}
                                                                className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                                            />
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-sm text-slate-600">
                                                (Based on 100+ reviews)
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center gap-3 lg:flex">
                                        <Link
                                            href="#"
                                            className="group flex items-center gap-3 rounded-full bg-slate-500 py-2 pr-2 pl-5 transition-all hover:bg-slate-600 hover:shadow-lg"
                                        >
                                            <span className="flex flex-col leading-tight text-white text-xl font-semibold">
                                                Write a Review
                                            </span>
                                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 transition-colors group-hover:bg-white/30">
                                                <ChevronRight className="h-4 w-4 text-white transition-transform group-hover:translate-x-0.5" />
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                        <Swiper
                            modules={[
                                Navigation,
                                Pagination,
                                Scrollbar,
                                Autoplay,
                            ]}
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
                            {[...Array(12)].map((_, index) => (
                                <SwiperSlide key={index}>
                                    <FeedbackCard />
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {/* Swiper Navigation */}
                        {/* <div className="swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 text-gray-600 hover:text-primary-600"></div>
                        <div className="swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 z-10 text-gray-600 hover:text-primary-600"></div> */}

                        {/* Swiper Pagination */}
                        <div className="swiper-pagination absolute -bottom-10! left-0 right-0 z-10"></div>

                        {/* Swiper Scrollbar */}
                        <div className="swiper-scrollbar absolute bottom-0 left-0 right-0 z-10"></div>
                    </div>
                    </section>
                </main>
            </FrontendLayout>
        </>
    );
}
