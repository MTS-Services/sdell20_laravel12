import React from "react";

import { useScrollReveal } from '@/hooks/use-scroll-reveal';

export function WhyCreateWillSection() {
    const sectionRef = useScrollReveal<HTMLElement>();

    return (
        <section ref={sectionRef} className="py-24 bg-white ">
            <div className="container mx-auto px-6">
                <div
                    className="text-center mb-16 space-y-4"
                    data-animate
                    data-animate-direction="down"
                >
                    <h2 className="text-5xl md:text-6xl font-serif font-bold z-50 text-primary-900">
                        Why Should You Create A Will?
                    </h2>
                    <p className="text-xl text-slate-700 max-w-2xl mx-auto font-body">
                        Protect what matters most and ensure your wishes are honored
                    </p>
                </div>

                <div
                    className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
                    data-animate
                    data-animate-direction="up"
                    data-animate-delay="0.1s"
                >
                    {/* Reason 1 */}
                    <div className="feature-card bg-linear-to-br from-pink-50 to-pink-100 border-4 border-pink-300 rounded-3xl p-8 text-center shadow-lg">
                        <div className="w-24 h-24 bg-white rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-md">
                            <svg
                                className="w-14 h-14 text-accent-pink"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                aria-hidden="true"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                    clipRule="evenodd"
                                />
                                <path d="M13 7a1 1 0 11-2 0 1 1 0 012 0zM9 7a1 1 0 11-2 0 1 1 0 012 0z" />
                            </svg>
                        </div>

                        <div className="flex items-center justify-center gap-2 mb-3">
                            <svg
                                className="w-6 h-6 text-pink-600"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                aria-hidden="true"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <h3 className="text-2xl font-sans font-bold text-pink-900">
                                Avoid Family Fights
                            </h3>
                        </div>

                        <p className="text-slate-700 leading-relaxed">
                            Prevent disputes and conflicts by clearly stating your wishes
                        </p>
                    </div>

                    {/* Reason 2 */}
                    <div className="feature-card bg-linear-to-br from-blue-50 to-blue-100 border-4 border-blue-300 rounded-3xl p-8 text-center shadow-lg">
                        <div className="w-24 h-24 bg-white rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-md">
                            <svg
                                className="w-14 h-14 text-accent-blue"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                aria-hidden="true"
                            >
                                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                            </svg>
                        </div>

                        <div className="flex items-center justify-center gap-2 mb-3">
                            <svg
                                className="w-6 h-6 text-blue-600"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                aria-hidden="true"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <h3 className="text-2xl font-sans font-bold text-blue-900">
                                Appoint Guardians
                            </h3>
                        </div>

                        <p className="text-slate-700 leading-relaxed">
                            Choose who will care for your minor children
                        </p>
                    </div>

                    {/* Reason 3 */}
                    <div className="feature-card bg-gradient-to-br from-yellow-50 to-yellow-100 border-4 border-yellow-300 rounded-3xl p-8 text-center shadow-lg">
                        <div className="w-24 h-24 bg-white rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-md">
                            <svg
                                className="w-14 h-14 text-accent-yellow"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                aria-hidden="true"
                            >
                                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0111 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>

                        <div className="flex items-center justify-center gap-2 mb-3">
                            <svg
                                className="w-6 h-6 text-yellow-700"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                aria-hidden="true"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <h3 className="text-2xl font-sans font-bold text-yellow-900">
                                Distribute Wealth
                            </h3>
                        </div>

                        <p className="text-slate-700 leading-relaxed">
                            Ensure your assets go exactly where you want them to
                        </p>
                    </div>

                    {/* Reason 4 */}
                    <div className="feature-card bg-gradient-to-br from-green-50 to-green-100 border-4 border-green-300 rounded-3xl p-8 text-center shadow-lg">
                        <div className="w-24 h-24 bg-white rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-md">
                            <svg
                                className="w-14 h-14 text-accent-green"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                aria-hidden="true"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                    clipRule="evenodd"
                                />
                                <path d="M13 7h2a1 1 0 011 1v1a1 1 0 11-2 0V8h-1a1 1 0 110-2h1V7z" />
                            </svg>
                        </div>

                        <div className="flex items-center justify-center gap-2 mb-3">
                            <svg
                                className="w-6 h-6 text-green-700"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                aria-hidden="true"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <h3 className="text-2xl font-sans font-bold text-green-900">
                                Care For Seniors
                            </h3>
                        </div>

                        <p className="text-slate-700 leading-relaxed">
                            Provide for elderly family members with specific provisions
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
