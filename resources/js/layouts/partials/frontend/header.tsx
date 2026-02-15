import { Link } from '@inertiajs/react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useState } from 'react';

type MobileSection = 'about' | 'estate' | 'support' | null;

const mobileLinks: Record<Exclude<MobileSection, null>, { label: string; route: Parameters<typeof route>[0] }[]> = {
    about: [
        { label: 'Horizon Wills', route: 'horizon-wills' },
        { label: 'Contact Us', route: 'contact' }
    ],
    estate: [
        { label: 'Will Writing', route: 'will-writing' },
        { label: 'Lasting Power of Attorney', route: 'lpa' }
    ],
    support: [{ label: 'Probate', route: 'probate' }]
};

export function FrontendHeader() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileDropdown, setMobileDropdown] = useState<MobileSection>(null);

    const toggleMobileDropdown = (section: Exclude<MobileSection, null>) => {
        setMobileDropdown((current) => (current === section ? null : section));
    };

    return (
        <header className="sticky top-0 z-50">
            <nav className="w-full bg-slate-800 text-white shadow-lg">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center space-x-3">
                            <svg className="h-12 w-12" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="50" cy="25" r="12" stroke="currentColor" strokeWidth="3" fill="none" />
                                <path d="M15 40 Q50 20, 85 40" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                            </svg>
                            <div>
                                <div className="font-sans text-2xl font-bold tracking-wider">HORIZON WILLS</div>
                                <div className="text-xs text-primary-300 tracking-widest">PROTECTING YOUR ASSETS</div>
                            </div>
                        </Link>

                        <div className="hidden items-center space-x-8 md:flex">
                            <div className="relative group">
                                <Link
                                    href={route('horizon-wills')}
                                    className="flex items-center gap-2 font-sans text-sm tracking-wide text-primary-100/90 transition-colors hover:text-primary-500"
                                >
                                    <span>About Us</span>
                                    <ChevronDown className="h-3 w-3 transition-transform duration-200 group-hover:rotate-180" />
                                </Link>

                                <div className="invisible absolute left-1/2 top-full mt-4 -translate-x-1/2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0">
                                    <div className="flex w-[420px] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white shadow-2xl ring-1 ring-primary-500/40">
                                        <div className="w-1/2 bg-primary-900/60 p-4 space-y-5">
                                            <p className="text-xs uppercase tracking-[0.3em] text-primary-100 font-semibold">About us</p>
                                            <ul className="space-y-3 text-sm text-primary-100">
                                                <li className="rounded-xl transition-colors duration-200 hover:bg-white/10">
                                                    <Link href={route('horizon-wills')} className="flex items-center gap-3 px-2 py-2 text-white">
                                                        <div className="w-8 h-8 rounded-2xl bg-white/10 border border-white/30 shadow flex items-center justify-center text-white">
                                                            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                                                <path d="M9 4a1 1 0 112 0v2h2a1 1 0 110 2h-2v2h2a1 1 0 110 2h-2v2a1 1 0 11-2 0v-2H7a1 1 0 110-2h2V8H7a1 1 0 110-2h2V4z" />
                                                            </svg>
                                                        </div>
                                                        <span className="font-semibold text-sm">HORIZON WILLS</span>
                                                    </Link>
                                                </li>
                                                <li className="flex items-center gap-3 group rounded-xl px-2 py-2 transition-colors duration-200 hover:bg-white/10">
                                                    <div className="w-8 h-8 rounded-2xl bg-white/10 border border-white/30 shadow flex items-center justify-center text-white">
                                                        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v3l-8 4-8-4V5z" />
                                                            <path d="M2 10l8 4 8-4v5a2 2 0 01-2 2H4a2 2 0 01-2-2v-5z" />
                                                        </svg>
                                                    </div>
                                                    <Link href={route('contact')} className="font-semibold text-sm transition-colors duration-200 group-hover:text-white">
                                                        Contact Us
                                                    </Link>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="w-1/2 p-6 flex flex-col justify-between bg-white text-primary-900">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2 text-primary-700">
                                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                        <path d="M12 3v18M5 9l7-6 7 6" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    <span className="font-semibold tracking-wide">Not sure where to start?</span>
                                                </div>
                                                <p className="text-sm text-primary-600 leading-relaxed">
                                                    Take the 1 min quiz to discover the right estate plan for you.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative group">
                                <button
                                    type="button"
                                    className="flex items-center gap-2 font-sans tracking-wide text-sm  text-primary-100/90 hover:text-primary-500 transition-colors"
                                >
                                    <span>Estate Planning</span>
                                    <ChevronDown className="w-3 h-3 transition-transform duration-200 group-hover:rotate-180" />
                                </button>

                                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-4 opacity-0 invisible group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
                                    <div className="w-[360px] bg-white rounded-3xl shadow-2xl border border-primary-100 p-6 text-primary-900 ring-1 ring-primary-200/60">
                                        <p className="text-xs uppercase tracking-[0.3em] text-primary-500 font-semibold mb-4">Estate Planning</p>
                                        <ul className="space-y-3 text-sm">
                                            <li className="flex gap-3 group rounded-2xl p-3 hover:bg-primary-50 transition">
                                                <div className="w-10 h-10 rounded-2xl border border-primary-200 flex items-center justify-center text-primary-600">
                                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                        <path d="M5 20h14M7 20V4l10 3v13" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <Link href={route('will-writing')} className="font-semibold text-primary-900">
                                                        Will Writing
                                                    </Link>
                                                    <p className="text-primary-500 text-xs">Write a will tailored to you</p>
                                                </div>
                                            </li>
                                            <li className="flex gap-3 group rounded-2xl p-3 hover:bg-primary-50 transition">
                                                <div className="w-10 h-10 rounded-2xl border border-primary-200 flex items-center justify-center text-primary-600">
                                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                        <path d="M12 12l-5-5m5 5l5-5m-5 5v9" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <Link href={route('lpa')} className="font-semibold text-primary-900">
                                                        Lasting Power of Attorney
                                                    </Link>
                                                    <p className="text-primary-500 text-xs">Choose who makes decisions for you</p>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="relative group">
                                <button
                                    type="button"
                                    className="flex items-center gap-2 font-sans tracking-wide text-sm text-primary-100/90 hover:text-primary-500 transition-colors"
                                >
                                    <span>Get Support After Loss</span>
                                    <ChevronDown className="w-3 h-3 transition-transform duration-200 group-hover:rotate-180" />
                                </button>

                                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-4 opacity-0 invisible group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
                                    <div className="w-[340px] bg-white rounded-3xl shadow-2xl border border-primary-100 p-6 text-primary-900 ring-1 ring-primary-200/60">
                                        <p className="text-xs uppercase tracking-[0.3em] text-primary-500 font-semibold mb-4">Get Support After Loss</p>
                                        <ul className="space-y-3 text-sm">
                                            <li className="flex gap-3 group rounded-2xl p-3 hover:bg-primary-50 transition">
                                                <div className="w-10 h-10 rounded-2xl border border-primary-200 flex items-center justify-center text-primary-600">
                                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                        <path d="M6 19h12M6 5h12M9 5v14M15 5v14" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <Link href={route('probate')} className="font-semibold text-primary-900">
                                                        Probate
                                                    </Link>
                                                    <p className="text-primary-500 text-xs">Guidance through probate</p>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <Link href={route('login')} className="text-pink-400  py-2 transition-all hover:text-primary-100 font-sans font-semibold">
                                Sign in
                            </Link>
                        </div>

                        <button
                            type="button"
                            className="md:hidden"
                            onClick={() => setMobileMenuOpen((open) => !open)}
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                        </button>
                    </div>

                    {mobileMenuOpen && (
                        <div className="rounded-2xl bg-white shadow-lg border border-slate-200 p-4 space-y-3 text-primary-900 md:hidden mt-4">
                            {Object.entries(mobileLinks).map(([key, links]) => (
                                <div key={key} className="rounded-2xl overflow-hidden">
                                    <button
                                        type="button"
                                        onClick={() => toggleMobileDropdown(key as Exclude<MobileSection, null>)}
                                        className="w-full flex items-center justify-between px-4 py-3 font-semibold text-primary-700 hover:bg-primary-50 transition"
                                    >
                                        <span>
                                            {key === 'about' && 'About Us'}
                                            {key === 'estate' && 'Estate Planning'}
                                            {key === 'support' && 'Get Support After Loss'}
                                        </span>
                                        <ChevronDown
                                            className={`w-4 h-4 transition-transform duration-200 ${mobileDropdown === key ? 'rotate-180' : ''
                                                }`}
                                        />
                                    </button>

                                    {mobileDropdown === key && (
                                        <div className={`px-2 pb-2 space-y-1 ${key === 'about' ? '' : ''}`}>
                                            {links.map((item) => (
                                                <Link
                                                    key={item.label}
                                                    href={route(item.route)}
                                                    onClick={() => {
                                                        setMobileMenuOpen(false);
                                                        setMobileDropdown(null);
                                                    }}
                                                    className="block rounded-xl px-4 py-2 text-sm font-medium text-primary-700 hover:bg-slate-50 transition"
                                                >
                                                    {item.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}

                            <div className="pt-1 space-y-2">
                                <Link
                                    href={route('contact')}
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        setMobileDropdown(null);
                                    }}
                                    className="inline-block rounded-full bg-primary-600 ml-3 px-6 py-3 font-semibold text-white transition hover:bg-primary-700 text-center"
                                >
                                    Contact Us
                                </Link>
                                <Link
                                    href={route('login')}
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        setMobileDropdown(null);
                                    }}
                                    className="block text-left rounded-xl px-4 py-3 font-semibold text-pink-600 hover:bg-pink-50 transition "
                                >
                                    Sign in
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
}
