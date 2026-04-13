import React from 'react';

export type RevealMotionMode = 'fade-up' | 'fade-right' | 'scale-up';

export function RevealMotion({
    show,
    mode,
    delayClass = '',
    className = '',
    children,
}: {
    show: boolean;
    mode: RevealMotionMode;
    delayClass?: string;
    className?: string;
    children: React.ReactNode;
}) {
    const animation =
        mode === 'fade-up' ? 'animate-fadeInUp' : mode === 'fade-right' ? 'animate-fadeInRight' : 'animate-scaleInUp';
    return (
        <div className={`${show ? `${animation} ${delayClass}`.trim() : 'opacity-0'} ${className}`.trim()}>{children}</div>
    );
}

/** Matches `delay-*` utilities in `app.css` for staggered entrances. */
export const REVEAL_STAGGER = ['delay-100', 'delay-200', 'delay-300', 'delay-400', 'delay-500', 'delay-600', 'delay-700'] as const;

export function revealStagger(index: number): (typeof REVEAL_STAGGER)[number] {
    return REVEAL_STAGGER[Math.min(index, REVEAL_STAGGER.length - 1)];
}
