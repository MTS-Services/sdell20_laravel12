import React from 'react';
import { Link } from '@inertiajs/react';

const StepsHeader: React.FC = () => (
    <div className="bg-primary-50 text-primary-900">
        <div className="container mx-auto flex items-center justify-between px-4 py-5">
            <Link href="/" className="flex items-center gap-3">
                <svg className="h-12 w-12" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="25" r="12" stroke="currentColor" strokeWidth="3" fill="none" />
                    <path d="M15 40 Q50 20, 85 40" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                </svg>
                <div>
                    <div className="font-sans text-xl font-bold tracking-wider">HORIZON WILLS</div>
                    <div className="text-xs text-primary-300 tracking-[0.3em]">PROTECTING YOUR ASSETS</div>
                </div>
            </Link>

            <div className="flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
                <span>Trustpilot</span>
                <div className="flex gap-0.5 text-emerald-400">
                    {[...Array(5)].map((_, index) => (
                        <svg key={`will-header-star-${index}`} className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

export default StepsHeader;
