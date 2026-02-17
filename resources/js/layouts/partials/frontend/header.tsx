import AppLogo from '@/components/app-logo';
import { Link } from '@inertiajs/react';
import { ChevronDown, ChevronRight, Menu, User, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type MobileSection = 'about' | 'estate' | 'support' | null;

const mobileLinks: Record<
    Exclude<MobileSection, null>,
    { label: string; desc: string; route: Parameters<typeof route>[0] }[]
> = {
    about: [
        { label: 'Will Writing Online', desc: 'Learn about our mission', route: 'will-writing-online' },
        { label: 'Contact Us', desc: 'Get in touch with our team', route: 'contact' },
    ],
    estate: [
        { label: 'Will Writing', desc: 'Write a will tailored to you', route: 'will-writing' },
        { label: 'Lasting Power of Attorney', desc: 'Choose who makes decisions for you', route: 'lpa' },
    ],
    support: [{ label: 'Probate', desc: 'Guidance through probate', route: 'probate' }],
};

const sectionLabels: Record<Exclude<MobileSection, null>, string> = {
    about: 'About Us',
    estate: 'Estate Planning',
    support: 'Get Support After Loss',
};

export function FrontendHeader() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileDropdown, setMobileDropdown] = useState<MobileSection>(null);
    const [activeDesktopDropdown, setActiveDesktopDropdown] = useState<string | null>(null);
    const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);

    const openDropdown = (key: string) => {
        if (closeTimeout.current) clearTimeout(closeTimeout.current);
        setActiveDesktopDropdown(key);
    };

    const closeDropdown = () => {
        closeTimeout.current = setTimeout(() => setActiveDesktopDropdown(null), 150);
    };

    const toggleMobileDropdown = (section: Exclude<MobileSection, null>) => {
        setMobileDropdown((current) => (current === section ? null : section));
    };

    const closeMobile = () => {
        setMobileMenuOpen(false);
        setMobileDropdown(null);
    };

    return (
        <header className="sticky top-0 z-50">
            {/* Top Announcement Banner */}
            <div className="bg-slate-500 py-2 text-center">
                <p className="px-4 font-serif  tracking-wide text-white text-base lg:text-xl">
                    <span className="">
                        Trusted by families across England &amp; Wales. Complete your LPA in as little as 15 minutes.
                    </span>
                </p>
            </div>

            {/* Main Navigation */}
            <nav className="w-full bg-primary-600">
                <div className="mx-auto flex container items-center justify-between px-4 lg:px-6">
                    {/* Logo */}
                    <Link href="/" className="flex shrink-0 items-center py-3">
                        <AppLogo className="h-20 sm:h-24" />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden items-center gap-5 xl:gap-7 lg:flex">
                        {/* ── About Us Dropdown ── */}
                        <div
                            className="relative"
                            onMouseEnter={() => openDropdown('about')}
                            onMouseLeave={closeDropdown}
                        >
                            <button
                                type="button"
                                className="flex items-center gap-1.5 py-5 font-sans text-sm font-semibold text-white/90 transition-colors hover:text-white"
                            >
                                About Us
                                <ChevronDown
                                    className={`h-3.5 w-3.5 transition-transform duration-200 ${activeDesktopDropdown === 'about' ? 'rotate-180' : ''}`}
                                />
                            </button>

                            <div
                                className={`absolute left-1/2 top-full z-50 -translate-x-1/2 transition-all duration-200 ${activeDesktopDropdown === 'about'
                                    ? 'visible translate-y-0 opacity-100'
                                    : 'invisible -translate-y-1 opacity-0 pointer-events-none'
                                    }`}
                            >
                                <div className="mt-3 flex w-[440px] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-black/5">
                                    {/* Left dark panel */}
                                    <div className="w-1/2 space-y-5 bg-linear-to-br from-primary-900 via-primary-800 to-primary-700 p-5">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary-200">
                                            About Us
                                        </p>
                                        <ul className="space-y-1">
                                            <li>
                                                <Link
                                                    href={route('will-writing-online')}
                                                    className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-white/10"
                                                >
                                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white">
                                                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
                                                        </svg>
                                                    </span>
                                                    <span className="text-sm font-bold uppercase tracking-wide text-white">
                                                        Will Writing Online
                                                    </span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href={route('contact')}
                                                    className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-white/10"
                                                >
                                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white">
                                                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                                        </svg>
                                                    </span>
                                                    <span className="text-sm font-semibold text-white">Contact Us</span>
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Right white panel */}
                                    <div className="flex w-1/2 flex-col justify-center bg-white p-6">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-primary-700">
                                                <svg
                                                    className="h-5 w-5"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                >
                                                    <path
                                                        d="M12 19V5m0 0l-4 4m4-4l4 4"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                                <span className="font-bold text-primary-900">
                                                    Not sure where to start?
                                                </span>
                                            </div>
                                            <p className="text-sm leading-relaxed text-primary-500">
                                                Take the 1 min quiz to discover the right estate plan for you.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Estate Planning Dropdown ── */}
                        <div
                            className="relative"
                            onMouseEnter={() => openDropdown('estate')}
                            onMouseLeave={closeDropdown}
                        >
                            <button
                                type="button"
                                className="flex items-center gap-1.5 py-5 font-sans text-sm font-semibold text-white/90 transition-colors hover:text-white"
                            >
                                Estate Planning
                                <ChevronDown
                                    className={`h-3.5 w-3.5 transition-transform duration-200 ${activeDesktopDropdown === 'estate' ? 'rotate-180' : ''}`}
                                />
                            </button>

                            <div
                                className={`absolute left-1/2 top-full z-50 -translate-x-1/2 transition-all duration-200 ${activeDesktopDropdown === 'estate'
                                    ? 'visible translate-y-0 opacity-100'
                                    : 'invisible -translate-y-1 opacity-0 pointer-events-none'
                                    }`}
                            >
                                <div className="mt-3 w-[360px] rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-black/5">
                                    <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-primary-400">
                                        Estate Planning
                                    </p>
                                    <ul className="space-y-2">
                                        <li>
                                            <Link
                                                href={route('will-writing')}
                                                className="flex items-center gap-4 rounded-xl p-3 transition hover:bg-primary-50"
                                            >
                                                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary-200 text-primary-600">
                                                    <svg
                                                        className="h-5 w-5"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                    >
                                                        <path
                                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                </span>
                                                <div>
                                                    <span className="block text-sm font-bold text-primary-900">
                                                        Will Writing
                                                    </span>
                                                    <span className="block text-xs text-primary-400">
                                                        Write a will tailored to you
                                                    </span>
                                                </div>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href={route('lpa')}
                                                className="flex items-center gap-4 rounded-xl p-3 transition hover:bg-primary-50"
                                            >
                                                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary-200 text-primary-600">
                                                    <svg
                                                        className="h-5 w-5"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                    >
                                                        <path
                                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                </span>
                                                <div>
                                                    <span className="block text-sm font-bold text-primary-900">
                                                        Lasting Power of Attorney
                                                    </span>
                                                    <span className="block text-xs text-primary-400">
                                                        Choose who makes decisions for you
                                                    </span>
                                                </div>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* ── Get Support After Loss Dropdown ── */}
                        <div
                            className="relative"
                            onMouseEnter={() => openDropdown('support')}
                            onMouseLeave={closeDropdown}
                        >
                            <button
                                type="button"
                                className="flex items-center gap-1.5 py-5 font-sans text-sm font-semibold text-white/90 transition-colors hover:text-white"
                            >
                                Get Support After Loss
                                <ChevronDown
                                    className={`h-3.5 w-3.5 transition-transform duration-200 ${activeDesktopDropdown === 'support' ? 'rotate-180' : ''}`}
                                />
                            </button>

                            <div
                                className={`absolute left-1/2 top-full z-50 -translate-x-1/2 transition-all duration-200 ${activeDesktopDropdown === 'support'
                                    ? 'visible translate-y-0 opacity-100'
                                    : 'invisible -translate-y-1 opacity-0 pointer-events-none'
                                    }`}
                            >
                                <div className="mt-3 w-[320px] rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-black/5">
                                    <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-primary-400">
                                        Get Support After Loss
                                    </p>
                                    <ul>
                                        <li>
                                            <Link
                                                href={route('probate')}
                                                className="flex items-center gap-4 rounded-xl p-3 transition hover:bg-primary-50"
                                            >
                                                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary-200 text-primary-600">
                                                    <svg
                                                        className="h-5 w-5"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                    >
                                                        <path
                                                            d="M8 21h8m-4-4v4m-4-8h8M4 5h16M6 9v4a6 6 0 006 6v0a6 6 0 006-6V9"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                </span>
                                                <div>
                                                    <span className="block text-sm font-bold text-primary-900">
                                                        Probate
                                                    </span>
                                                    <span className="block text-xs text-primary-400">
                                                        Guidance through probate
                                                    </span>
                                                </div>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: CTA Button + User Icon */}
                    <div className="hidden items-center gap-3 lg:flex">
                        <Link
                            href={route('lpa.start')}
                            className="group flex items-center gap-3 rounded-full bg-slate-500 py-2 pl-5 pr-2 transition-all hover:bg-slate-600 hover:shadow-lg"
                        >
                            <span className="flex flex-col leading-tight text-white">
                                <span className="text-xs font-bold tracking-wide xl:text-sm">
                                    Create Your LPA &ndash; Just &pound;299 Each
                                </span>
                                <span className="text-[10px] font-normal text-white/80">
                                    (plus &pound;92 OPG fee per LPA)
                                </span>
                            </span>
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 transition-colors group-hover:bg-white/30">
                                <ChevronRight className="h-4 w-4 text-white transition-transform group-hover:translate-x-0.5" />
                            </span>
                        </Link>

                        <Link
                            href={route('login')}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-500 text-white transition-colors hover:bg-slate-600"
                        >
                            <User className="h-5 w-5" />
                        </Link>
                    </div>

                    {/* Right Side: CTA + User + Hamburger (Mobile) */}
                    <div className="flex items-center lg:hidden">
                        {/* Vertical divider */}
                        <div className="mr-3 hidden h-10 w-px bg-white/15 sm:block" />

                        {/* CTA pill */}
                        <Link
                            href={route('lpa.start')}
                            className="group hidden items-center gap-1 rounded-full bg-slate-500 py-1.5 pl-3 pr-1.5 transition-all hover:bg-slate-600 sm:flex"
                        >
                            <span className="flex flex-col leading-tight text-white">
                                <span className="text-[10px] font-bold tracking-wide">
                                    Create Your LPA &ndash; Just &pound;99 Each
                                </span>
                                <span className="text-[9px] font-normal text-white/70">
                                    (plus &pound;92 OPG fee per LPA)
                                </span>
                            </span>
                            <span className="flex shrink-0 items-center text-slate-200">
                                <ChevronRight className="-mr-2 h-4 w-4" />
                                <ChevronRight className="h-4 w-4" />
                            </span>
                        </Link>

                        {/* User icon – dark rounded square */}
                        <Link
                            href={route('login')}
                            className="ml-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary-900/70 text-white transition-colors hover:bg-primary-900"
                        >
                            <User className="h-4 w-4" />
                        </Link>

                        {/* Hamburger – outlined box */}
                        <button
                            type="button"
                            className="ml-2 flex h-9 w-9 items-center justify-center rounded-md border border-white/20 text-white transition-colors hover:bg-white/10"
                            onClick={() => {
                                setMobileMenuOpen((o) => !o);
                                setMobileDropdown(null);
                            }}
                            aria-label="Toggle menu"
                        >
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M3 5h14M3 10h14M3 15h14" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu – Full-screen Overlay */}
                {mobileMenuOpen && (
                    <div className="fixed inset-0 z-50 flex flex-col bg-primary-600 lg:hidden">
                        {/* Header row: Logo + Close */}
                        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                            <Link href="/" onClick={closeMobile} className="flex shrink-0 items-center">
                                <AppLogo className="h-10 w-auto" />
                            </Link>
                            <button
                                type="button"
                                onClick={closeMobile}
                                className="flex h-9 w-9 items-center justify-center rounded-md text-white transition-colors hover:bg-white/10"
                                aria-label="Close menu"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Navigation list */}
                        <div className="flex-1 overflow-y-auto px-4 pb-8 pt-2">
                            {(Object.keys(mobileLinks) as Exclude<MobileSection, null>[]).map((key) => (
                                <div key={key} className="border-b border-white/10">
                                    <button
                                        type="button"
                                        onClick={() => toggleMobileDropdown(key)}
                                        className="flex w-full items-center justify-between py-4 text-left font-sans text-base font-semibold text-white"
                                    >
                                        {sectionLabels[key]}
                                        <ChevronDown
                                            className={`h-5 w-5 text-white/50 transition-transform duration-200 ${mobileDropdown === key ? 'rotate-180' : ''}`}
                                        />
                                    </button>
                                    <div
                                        className={`overflow-hidden transition-all duration-300 ${mobileDropdown === key ? 'max-h-80 pb-3' : 'max-h-0'
                                            }`}
                                    >
                                        <div className="space-y-0.5 pl-1">
                                            {mobileLinks[key].map((link) => (
                                                <Link
                                                    key={link.route}
                                                    href={route(link.route)}
                                                    onClick={closeMobile}
                                                    className="block border-l-2 border-white/20 py-3 pl-4 transition hover:border-slate-500 hover:bg-white/5"
                                                >
                                                    <span className="block text-sm font-medium text-white/90">
                                                        {link.label}
                                                    </span>
                                                    <span className="block text-xs text-white/40">{link.desc}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Mobile CTA + Sign in */}
                            <div className="mt-6 space-y-3">
                                <Link
                                    href={route('lpa.start')}
                                    onClick={closeMobile}
                                    className="flex items-center justify-center gap-2 rounded-full bg-slate-500 px-5 py-3.5 font-sans text-sm font-bold text-white transition hover:bg-slate-600"
                                >
                                    <span>Create Your LPA &ndash; Just &pound;99 Each</span>
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                                <Link
                                    href={route('login')}
                                    onClick={closeMobile}
                                    className="flex items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-3 font-sans text-sm font-semibold text-white transition hover:bg-white/10"
                                >
                                    <User className="h-4 w-4" />
                                    Sign in
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}
