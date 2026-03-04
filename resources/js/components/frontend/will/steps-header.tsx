import React from 'react';
import { Link } from '@inertiajs/react';
import AppLogo from '@/components/app-logo';

const StepsHeader: React.FC = () => (
    <div className="bg-primary-700 text-white">
        <div className="container mx-auto flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:py-5">
            <Link href="/" className="flex items-center gap-3">
                <AppLogo className="h-18" />
            </Link>

            <div className="flex w-full flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/15 bg-linear-to-r from-sky-500/80 to-primary-500/80 px-4 py-3 text-[11px] font-semibold text-white sm:w-auto sm:text-sm">
                <span className="uppercase tracking-[0.3em] text-white/80">Trustpilot</span>
                <div className="flex gap-0.5 text-emerald-300">
                    {[...Array(5)].map((_, index) => (
                        <svg key={`will-header-star-${index}`} className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    ))}
                </div>
                <span className="text-[10px] font-normal text-white/80 sm:text-xs">4.9/5 from 2,700+ reviews</span>
            </div>
        </div>
    </div>
);

export default StepsHeader;
