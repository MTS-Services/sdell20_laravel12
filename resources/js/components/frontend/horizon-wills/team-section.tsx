import React from "react";

export function TeamSection() {
    return (
        <section className="relative overflow-hidden py-20 lg:py-28">
            {/* Background image */}
            <div
                className="absolute inset-0 -z-20 bg-center bg-cover"
                style={{
                    backgroundImage:
                        "url('https://heirkinestateplanning.co.uk/wp-content/themes/Heirkin/assets/images/testimonial-bg.png')",
                }}
            />

            <div className="mx-auto max-w-7xl px-6">
                <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                    {/* Left content */}
                    <div className="text-white">
                        <h2 className="font-sans text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
                            What <br />
                            people say <br />
                            about us
                        </h2>

                        <p className="mt-8 max-w-md text-base leading-7 text-white/80 sm:text-lg">
                            Hear from our happy customers — real stories of trust, satisfaction,
                            and exceptional service experiences.
                        </p>
                    </div>

                    {/* Right testimonial card */}
                    <div className="lg:flex lg:justify-end">
                        <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-black/30 p-8 shadow-2xl backdrop-blur-md sm:p-10">
                            {/* Quote icon */}
                            <div className="mb-6 text-white/70">
                                <svg
                                    width="56"
                                    height="56"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="opacity-70"
                                    aria-hidden="true"
                                >
                                    <path d="M7.17 6.17A5 5 0 0 1 12 11v7H5v-6.5C5 9.01 5.9 7.12 7.17 6.17z" />
                                    <path d="M16.17 6.17A5 5 0 0 1 21 11v7h-7v-6.5c0-2.49.9-4.38 2.17-5.33z" />
                                </svg>
                            </div>

                            {/* Testimonial text */}
                            <p className="text-base leading-8 text-white/85 sm:text-lg">
                                thought doing my will myself would be simple, but I ended up
                                completely stuck and worried I’d make mistakes. Heirkin Estate
                                Planning took over and explained everything clearly during the home
                                visit. They sorted it all properly and I finally have peace of mind.
                            </p>

                            {/* Name */}
                            <div className="mt-8 font-sans text-base font-semibold text-white">
                                Samantha S.
                            </div>

                            {/* Slider dots (static UI like screenshot) */}
                            <div className="mt-10 flex items-center justify-center gap-3">
                                <span className="h-2 w-2 rounded-full bg-white/35" />
                                <span className="h-2 w-2 rounded-full bg-white/35" />
                                <span className="h-2 w-2 rounded-full bg-white/35" />
                                <span className="h-2 w-2 rounded-full bg-white/35" />
                                <span className="h-2 w-2 rounded-full bg-white/35" />
                                {/* active */}
                                <span className="h-2 w-10 rounded-full bg-white/80" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
