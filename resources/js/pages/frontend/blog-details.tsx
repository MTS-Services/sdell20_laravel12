import BlogCard from '@/components/ui/blog-card';
import FrontendLayout from '@/layouts/frontend-layout';
import { Head } from '@inertiajs/react';
import { Star } from 'lucide-react';

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
    latestBlogs: {
        data: Blog[];
    };
}

export default function BlogDetails({ blog, latestBlogs }: Props) {
    return (
        <>
            <Head>
                <title>{blog.title}</title>
                <meta name="title" content={blog.title} />
                <meta name="description" content={blog.description} />
                <meta name="keywords" content="blog, power of attorney, legal documents" />
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
                                            {new Date(blog.created_at).toLocaleDateString('en-US', { 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric' 
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
                                                __html: blog.description 
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

                                        <button className="w-full rounded-full bg-slate-500 px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-slate-600">
                                            Create your LPA now
                                        </button>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
                            {latestBlogs.data.map((latestBlog) => (
                                <BlogCard key={latestBlog.id} blog={latestBlog} />
                            ))}
                        </div>
                    </section>
                </main>
            </FrontendLayout>
        </>
    );
}
