import { useState, useRef } from "react";
import BlogCard from "@/components/ui/blog-card";

interface Blog {
    id: number;
    title: string;
    slug: string;
    description: string;
    image?: string | null;
    created_at: string;
}

interface BlogSectionProps {
    blogs: Blog[];
    categoryTitle?: string;
    perPage?: number;
    total?: number;
}

export default function BlogSection({ blogs, categoryTitle, perPage = 12, total }: BlogSectionProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const sectionRef = useRef<HTMLElement>(null);

    const lastPage = Math.ceil(blogs.length / perPage);
    const offset = (currentPage - 1) * perPage;
    const paginatedBlogs = blogs.slice(offset, offset + perPage);
    const hasNext = currentPage < lastPage;
    const hasPrev = currentPage > 1;

    const changePage = (newPage: number) => {
        setCurrentPage(newPage);
        setTimeout(() => {
            sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 50);
    };

    return (
        <section ref={sectionRef} className="container mx-auto px-6 pb-18 md:pb-14 lg:pb-20 scroll-mt-24">
            <div className="mb-10">
                <h2 className="text-[28px] font-ubuntu font-light text-primary-600">
                    {categoryTitle || 'Blogs'}
                </h2>
                <p className="mt-2 text-sm text-gray-600 font-ubuntu">
                    Showing {offset + 1}–{Math.min(offset + perPage, blogs.length)} of {blogs.length} blogs
                </p>
            </div>

            <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {paginatedBlogs.map((blog) => (
                    <BlogCard key={blog.id} blog={blog} />
                ))}
            </div>

            {lastPage > 1 && (
                <div className="mt-8 flex justify-center items-center space-x-2">
                    <button
                        onClick={() => changePage(currentPage - 1)}
                        disabled={!hasPrev}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border cursor-pointer border-gray-300 rounded-md hover:bg-gray-50 font-ubuntu disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>

                    <span className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md font-ubuntu">
                        Page {currentPage} of {lastPage}
                    </span>

                    <button
                        onClick={() => changePage(currentPage + 1)}
                        disabled={!hasNext}
                        className="px-3 py-2 text-sm font-medium text-white bg-blue-600 border cursor-pointer border-transparent rounded-md hover:bg-blue-700 font-ubuntu disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            )}
        </section>
    );
}
