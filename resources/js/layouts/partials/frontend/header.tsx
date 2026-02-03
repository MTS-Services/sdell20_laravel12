import { Link } from '@inertiajs/react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export function FrontendHeader() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [openMobileSection, setOpenMobileSection] = useState<'about' | 'estate' | 'support' | null>(null);

    const toggleMobileSection = (key: 'about' | 'estate' | 'support') => {
        setOpenMobileSection((prev) => (prev === key ? null : key));
    };

    // ✅ Only these are real:
    // - Home: "/"
    // - Horizon Wills: route('horizon-wills')
    // Everything else => "#"
    const aboutLinks = [
        { label: 'HORIZON WILLS', type: 'route' as const, href: 'horizon-wills' },
        { label: 'Contact Us', type: 'hash' as const, href: '#' },
    ];

    const estateLinks = [
        { label: 'Will Writing', type: 'route' as const, href: 'will-writing' },
        { label: 'Lasting Power of Attorney', type: 'route' as const, href: 'lpa' },
    ];

    const supportLinks = [{ label: 'Probate', type: 'hash' as const, href: '#' }];

    return (
        <header className="sticky top-0 z-50">
            <nav className="z-50 w-full bg-slate-800 text-white shadow-lg">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo (✅ only /) */}
                        <a href="/" className="flex items-center space-x-3">
                            <svg className="h-12 w-12" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="50" cy="25" r="12" stroke="currentColor" strokeWidth="3" fill="none" />
                                <path d="M15 40 Q50 20, 85 40" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                            </svg>
                            <div>
                                <div className="font-sans text-2xl font-bold tracking-wider">HORIZON WILLS</div>
                                <div className="text-xs tracking-widest text-slate-300">PROTECTING YOUR ASSETS</div>
                            </div>
                        </a>

                        {/* Desktop Menu */}
                        <div className="hidden items-center space-x-8 md:flex">
                            {/* About Us */}
                            <div className="group relative">
                                <Link
                                    href={route('horizon-wills')}
                                    className="flex items-center gap-2 font-sans text-sm tracking-wide text-slate-100/90 transition-colors hover:text-primary-500"
                                >
                                    <span>About Us</span>
                                    <ChevronDown className="h-3 w-3 transition-transform duration-200 group-hover:rotate-180" />
                                </Link>

                                <div className="invisible absolute left-1/2 top-full mt-4 -translate-x-1/2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                                    <div className="flex w-[420px] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white shadow-2xl ring-1 ring-primary-500/40">
                                        <div className="w-1/2 space-y-5 bg-primary-900/60 p-4">
                                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-100">About us</p>

                                            <ul className="space-y-3 text-sm text-primary-100">
                                                <li className="rounded-xl transition-colors duration-200 hover:bg-white/10">
                                                    <Link href={route('horizon-wills')} className="flex items-center gap-3 px-2 py-2 text-white">
                                                        <span className="flex h-8 w-8 items-center justify-center rounded-2xl border border-white/30 bg-white/10">
                                                            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                                <path d="M9 4a1 1 0 112 0v2h2a1 1 0 110 2h-2v2h2a1 1 0 110 2h-2v2a1 1 0 11-2 0v-2H7a1 1 0 110-2h2V8H7a1 1 0 110-2h2V4z" />
                                                            </svg>
                                                        </span>
                                                        <span className="text-sm font-semibold">HORIZON WILLS</span>
                                                    </Link>
                                                </li>

                                                <li className="rounded-xl px-2 py-2 transition-colors duration-200 hover:bg-white/10">
                                                    <Link href={route('contact')} className="flex items-center gap-3 text-white">
                                                        <span className="flex h-8 w-8 items-center justify-center rounded-2xl border border-white/30 bg-white/10">
                                                            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                                <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v3l-8 4-8-4V5z" />
                                                                <path d="M2 10l8 4 8-4v5a2 2 0 01-2 2H4a2 2 0 01-2-2v-5z" />
                                                            </svg>
                                                        </span>
                                                        <span className="text-sm font-semibold">Contact Us</span>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </div>

                                        <div className="flex w-1/2 flex-col justify-between bg-white p-6 text-slate-900">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2 text-primary-700">
                                                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                        <path d="M12 3v18M5 9l7-6 7 6" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    <span className="font-semibold tracking-wide">Not sure where to start?</span>
                                                </div>
                                                <p className="text-sm leading-relaxed text-slate-600">
                                                    Take the 1 min quiz to discover the right estate plan for you.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Estate Planning (top link is #) */}
                            <div className="group relative">
                                <a
                                    href="#"
                                    className="flex items-center gap-2 font-sans text-sm tracking-wide text-slate-100/90 transition-colors hover:text-primary-500"
                                >
                                    <span>Estate Planning</span>
                                    <ChevronDown className="h-3 w-3 transition-transform duration-200 group-hover:rotate-180" />
                                </a>

                                <div className="invisible absolute left-1/2 top-full mt-4 -translate-x-1/2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                                    <div className="w-[360px] rounded-3xl border border-primary-100 bg-white p-6 text-slate-900 shadow-2xl ring-1 ring-primary-200/60">
                                        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-primary-500">Estate Planning</p>

                                        <ul className="space-y-3 text-sm">
                                            <li className="flex items-start gap-3 rounded-2xl p-3 transition hover:bg-primary-50">
                                                <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary-100 bg-primary-50 text-primary-600">
                                                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                        <path d="M5 5h14v14H5z" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M9 3v4m6-4v4m-9 4h12" strokeLinecap="round" />
                                                    </svg>
                                                </span>
                                                <Link href={route('will-writing')} className="block">
                                                    <p className="font-semibold text-slate-900">Will Writing</p>
                                                    <p className="text-xs text-slate-500">Write a will tailored to you</p>
                                                </Link>
                                            </li>

                                            <li className="flex items-start gap-3 rounded-2xl p-3 transition hover:bg-primary-50">
                                                <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary-100 bg-primary-50 text-primary-600">
                                                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                        <path d="M12 21s8-4.5 8-10.5S15.5 3 12 6.5C8.5 3 4 4.5 4 10.5S12 21 12 21z" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </span>
                                                <Link href={route('lpa')} className="block">
                                                    <p className="font-semibold text-slate-900">Lasting Power of Attorney</p>
                                                    <p className="text-xs text-slate-500">Choose who makes decisions for you</p>
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Get Support After Loss (top link is #) */}
                            <div className="group relative">
                                <a
                                    href="#"
                                    className="flex items-center gap-2 font-sans text-sm tracking-wide text-slate-100/90 transition-colors hover:text-primary-500"
                                >
                                    <span>Get Support After Loss</span>
                                    <ChevronDown className="h-3 w-3 transition-transform duration-200 group-hover:rotate-180" />
                                </a>

                                <div className="invisible absolute left-1/2 top-full mt-4 -translate-x-1/2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                                    <div className="w-[340px] rounded-3xl border border-primary-100 bg-white p-6 text-slate-900 shadow-2xl ring-1 ring-primary-200/60">
                                        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-primary-500">Get Support After Loss</p>

                                        <ul className="space-y-3 text-sm">
                                            <li className="flex items-start gap-3 rounded-2xl p-3 transition hover:bg-primary-50">
                                                <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary-100 bg-primary-50 text-primary-600">
                                                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                        <path d="M4 6h16v12H4z" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M8 10h8m-8 4h5" strokeLinecap="round" />
                                                    </svg>
                                                </span>
                                                <div>
                                                    <p className="font-semibold text-slate-900">Probate</p>
                                                    <p className="text-xs text-slate-500">Guidance through probate</p>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Sign in (route not available => #) */}
                            <a href="#" className="font-sans font-semibold text-pink-400 transition-all hover:text-primary-100">
                                Sign in
                            </a>
                        </div>

                        {/* Mobile Menu Button */}
                        <button onClick={() => setIsMobileMenuOpen((open) => !open)} className="md:hidden" aria-label="Toggle menu">
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>

                    {/* Mobile Menu: ✅ same dropdown options now */}
                    {isMobileMenuOpen && (
                        <div className="mt-4 space-y-3 pb-4 md:hidden">
                            {/* About Us */}
                            <button
                                type="button"
                                onClick={() => toggleMobileSection('about')}
                                className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left font-sans text-sm"
                            >
                                <span>About Us</span>
                                <ChevronDown className={`h-4 w-4 transition-transform ${openMobileSection === 'about' ? 'rotate-180' : ''}`} />
                            </button>
                            {openMobileSection === 'about' && (
                                <div className="space-y-2 rounded-2xl border border-white/10 bg-slate-900/30 p-3">
                                    <Link href={route('horizon-wills')} className="block rounded-xl px-3 py-2 text-sm text-slate-100/90 hover:bg-white/10">
                                        HORIZON WILLS
                                    </Link>
                                    <Link href={route('contact')} className="block rounded-xl px-3 py-2 text-sm text-slate-100/90 hover:bg-white/10">
                                        Contact Us
                                    </Link>
                                </div>
                            )}

                            {/* Estate Planning */}
                            <button
                                type="button"
                                onClick={() => toggleMobileSection('estate')}
                                className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left font-sans text-sm"
                            >
                                <span>Estate Planning</span>
                                <ChevronDown className={`h-4 w-4 transition-transform ${openMobileSection === 'estate' ? 'rotate-180' : ''}`} />
                            </button>
                            {openMobileSection === 'estate' && (
                                <div className="space-y-2 rounded-2xl border border-white/10 bg-slate-900/30 p-3">
                                    <Link href={route('will-writing')} className="block rounded-xl px-3 py-2 text-sm text-slate-100/90 hover:bg-white/10">
                                        Will Writing
                                    </Link>
                                    <Link href={route('lpa')} className="block rounded-xl px-3 py-2 text-sm text-slate-100/90 hover:bg-white/10">
                                        Lasting Power of Attorney
                                    </Link>
                                </div>
                            )}

                            {/* Get Support After Loss */}
                            <button
                                type="button"
                                onClick={() => toggleMobileSection('support')}
                                className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left font-sans text-sm"
                            >
                                <span>Get Support After Loss</span>
                                <ChevronDown className={`h-4 w-4 transition-transform ${openMobileSection === 'support' ? 'rotate-180' : ''}`} />
                            </button>
                            {openMobileSection === 'support' && (
                                <div className="space-y-2 rounded-2xl border border-white/10 bg-slate-900/30 p-3">
                                    <a href="#" className="block rounded-xl px-3 py-2 text-sm text-slate-100/90 hover:bg-white/10">
                                        Probate
                                    </a>
                                </div>
                            )}

                            <a
                                href="#"
                                className="block rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-pink-300 hover:bg-white/10"
                            >
                                Sign in
                            </a>

                            <button className="w-full rounded-full bg-white px-6 py-2 text-slate-800 transition-colors hover:bg-slate-100">
                                Take the Quiz
                            </button>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
}
