import BlogCard from "@/components/ui/blog-card";

export default function BlogSection() {
    return (
        <section className="container mx-auto px-6 py-18 md:py-14 lg:py-20">
            <div className="mb-10">
                <h2 className="text-3xl font-semibold text-primary-600">
                    Latest Power of Attorney Blogs
                </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
                <BlogCard />
                <BlogCard />
                <BlogCard />
                <BlogCard />
                <BlogCard />
                <BlogCard />
                <BlogCard />
                <BlogCard />
                <BlogCard />
                <BlogCard />
                <BlogCard />
                <BlogCard />
                <BlogCard />
                <BlogCard />
                <BlogCard />
                <BlogCard />
                <BlogCard />
            </div>
        </section>
    );
}
