import Feedback from '@/components/feedback';
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
                            <div className="flex flex-col items-start gap-10 lg:flex-row">
                                <div className="w-full lg:w-2/2">
                                    <div className="mb-10">
                                        <h2 className="text-[44px] font-ubuntu font-light text-primary-600">
                                            {blog.title}
                                        </h2>
                                        <p className="mt-2 text-lg font-ubuntu text-gray-600">
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
                                            className="text-lg font-ubuntu text-gray-600"
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
                                                    <p className="text-sm font-ubuntu">
                                                        Google Rating
                                                    </p>
                                                    <div className="flex items-center gap-0.5">
                                                        <span className="text-base font-bold font-ubuntu">
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

                                        <h2 className="mb-6 text-xl font-normal font-ubuntu">
                                            Get your Lasting Power of Attorney
                                            sorted for{' '}
                                            <span className="font-bold">
                                                £99 per document
                                            </span>
                                        </h2>

                                        <ul className="mb-8 space-y-3">
                                            <li className="flex items-center gap-3">
                                                <svg
                                                    className="mt-1 h-6 w-6 shrink-0 rounded-full bg-white text-[#04194e]"
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
                                                <span className="text-sm font-ubuntu">
                                                    Fixed fee guarantee
                                                </span>
                                            </li>
                                            <li className="flex items-center gap-3">
                                                <svg
                                                    className="mt-1 h-6 w-6 shrink-0 rounded-full bg-white text-[#04194e]"
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
                                                <span className="text-sm font-ubuntu">
                                                    Expert legal support
                                                </span>
                                            </li>
                                            <li className="flex items-center gap-3">
                                                <svg
                                                    className="mt-1 h-6 w-6 shrink-0 rounded-full bg-white text-[#04194e]"
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
                                                <span className="text-sm font-ubuntu">
                                                    Quick & easy process
                                                </span>
                                            </li>
                                        </ul>

                                        <div className="flex items-center justify-center gap-3 lg:flex">
                                            <Link
                                                href={route('lpa.start')}
                                                className="group flex items-center gap-3 rounded-full bg-blue-600 py-2 pl-5 pr-2 transition-all hover:bg-blue-700 hover:shadow-lg"
                                            >
                                                <span className="flex flex-col leading-tight text-white font-ubuntu">
                                                    <span className="text-xs font-ubuntu">
                                                        £99 + VAT per LPA
                                                    </span>
                                                    <span className="text-[10px] font-normal text-white/80 font-ubuntu">
                                                        (20% VAT at checkout; plus £92 OPG fee per LPA)
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
                            <h2 className="mb-6 text-3xl font-ubuntu font-light text-slate-900">
                                Recent blog articles
                            </h2>
                        </div>
                        <div className="mb-8">
                            <h3 className="mb-4 text-xl font-semibold text-primary-600 font-ubuntu">
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
                    <section>
                        <Feedback />
                    </section>
                </main>
            </FrontendLayout>
        </>
    );
}
