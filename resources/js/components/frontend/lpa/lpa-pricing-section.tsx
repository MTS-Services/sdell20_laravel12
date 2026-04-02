import React from 'react';

export function LpaPricingSection() {
    return (
        <section className="bg-linear-to-b from-primary-50 via-white to-white px-6 py-24 text-center">
            <div className="mx-auto max-w-3xl space-y-6">
                <h2 className="text-4xl font-semibold text-primary-900 animate-fadeInUp">Creating your LPA shouldn’t be complicated.</h2>
                <p className="text-lg text-primary-600 animate-fadeInUp" style={{ animationDelay: '100ms' }}>
                    Work with our legal specialists online, over the phone, or at home. We draft, check, and send your forms ready for signing.
                </p>
                <div className="rounded-3xl border border-white/70 bg-white/90 p-10 shadow-xl animate-fadeInUp" style={{ animationDelay: '150ms' }}>
                    <span className="text-xs font-semibold uppercase tracking-[0.35em] text-primary-500">Flat pricing</span>
                    <p className="mt-4 text-2xl font-semibold text-primary-900">£99 per LPA (excl. VAT) with specialist review.</p>
                    <p className="mt-2 text-sm text-primary-600">
                        20% VAT is calculated and shown clearly at checkout. Each LPA also includes the £92 mandatory OPG register fee. Order both Health &amp; Welfare and Property &amp; Finance LPAs for £198 (excl. VAT) before VAT and OPG fees.
                    </p>
                    <p className="mt-3 text-xs text-primary-500">
                        The £92 register fee is mandatory for registration with the Office of Public Guardian.{' '}
                        <a
                            href="https://www.gov.uk/power-of-attorney/register"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-primary-700"
                        >
                            Learn more
                        </a>
                    </p>
                </div>
            </div>
        </section>
    );
}
