export function BlogHeroSection() {
    return (
        <section className="relative isolate overflow-hidden">
            <img
                src="/assets/images/blog/blog.jpg"
                alt="Family"
                className="absolute inset-0 -z-20 h-full w-full object-cover object-right"
                loading="lazy"
            />

            <div className="absolute inset-0 -z-10 bg-primary-800/75" />
            <div className="absolute inset-0 -z-10 bg-linear-to-r from-primary-900/70 via-primary-800/65 to-transparent" />

            <div className="container mx-auto px-6">
                <div className="flex min-h-90 items-center py-16 md:min-h-105 md:py-20">
                    <div className="animate-fadeInUp space-y-5">
                        <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
                            Lasting Power of Attorney Blogs
                        </h1>
                        <h3 className="text-4xl font-normal tracking-tight text-white">
                            Expert Lasting Power of Attorney Blogs You Can Trust
                        </h3>
                        <p className="text-base font-semibold leading-relaxed text-white/85">
                            Our Lasting Power of Attorney Blogs provide clear,
                            practical guidance written by LPA specialists. Each
                            article focuses on real world issues, common
                            mistakes and what families need to know to avoid
                            delays and problems with registration.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
