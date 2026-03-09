import React from 'react';
import { router } from '@inertiajs/react';

import { useScrollAnimation } from '@/hooks/use-scroll-animation';

export function ReferralFeeSection() {
    const [sectionRef, isVisible] = useScrollAnimation<HTMLDivElement>();
    const animatedBase = 'transition-all duration-700 ease-out';
    const animatedState = isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6';

    const handleCheckout = () => {
        const baseAmount = 35000; // £350.00 in pence
        const vatAmount = Math.round(baseAmount * 0.20); // 20% VAT
        const totalAmount = baseAmount + vatAmount; // £420.00 total

        router.visit(`/checkout?amount=${totalAmount}&product=probate_referral&redirect_url=${encodeURIComponent('/probate')}`);
    };

    return (
        <section ref={sectionRef} className="bg-linear-to-br from-slate-200 to-slate-300 py-20 px-4 relative overflow-hidden wavy-bottom">
            <div className="absolute right-0 top-0 w-1/3 h-full slate-dots opacity-50"></div>

            <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
                <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 ${animatedBase} ${animatedState}`} style={{ transitionDelay: '0ms' }}>
                    Probate Referral Service
                </h2>
                <p className={`text-lg text-gray-800 max-w-3xl mx-auto ${animatedBase} ${animatedState}`} style={{ transitionDelay: '150ms' }}>
                    Connect with our trusted probate specialists to handle your estate administration needs.
                </p>

                {/* Pricing Card */}
                <div className={`max-w-2xl mx-auto ${animatedBase} ${animatedState}`} style={{ transitionDelay: '250ms' }}>
                    <div className="bg-white rounded-2xl p-8 shadow-lg">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Referral Fee</h3>

                        <div className="mb-6">
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700">Base referral fee</span>
                                    <span className="text-lg font-semibold text-gray-900">£350.00</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700">VAT (20%)</span>
                                    <span className="text-lg font-semibold text-gray-900">£70.00</span>
                                </div>
                                <div className="border-t border-slate-300 pt-3 flex justify-between items-center">
                                    <span className="text-gray-900 font-bold text-lg">Total</span>
                                    <span className="text-2xl font-bold text-gray-900">£420.00</span>
                                </div>
                            </div>
                        </div>

                        <p className="text-gray-700 mb-6 text-sm">
                            This one-time referral fee connects you with our specialist probate partners who will guide you through the entire process.
                        </p>

                        <button
                            onClick={handleCheckout}
                            disabled
                            className="w-full bg-gray-600  text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed "
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                            Pay £420.00 with Stripe
                        </button>

                        <p className="text-xs text-gray-500 mt-4 text-center">
                            Secure payment powered by Stripe. All prices include VAT.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
