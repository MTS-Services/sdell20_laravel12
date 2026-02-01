import { Link, usePage } from '@inertiajs/react';
import { Menu, XIcon } from 'lucide-react';
import { useState } from 'react';

import AppLogo from '@/components/app-logo';
import AppearanceToggleDropdown from '@/components/appearance-dropdown';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTrigger } from '@/components/ui/sheet';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { login, register } from '@/routes';
import { dashboard } from '@/routes';
import { type SharedData } from '@/types';

export function FrontendHeader() {
    const { auth, features } = usePage<SharedData>().props;
    const getInitials = useInitials();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50">
            {/* Navigation */}
            <nav className="w-full bg-slate-800 text-white z-50 shadow-lg">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <a href="/" className="flex items-center space-x-3">
                            <svg className="w-12 h-12" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="50" cy="25" r="12" stroke="currentColor" strokeWidth="3" fill="none" />
                                <path d="M15 40 Q50 20, 85 40" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                            </svg>
                            <div>
                                <div className="text-2xl font-sans font-bold tracking-wider">HORIZON WILLS</div>
                                <div className="text-xs text-slate-300 tracking-widest">PROTECTING YOUR ASSETS</div>
                            </div>
                        </a>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-8">
                            <div className="relative group">
                                <button className="flex items-center gap-2 font-sans tracking-wide text-sm text-slate-100/90 transition-colors hover:text-primary-500">
                                    <span>About Us</span>
                                    <svg className="w-3 h-3 transition-transform duration-200 group-hover:rotate-180" fill="none" viewBox="0 0 12 12" stroke="currentColor">
                                        <path d="M3 4l3 3 3-3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>

                                <div className="about-dropdown-wrapper">
                                    <div className="about-dropdown absolute left-1/2 top-full mt-4 w-max -translate-x-1/2 opacity-0 invisible transition-all duration-200 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0">
                                        <div className="about-dropdown__menu">
                                            <p className="about-dropdown__menu-title">About us</p>
                                            <ul className="about-dropdown__list">
                                                <li>
                                                    <a href="/" className="about-dropdown__item">
                                                        <span className="about-dropdown__icon">
                                                            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                                                <path d="M9 4a1 1 0 112 0v2h2a1 1 0 110 2h-2v2h2a1 1 0 110 2h-2v2a1 1 0 11-2 0v-2h-2a1 1 0 110-2h2V8H7a1 1 0 110-2h2V4z" />
                                                            </svg>
                                                        </span>
                                                        <span className="about-dropdown__label">HORIZON WILLS</span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="/" className="about-dropdown__item">
                                                        <span className="about-dropdown__icon">
                                                            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                                                <path d="M4 3a2 2 0 00-2 2v9a2 2 0 002 2h5v-2H4V9h6v2l4-3-4-3v2H4V5h10V3H4z" />
                                                            </svg>
                                                        </span>
                                                        <span className="about-dropdown__label">Guides</span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="/" className="about-dropdown__item">
                                                        <span className="about-dropdown__icon">
                                                            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                                                <path
                                                                    fillRule="evenodd"
                                                                    clipRule="evenodd"
                                                                    d="M10 3a1 1 0 01.894.553l2 4A1 1 0 0112 9H8a1 1 0 01-.894-1.447l2-4A1 1 0 0110 3zm-4.382 5.447A1 1 0 015.618 9H7v7a1 1 0 002 0v-3h2v3a1 1 0 002 0V9h1.382a1 1 0 00.894-1.447l-2-4a1 1 0 00-1.788 0l-2 4a1 1 0 01-.894.447H5.618z"
                                                                />
                                                            </svg>
                                                        </span>
                                                        <span className="about-dropdown__label">Careers</span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="/" className="about-dropdown__item">
                                                        <span className="about-dropdown__icon">
                                                            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                                                <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v3l-8 4-8-4V5z" />
                                                                <path d="M2 10l8 4 8-4v5a2 2 0 01-2 2H4a2 2 0 01-2-2v-5z" />
                                                            </svg>
                                                        </span>
                                                        <span className="about-dropdown__label">Contact Us</span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="about-dropdown__prompt">
                                            <div className="about-dropdown__prompt-title">Not sure where to start?</div>
                                            <p className="about-dropdown__prompt-text">Take the 1 min quiz to discover the right estate plan for you.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="relative group">
                                <button className="flex items-center gap-2 font-sans tracking-wide text-sm text-slate-100/90 transition-colors hover:text-primary-500">
                                    <span>Plan for Death</span>
                                    <svg className="w-3 h-3 transition-transform duration-200 group-hover:rotate-180" fill="none" viewBox="0 0 12 12" stroke="currentColor">
                                        <path d="M3 4l3 3 3-3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>

                                <div className="absolute left-1/2 top-full mt-4 w-max -translate-x-1/2 opacity-0 invisible transition-all duration-200 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0">
                                    <div className="w-[360px] rounded-3xl border border-primary-100 bg-white p-6 text-slate-900 shadow-2xl ring-1 ring-primary-200/60">
                                        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-primary-500">Plan for Death</p>
                                        <ul className="space-y-3 text-sm">
                                            <li className="flex gap-3 rounded-2xl p-3 transition hover:bg-primary-50">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary-200 text-primary-600">
                                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                        <path d="M5 20h14M7 20V4l10 3v13" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900">Will Writing</p>
                                                    <p className="text-xs text-slate-500">Write a will tailored to you</p>
                                                </div>
                                            </li>
                                            <li className="flex gap-3 rounded-2xl p-3 transition hover:bg-primary-50">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary-200 text-primary-600">
                                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                        <path d="M12 21s8-4.5 8-10.5S15.5 3 12 6.5C8.5 3 4 4.5 4 10.5S12 21 12 21z" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900">Life Insurance</p>
                                                    <p className="text-xs text-slate-500">Protection for the 21st century</p>
                                                </div>
                                            </li>
                                            <li className="flex gap-3 rounded-2xl p-3 transition hover:bg-primary-50">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary-200 text-primary-600">
                                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                        <path d="M12 12l-5-5m5 5l5-5m-5 5v9" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900">Lasting Power of Attorney</p>
                                                    <p className="text-xs text-slate-500">Choose who makes decisions for you</p>
                                                </div>
                                            </li>
                                            <li className="flex gap-3 rounded-2xl p-3 transition hover:bg-primary-50">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary-200 text-primary-600">
                                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                        <path d="M4 7h16M6 7V5a4 4 0 118 0v2" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M8 7V5a4 4 0 0116 0v2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900">Legacy Box</p>
                                                    <p className="text-xs text-slate-500">Make life easier for loved ones</p>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="relative group">
                                <button className="flex items-center gap-2 font-sans tracking-wide text-sm text-slate-100/90 transition-colors hover:text-primary-500">
                                    <span>Get Support After Loss</span>
                                    <svg className="w-3 h-3 transition-transform duration-200 group-hover:rotate-180" fill="none" viewBox="0 0 12 12" stroke="currentColor">
                                        <path d="M3 4l3 3 3-3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>

                                <div className="absolute left-1/2 top-full mt-4 w-max -translate-x-1/2 opacity-0 invisible transition-all duration-200 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0">
                                    <div className="w-[340px] rounded-3xl border border-primary-100 bg-white p-6 text-slate-900 shadow-2xl ring-1 ring-primary-200/60">
                                        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-primary-500">Get Support After Loss</p>
                                        <ul className="space-y-3 text-sm">
                                            <li className="flex gap-3 rounded-2xl p-3 transition hover:bg-primary-50">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary-200 text-primary-600">
                                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                        <path d="M12 21s-7-4.5-7-10.5a4 4 0 014-4c1.2 0 2.3.6 3 1.5A4 4 0 0115 6.5a4 4 0 014 4C19 16.5 12 21 12 21z" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900">Bereavement Support Hubs</p>
                                                    <p className="text-xs text-slate-500">Build a supportive community</p>
                                                </div>
                                            </li>
                                            <li className="flex gap-3 rounded-2xl p-3 transition hover:bg-primary-50">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary-200 text-primary-600">
                                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                        <path d="M6 19h12M6 5h12M9 5v14M15 5v14" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900">Probate</p>
                                                    <p className="text-xs text-slate-500">Guidance through probate</p>
                                                </div>
                                            </li>
                                            <li className="flex gap-3 rounded-2xl p-3 transition hover:bg-primary-50">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary-200 text-primary-600">
                                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                        <path d="M4 5h4l2 4h6a2 2 0 012 2v5h-4" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M9 21h6" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900">Dedicated Concierge</p>
                                                    <p className="text-xs text-slate-500">Personal support after loss</p>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <button className="font-sans font-semibold text-pink-400 transition-all hover:text-primary-100">
                                Sign in
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button onClick={() => setIsMobileMenuOpen((open) => !open)} className="md:hidden">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {isMobileMenuOpen && (
                        <div className="mt-4 space-y-4 pb-4 md:hidden">
                            <a href="#about" className="block transition-colors hover:text-primary-300">
                                About Us
                            </a>
                            <a href="#planning" className="block transition-colors hover:text-primary-300">
                                Plan for Death
                            </a>
                            <a href="#support" className="block transition-colors hover:text-primary-300">
                                Get Support After Loss
                            </a>
                            <button className="w-full rounded-full bg-white px-6 py-2 text-slate-800 transition-colors">
                                Take the Quiz
                            </button>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
}