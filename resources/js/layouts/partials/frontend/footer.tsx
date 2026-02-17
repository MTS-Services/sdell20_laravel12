import AppLogo from '@/components/app-logo';
import { Link } from '@inertiajs/react';

export function FrontendFooter() {
    return (
        <footer className="bg-primary-600 text-white">
            {/* Main Footer Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
                    {/* Logo & Social Icons */}
                    <div className="lg:col-span-3 flex flex-col items-center sm:items-start space-y-6">
                        <Link href="/" className="inline-block">
                            <AppLogo className="h-16 md:h-20 lg:h-24" />
                        </Link>

                        <div className="flex items-center gap-4 sm:pl-14 ">
                            {/* Facebook */}
                            <a
                                href="#"
                                className="text-white/80 transition-colors hover:text-white"
                                aria-label="Facebook"
                            >
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </a>
                            {/* Instagram */}
                            <a
                                href="#"
                                className="text-white/80 transition-colors hover:text-white"
                                aria-label="Instagram"
                            >
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                </svg>
                            </a>
                            {/* YouTube */}
                            <a
                                href="#"
                                className="text-white/80 transition-colors hover:text-white"
                                aria-label="YouTube"
                            >
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Links Column 1 */}
                    <div className="lg:col-span-4 flex flex-col items-center sm:items-start">
                        <nav className="flex flex-col space-y-3 text-center sm:text-left">
                            <Link
                                href={route('will-writing-online')}
                                className="text-base lg:text-lg text-white/90 transition-colors hover:text-slate-500"
                            >
                                About us
                            </Link>
                            <Link
                                href={route('privacy')}
                                className="text-base lg:text-lg text-white/90 transition-colors hover:text-slate-500"
                            >
                                Privacy policy
                            </Link>
                            <Link
                                href={route('terms')}
                                className="text-base lg:text-lg text-white/90 transition-colors hover:text-slate-500"
                            >
                                Terms and Conditions
                            </Link>
                            <Link
                                href={route('consumer-rights')}
                                className="text-base lg:text-lg text-white/90 transition-colors hover:text-slate-500"
                            >
                                Consumer Rights Act 2015
                            </Link>
                            <Link
                                href={route('cookies')}
                                className="text-base lg:text-lg text-white/90 transition-colors hover:text-slate-500"
                            >
                                Cookie policy
                            </Link>
                            <Link
                                href={route('contact')}
                                className="text-base lg:text-lg text-white/90 transition-colors hover:text-slate-500"
                            >
                                Contact us
                            </Link>
                        </nav>
                    </div>

                    {/* Links Column 2 */}
                    <div className="lg:col-span-2 flex flex-col items-center sm:items-start lg:pl-2">
                        <nav className="flex flex-col space-y-3 text-center sm:text-left">
                            <a href="#" className="text-base lg:text-lg text-white/90 transition-colors hover:text-slate-500">
                                Become an Affiliate
                            </a>
                            <a href="#" className="text-base lg:text-lg text-white/90 transition-colors hover:text-slate-500">
                                Affiliate Login
                            </a>
                        </nav>
                    </div>

                    {/* Google Rating */}
                    <div className="lg:col-span-3 flex flex-col items-center sm:items-start lg:items-end">
                        <div className="flex items-start gap-2">
                            {/* Google "G" icon */}
                            <svg className="h-8 w-8 shrink-0" viewBox="0 0 48 48">
                                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                                <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
                                <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
                            </svg>
                            <div>
                                <div className="flex items-center gap-1">
                                    <span className="text-xs text-white/70">Google Rating</span>
                                </div>
                                <div className="flex items-center gap-1 mt-0.5">
                                    <span className="text-base lg:text-lg font-bold text-white">4.6</span>                    {/* 5 Stars */}
                                    <div className="flex">
                                        {[1, 2, 3, 4].map((i) => (
                                            <svg key={i} className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                        {/* Half star */}
                                        <svg className="h-4 w-4 text-amber-400" viewBox="0 0 20 20">
                                            <defs>
                                                <linearGradient id="halfStar">
                                                    <stop offset="50%" stopColor="currentColor" />
                                                    <stop offset="50%" stopColor="#4b5563" />
                                                </linearGradient>
                                            </defs>
                                            <path fill="url(#halfStar)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    </div>
                                </div>
                                <p className="text-[11px] text-white/60 mt-0.5">Based on 23 reviews</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5">
                    <div className="flex flex-col items-center gap-2 text-xs text-white/60 sm:flex-row sm:gap-1 sm:text-left">
                        <p>Nightingale House, 46/48 East Street, Epsom, Surrey, KT17 1HQ</p>
                    </div>
                    <p className="mt-1 text-center text-xs text-white/60 sm:text-left">
                        &copy; 2026 Horizon Wills Ltd. Registered in England &amp; Wales, No. 15576136.
                    </p>
                </div>
            </div>
        </footer>
    );
}